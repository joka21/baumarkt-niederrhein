#!/usr/bin/env bash
# Läuft auf dem Mittwald-Server im Installationsverzeichnis der Node.js-App.
# Arbeitet nur in /html/baumarkt-niederrhein.
set -euo pipefail

APP_DIR="/html/baumarkt-niederrhein"

cd "$(dirname "$0")"
if [ "$(pwd -P)" != "$(cd "$APP_DIR" && pwd -P)" ]; then
  echo "FEHLER: deploy.sh muss in ${APP_DIR} liegen, nicht in $(pwd -P)." >&2
  exit 1
fi
APP_REAL="$(pwd -P)"

# Mittwald gibt den Port vor; in der SSH-Sitzung ist er nicht gesetzt.
PORT="$(tr '\0' '\n' </proc/1/environ | sed -n 's/^PORT=//p')"
BASE_URL="http://127.0.0.1:${PORT}"

git pull --ff-only
# Der Build braucht die devDependencies (z. B. TypeScript), auch bei NODE_ENV=production.
npm ci --include=dev
npm run build

# Kein "mittnitectl job restart": Bei Hauskompass meldete es Erfolg, obwohl der
# alte Prozess weiterlief. Deshalb getrennt stoppen, Port-Freigabe abwarten und starten.
mittnitectl job stop node

# Übrig gebliebene Prozesse beenden, aber nur solche aus diesem Verzeichnis.
for proc in /proc/[0-9]*; do
  [ "$(readlink "$proc/cwd" 2>/dev/null || true)" = "$APP_REAL" ] || continue
  case "$(tr '\0' ' ' <"$proc/cmdline" 2>/dev/null || true)" in
    "npm start"*|*"next start"*|next-server*) kill -TERM "${proc#/proc/}" 2>/dev/null || true ;;
  esac
done

for _ in $(seq 1 30); do
  curl -s -o /dev/null --max-time 2 "${BASE_URL}/robots.txt" || break
  sleep 1
done
if curl -s -o /dev/null --max-time 2 "${BASE_URL}/robots.txt"; then
  echo "FEHLER: Port ${PORT} ist nach dem Stoppen noch belegt." >&2
  exit 1
fi

mittnitectl job start node

# Bricht ab, wenn die App nicht läuft. Die Datenbank prüft schon der Build,
# weil er die Seiten aus MySQL vorab erzeugt.
for _ in $(seq 1 30); do
  if curl -fs -o /dev/null --max-time 5 "${BASE_URL}/robots.txt" \
    && curl -fs -o /dev/null --max-time 15 "${BASE_URL}/"; then
    # Erst in eine Variable: "mittnitectl … | grep -q" endet mit pipefail sonst
    # mit SIGPIPE (141), sobald grep fündig wird und die Pipe schließt.
    status="$(mittnitectl job status node 2>&1 || true)"
    if grep -q "(running" <<<"$status"; then
      echo "Deploy abgeschlossen: $(git rev-parse --short HEAD)"
      exit 0
    fi
  fi
  sleep 2
done

echo "FEHLER: App ist nach dem Start nicht gesund." >&2
mittnitectl job status node >&2 || true
exit 1
