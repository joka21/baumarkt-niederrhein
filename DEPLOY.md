# Deploy

Die Seite www.baumarkt-niederrhein.de läuft bei Mittwald als Node.js-App
„Baumarkt-Niederrhein“ (App `a-xkaxum`, Projekt `p-c1s8hh`) im Verzeichnis
`/html/baumarkt-niederrhein`. Vercel wird nicht mehr verwendet.

## Ablauf

1. Änderungen auf `main` pushen. Der Server steht auf `main` und holt nur
   diesen Branch per Fast-Forward.
2. Per SSH auf dem Server `deploy.sh` starten:

   ```
   ssh mittwald-baumarkt 'cd /html/baumarkt-niederrhein && ./deploy.sh'
   ```

`deploy.sh` macht der Reihe nach:

- `git pull --ff-only` auf `main`
- `npm ci --include=dev` und `npm run build` (der Build liest die Inhalte aus MySQL)
- App mit `mittnitectl job stop node` anhalten, auf freien Port warten,
  mit `mittnitectl job start node` starten
- prüfen, dass `/robots.txt` und `/` antworten und der Job läuft

Am Ende steht „Deploy abgeschlossen: <commit>“. Bricht `git pull --ff-only` ab,
gibt es auf dem Server lokale Änderungen oder abweichende Commits: erst klären,
nicht erzwingen.

## SSH-Zugang

Eintrag in `~/.ssh/config` auf dem Arbeitsrechner:

```
Host mittwald-baumarkt
    HostName ssh.lashorst.project.host
    User service@medienwerkstatt-niederrhein.de@a-xkaxum
    IdentityFile ~/.ssh/id_ed25519_mittwald
    IdentitiesOnly yes
```

Der öffentliche Schlüssel ist im Mittwald-mStudio hinterlegt. Der private
Schlüssel liegt nur auf dem Arbeitsrechner und gehört nicht ins Repository.

## Umgebungsvariablen

Die Datenbank-Zugangsdaten stehen als `BAUMARKT_MYSQL_*` (Namen siehe
`.env.example` und `lib/db.ts`) auf dem Server in
`/html/baumarkt-niederrhein/.env`, lokal in `.env.local`.
Werte nie committen.
