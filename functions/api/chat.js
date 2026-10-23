const MAX_BODY_BYTES = 20_000;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 12;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const recentRequests = new Map();

function jsonResponse(status, body, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers
    }
  });
}

async function readJsonBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('INVALID_JSON');

  const decoder = new TextDecoder();
  let body = '';
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error('BODY_TOO_LARGE');
      }

      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return JSON.parse(body);
  } catch (error) {
    if (error.message === 'BODY_TOO_LARGE' || error instanceof SyntaxError) {
      throw error;
    }
    throw new Error('INVALID_JSON');
  }
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

function isRateLimited(clientIp) {
  const now = Date.now();
  const timestamps = (recentRequests.get(clientIp) || []).filter(
    timestamp => now - timestamp < RATE_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT) {
    recentRequests.set(clientIp, timestamps);
    return true;
  }

  timestamps.push(now);
  recentRequests.set(clientIp, timestamps);

  if (recentRequests.size > 5000) {
    for (const [ip, requests] of recentRequests) {
      if (!requests.some(timestamp => now - timestamp < RATE_WINDOW_MS)) {
        recentRequests.delete(ip);
      }
    }
  }
  return false;
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Diese Anfrage wird nicht unterstützt.' }, { Allow: 'POST' });
  }

  const origin = request.headers.get('Origin');
  let requestOrigin;
  try {
    requestOrigin = origin ? new URL(origin).origin : '';
  } catch {
    requestOrigin = '';
  }
  if (!requestOrigin || requestOrigin !== new URL(request.url).origin) {
    return jsonResponse(403, { error: 'Diese Website darf den Chat nicht aufrufen.' });
  }

  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(clientIp)) {
    return jsonResponse(429, { error: 'Zu viele Fragen in kurzer Zeit. Bitte warte eine Minute.' });
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error.message === 'BODY_TOO_LARGE') {
      return jsonResponse(413, { error: 'Die Anfrage ist zu groß.' });
    }
    return jsonResponse(400, { error: 'Die Anfrage enthält kein gültiges JSON.' });
  }

  if (!isValidMessages(body?.messages)) {
    return jsonResponse(400, { error: 'Bitte stelle eine gültige Frage (maximal 1000 Zeichen).' });
  }

  if (!env.OPENAI_API_KEY) {
    return jsonResponse(503, { error: 'Der Chat ist noch nicht konfiguriert. Bitte prüfe das OPENAI_API_KEY-Secret in Cloudflare.' });
  }

  let openAIResponse;
  try {
    openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: {
          id: env.OPENAI_PROMPT_ID || 'pmpt_6ad8cd2a9ec08190b9394d27aa9a1e0606439f58c2ab47b7',
          version: env.OPENAI_PROMPT_VERSION || '1'
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
    return jsonResponse(502, { error: 'OpenAI ist gerade nicht erreichbar. Prüfe deine Internetverbindung und versuche es erneut.' });
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

    const errors = {
      400: 'OpenAI hat die Anfrage abgelehnt. Prüfe Prompt-ID und Version in der OpenAI-Plattform.',
      401: 'OpenAI hat den API-Schlüssel abgelehnt. Prüfe das OPENAI_API_KEY-Secret in Cloudflare.',
      403: 'OpenAI verweigert den Zugriff. Prüfe Projektberechtigungen und API-Zugriff.',
      429: 'Das OpenAI-Nutzungslimit ist erreicht oder es ist kein API-Guthaben verfügbar. Prüfe Abrechnung und Limits.'
    };
    return jsonResponse(502, {
      error: errors[openAIResponse.status] ||
        `OpenAI konnte nicht antworten (HTTP ${openAIResponse.status}). Prüfe die Cloudflare Function-Logs.`
    });
  }

  let data;
  try {
    data = await openAIResponse.json();
  } catch (error) {
    console.error('OpenAI API returned invalid JSON:', error);
    return jsonResponse(502, { error: 'Die Antwort von OpenAI konnte nicht gelesen werden.' });
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
    return jsonResponse(502, { error: 'OpenAI hat keinen Antworttext zurückgegeben. Prüfe den Prompt in der OpenAI-Plattform.' });
  }

  return jsonResponse(200, { reply });
}
