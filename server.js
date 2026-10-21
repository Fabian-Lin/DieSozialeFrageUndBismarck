const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const ROOT = __dirname;

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const MAX_BODY_BYTES = 20_000;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 12;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const recentRequests = new Map();

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let tooLarge = false;
    req.setEncoding('utf8');
    req.on('data', chunk => {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
        body = '';
        tooLarge = true;
      }
    });
    req.on('end', () => {
      if (tooLarge) {
        reject(new Error('BODY_TOO_LARGE'));
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

function isValidMessages(messages) {
  return Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages[messages.length - 1]?.role === 'user' &&
    messages.every(message =>
      message &&
      ['user', 'assistant'].includes(message.role) &&
      typeof message.content === 'string' &&
      message.content.trim().length > 0 &&
      message.content.length <= MAX_MESSAGE_LENGTH
    );
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin || !req.headers.host) return false;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function checkRateLimit(req) {
  const now = Date.now();
  const client = req.socket.remoteAddress || 'unknown';
  const timestamps = (recentRequests.get(client) || []).filter(
    timestamp => now - timestamp < RATE_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT) {
    recentRequests.set(client, timestamps);
    return false;
  }

  timestamps.push(now);
  recentRequests.set(client, timestamps);
  return true;
}

async function handleChat(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Diese Anfrage wird nicht unterstützt.' });
  }

  if (!isSameOrigin(req)) {
    return sendJson(res, 403, { error: 'Diese Website darf den Chat nicht aufrufen.' });
  }

  if (!checkRateLimit(req)) {
    return sendJson(res, 429, { error: 'Zu viele Fragen in kurzer Zeit. Bitte warte eine Minute.' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured.');
    return sendJson(res, 503, { error: 'Lege OPENAI_API_KEY in der Datei .env an und starte den Server neu.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    if (error.message === 'BODY_TOO_LARGE') {
      return sendJson(res, 413, { error: 'Die Anfrage ist zu groß.' });
    }
    if (error.message === 'INVALID_JSON') {
      return sendJson(res, 400, { error: 'Die Anfrage enthält kein gültiges JSON.' });
    }
    console.error('Could not read chat request:', error);
    return sendJson(res, 400, { error: 'Die Anfrage konnte nicht gelesen werden.' });
  }

  if (!isValidMessages(body.messages)) {
    return sendJson(res, 400, { error: 'Bitte stelle eine gültige Frage (maximal 1000 Zeichen).' });
  }

  let openAIResponse;
  try {
    openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: {
          id: process.env.OPENAI_PROMPT_ID || 'pmpt_6ad8cd2a9ec08190b9394d27aa9a1e0606439f58c2ab47b7',
          version: process.env.OPENAI_PROMPT_VERSION || '1'
        },
        input: body.messages.map(message => ({
          role: message.role,
          content: message.content
        })),
        stream: false,
        store: false,
        max_output_tokens: 350
      }),
      signal: AbortSignal.timeout(45_000)
    });
  } catch (error) {
    console.error('Could not reach the OpenAI API:', error);
    return sendJson(res, 502, { error: 'OpenAI ist gerade nicht erreichbar. Prüfe deine Internetverbindung und versuche es erneut.' });
  }

  if (!openAIResponse.ok) {
    let apiError = '';
    try {
      const data = await openAIResponse.json();
      apiError = data.error?.message || '';
    } catch {
      apiError = 'OpenAI hat keine lesbare Fehlermeldung zurückgegeben.';
    }
    console.error(`OpenAI API returned status ${openAIResponse.status}: ${apiError}`);

    const messages = {
      400: 'OpenAI hat die Anfrage abgelehnt. Prüfe Prompt-ID und Version in der OpenAI-Plattform.',
      401: 'OpenAI hat den API-Schlüssel abgelehnt. Prüfe OPENAI_API_KEY in der Datei .env.',
      403: 'OpenAI verweigert den Zugriff. Prüfe Projektberechtigungen und API-Zugriff.',
      429: 'Das OpenAI-Nutzungslimit ist erreicht oder es ist kein API-Guthaben verfügbar. Prüfe Abrechnung und Limits.'
    };
    return sendJson(res, 502, {
      error: messages[openAIResponse.status] ||
        `OpenAI konnte nicht antworten (HTTP ${openAIResponse.status}). Prüfe die Serverkonsole.`
    });
  }

  let data;
  try {
    data = await openAIResponse.json();
  } catch (error) {
    console.error('OpenAI API returned invalid JSON:', error);
    return sendJson(res, 502, { error: 'Die Antwort von OpenAI konnte nicht gelesen werden.' });
  }

  const reply = Array.isArray(data.output)
    ? data.output
        .flatMap(item => (Array.isArray(item.content) ? item.content : []))
        .filter(item => item.type === 'output_text' || item.type === 'refusal')
        .map(item => item.text || '')
        .join('')
        .trim()
    : '';

  if (!reply) {
    console.error('OpenAI API response did not contain output text.');
    return sendJson(res, 502, { error: 'OpenAI hat keinen Antworttext zurückgegeben. Prüfe den Prompt in der OpenAI-Plattform.' });
  }

  return sendJson(res, 200, { reply });
}

function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return sendJson(res, 405, { error: 'Diese Anfrage wird nicht unterstützt.' });
  }

  let relativePath;
  try {
    relativePath = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).slice(1);
  } catch {
    return sendJson(res, 400, { error: 'Ungültiger Dateipfad.' });
  }
  if (relativePath.includes('\\')) {
    return sendJson(res, 404, { error: 'Seite nicht gefunden.' });
  }
  const allowedPath =
    ['index.html', 'style.css', 'script.js', 'Quellen.txt'].includes(relativePath) ||
    relativePath.startsWith('bilder/') ||
    relativePath.startsWith('audios/');

  if (!allowedPath || relativePath.split('/').some(part => part.startsWith('.'))) {
    return sendJson(res, 404, { error: 'Seite nicht gefunden.' });
  }

  const filePath = path.resolve(ROOT, relativePath);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    return sendJson(res, 404, { error: 'Seite nicht gefunden.' });
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code !== 'ENOENT') console.error('Could not read website file:', error);
      return sendJson(res, error.code === 'ENOENT' ? 404 : 500, { error: 'Die Datei konnte nicht geladen werden.' });
    }

    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8',
      '.mp3': 'audio/mpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg'
    };
    res.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  } catch {
    return sendJson(res, 400, { error: 'Ungültige URL.' });
  }

  if (pathname === '/api/chat') return handleChat(req, res);
  return serveStatic(req, res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`Website-Server läuft auf Port ${PORT}.`);
  console.log(`Auf diesem Computer: http://localhost:${PORT}`);
  console.log('Für andere Geräte im Heimnetz: http://<IPv4-Adresse-dieses-Computers>:' + PORT);
  console.log('Den Port nicht im Router für das Internet freigeben.');
});
