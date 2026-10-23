# Cloudflare Workers mit statischen Assets

Die Website wird als statisches Asset auf Cloudflare Workers gehostet. Ein kleiner Worker verarbeitet `/api/chat`; die Website selbst wird weiterhin statisch ausgeliefert. Node.js muss dafür nicht auf dem eigenen Computer laufen.

## Veröffentlichung

1. Stelle sicher, dass die Änderungen in einem GitHub-Repository liegen.
2. Öffne deinen bestehenden Worker in Cloudflare unter **Workers & Pages → dein Worker → Settings → Builds** und verbinde dort das GitHub-Repository. Wenn du einen neuen Worker anlegst, wähle **Create application → GitHub** und importiere das Repository.
3. Setze den **Build command** auf `node build.js` und den **Deploy command** auf `npx wrangler deploy`. Die `wrangler.jsonc` bindet den Ordner `dist` als statische Assets ein und leitet `/api/*` an `worker.js` weiter. Falls der Worker schon existiert, muss der Wert `name` in `wrangler.jsonc` exakt mit dem Cloudflare-Worker-Namen übereinstimmen.
4. Speichere die Build-Einstellungen und löse einen neuen Build aus (zum Beispiel durch einen Git-Push).
5. Öffne danach den Worker unter **Settings → Variables & Secrets** und füge `OPENAI_API_KEY` als **Secret** hinzu. Optional kannst du `OPENAI_PROMPT_ID` und `OPENAI_PROMPT_VERSION` als Variablen setzen. Speichere und deploye die Änderungen erneut.
6. Rufe die `workers.dev`-Adresse des Workers auf und teste den Chat. Die statische Website wird über Assets ausgeliefert; `/api/chat` wird von `worker.js` an `functions/api/chat.js` weitergereicht.

Die Meldung „Variables cannot be added to a Worker that only has static assets“ erscheint, wenn der Worker noch kein Worker-Skript hat. Mit `worker.js` und `wrangler.jsonc` wird ein Skript mit statischen Assets deployed; danach können Runtime-Secrets unter **Settings → Variables & Secrets** gesetzt werden. Achte darauf, das Secret als Runtime-Secret und nicht als Build-Variable einzutragen.

OpenAI-API-Anfragen können weiterhin Kosten verursachen; setze deshalb ein Nutzungslimit beim API-Anbieter.

## Lokal testen

Für den bestehenden Node-Server muss `OPENAI_API_KEY` in der Umgebung gesetzt sein. In PowerShell kannst du den Schlüssel für den aktuellen Terminal-Prozess setzen und danach den Server starten:

```powershell
$env:OPENAI_API_KEY = "<dein Schlüssel>"
node server.js
```

Alternativ kannst du Worker und Assets lokal mit Wrangler testen:

1. Lege im Projektstamm eine Datei `.dev.vars` an und trage dort `OPENAI_API_KEY=...` ein.
2. Führe `node build.js` und danach `npx wrangler dev` aus.

`.dev.vars`, `.env` und der Build-Ordner `dist` sind in `.gitignore` eingetragen. Da `.env` in diesem Repository bereits von Git verfolgt wird, wird sie dadurch nicht automatisch aus der Versionsverwaltung entfernt. Vor dem Push kannst du sie mit `git rm --cached .env` aus Git entfernen; die lokale Datei bleibt dabei erhalten. Falls ein echter API-Schlüssel bereits in Git gespeichert oder veröffentlicht wurde, widerrufe ihn und erstelle einen neuen.