# Sozialversicherungen_Bismarck_Website

Website zum Schulprojekt über Bismarcks Sozialgesetzgebung. Die Website und der Chat können gemeinsam auf einem eigenen Computer zuhause laufen. Dafür muss der Computer eingeschaltet und mit dem Internet verbunden sein.

## Zuhause starten

1. Installiere Node.js (Version 18 oder neuer) auf dem Computer, auf dem die Website laufen soll.
2. Lege eine private Datei `.env` im Projektordner an. Du kannst `.env.example` als Vorlage verwenden:

   ```text
   OPENAI_API_KEY=dein-api-schluessel
   ```

   Verwende deinen tatsächlichen OpenAI-API-Schlüssel nur in dieser Datei. `.env` wird durch `.gitignore` von Git ausgeschlossen. Teile den Schlüssel niemals im Browser, auf GitHub oder in Nachrichten.
3. Öffne PowerShell im Projektordner und starte:

   ```powershell
   node server.js
   ```

4. Öffne `http://localhost:3000`. Lass das PowerShell-Fenster offen, solange du die Website benutzen möchtest.

Der Server verwendet standardmäßig den OpenAI-Prompt `pmpt_6ad8cd2a9ec08190b9394d27aa9a1e0606439f58c2ab47b7` in Version `1`. Falls du einen anderen Prompt in OpenAI erstellt hast, kannst du in `.env` zusätzlich `OPENAI_PROMPT_ID` und `OPENAI_PROMPT_VERSION` setzen. Der API-Schlüssel wird ausschließlich vom lokalen Server verwendet. Die OpenAI API benötigt ein verfügbares API-Guthaben; ein ChatGPT-Abo allein reicht nicht.

## Zugriff von anderen Geräten im Heimnetz

Der Server lauscht standardmäßig auf allen Netzwerkschnittstellen, damit andere Geräte im Heimnetz ihn erreichen können:

1. Starte den Server wie oben beschrieben.
2. Finde die lokale IPv4-Adresse des Server-Computers heraus: Öffne ein zweites PowerShell-Fenster und führe `ipconfig` aus. Suche beim verbundenen WLAN- oder Ethernet-Adapter nach **IPv4-Adresse** (zum Beispiel `192.168.1.25`).
3. Öffne auf einem anderen Gerät im selben WLAN `http://192.168.1.25:3000` und ersetze die Beispieladresse durch die IPv4-Adresse deines Computers.
4. Falls Windows nachfragt, erlaube Node.js den Zugriff nur in privaten Netzwerken. Wenn eine Firewall den Zugriff blockiert, erlaube gezielt eingehende Verbindungen für den privaten Netzwerktyp auf Port `3000`.

Der API-Schlüssel bleibt in `.env` auf dem Server-Computer; die anderen Geräte erhalten ihn nicht. Der Server hat eine einfache Begrenzung auf zehn Chat-Anfragen pro Minute und akzeptiert nur Anfragen von derselben Website. **Leite Port 3000 nicht im Router ins Internet weiter**: Das Heimnetz ist kein Ersatz für eine öffentliche Absicherung, und unbefugte Chat-Anfragen könnten API-Kosten verursachen. Um den Server nur auf dem eigenen Computer erreichbar zu machen, setze `HOST=127.0.0.1` in `.env` und starte ihn neu.

## Fehlermeldungen

- **Chat ist noch nicht eingerichtet:** Prüfe, ob `.env` im Projektordner liegt und `OPENAI_API_KEY=...` enthält. Starte `node server.js` anschließend neu.
- **OpenAI hat den API-Schlüssel abgelehnt:** Prüfe, ob der Schlüssel korrekt und aktiv ist.
- **OpenAI verweigert den Zugriff:** Prüfe die API-Berechtigungen des OpenAI-Projekts.
- **Nutzungslimit erreicht:** Prüfe API-Abrechnung, Guthaben und Limits in der OpenAI API-Plattform.
- **Prompt-ID oder Version:** Prüfe die vorhandenen Prompt-Einstellungen in OpenAI oder setze `OPENAI_PROMPT_ID` und `OPENAI_PROMPT_VERSION` in `.env`.

Die vollständige Fehlermeldung mit technischen Details erscheint in dem PowerShell-Fenster, in dem der Server läuft.
