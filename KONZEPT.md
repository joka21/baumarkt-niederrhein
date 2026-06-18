# Baumarkt Niederrhein – Konzept & Stand

> Stand: 18.06.2026 · Dokumentiert den bisherigen Entwicklungsstand der Website.

## 1. Idee & Ziel

**Baumarkt Niederrhein** ist ein regionaler Online-Marktplatz für **Handwerk und
Material am Niederrhein**. Geprüfte Handwerker und Händler aus der Region
präsentieren sich unter einer gemeinsamen, vertrauenswürdigen Marke – mit Profil,
Leistungen und Kontaktmöglichkeit. Kunden finden Anbieter nach Gewerk gefiltert.

Stilistisch orientiert sich die Oberfläche an einem **Airbnb-/Inserats-Look**:
Karten-Raster auf der Startseite, Gewerk-Filterleiste, ausführliche Detailseiten.

## 2. Technischer Stack

| Bereich        | Technologie                                  |
|----------------|----------------------------------------------|
| Framework      | **Next.js 16.2.9** (App Router, Turbopack)   |
| UI             | React 19.2.4                                 |
| Styling        | Tailwind CSS v4 (`@tailwindcss/postcss`)     |
| Datenbank/Auth | **Supabase** (`@supabase/ssr`, `supabase-js`)|
| Schrift        | Inter (`next/font/google`)                   |
| Sprache        | TypeScript 5                                 |
| Hosting        | Vercel                                       |

### Next.js 16 Besonderheit
Middleware heißt in Next.js 16 **Proxy** (`proxy.ts` im Root). Sie refresht bei
jedem Request die Supabase-Auth-Session, damit die Cookies gültig bleiben.

## 3. Seitenstruktur (App Router)

| Route                  | Typ      | Inhalt                                              |
|------------------------|----------|-----------------------------------------------------|
| `/`                    | dynamisch| Startseite: Anbieter-Raster + Gewerk-Filter         |
| `/anbieter/[slug]`     | dynamisch| Detailseite eines Anbieters (Profil, Kontakt)       |
| `/fuer-anbieter`       | statisch | Werbeseite für neue Anbieter (Vorteile, CTA)        |
| `/supabase-test`       | dynamisch| Test-/Debug-Seite für die Supabase-Verbindung       |
| `/impressum`           | statisch | Rechtstext                                          |
| `/datenschutz`         | statisch | Rechtstext                                          |
| `/agb`                 | statisch | Rechtstext                                          |

## 4. Komponenten

- **`Header`** – globale Kopfzeile / Navigation
- **`CategoryBar`** – horizontale Gewerk-Filterleiste (setzt `?kategorie=<slug>`)
- **`AnbieterCard`** – Karte im Raster (Startseite)
- **`GewerkeBild`** – flächenfüllendes Gewerk-Foto mit Fallback
- **`PlatzhalterBild`** – farbiger Platzhalter, wenn kein Foto vorhanden
- **`Footer`** – globaler Fußbereich

## 5. Datenmodell (Supabase)

```
anbieter
  id, slug, name, beschreibung, ort, plz, einzugsgebiet,
  kontakt_email, kontakt_telefon, logo_url, status

kategorien (= Gewerke)
  name, slug, icon

anbieter_kategorien  (n:m-Verknüpfung)
  verknüpft anbieter <-> kategorien (pro Eintrag genau ein Gewerk)
```

- Auf der Startseite werden nur Anbieter mit `status = "aktiv"` geladen.
- Die Gewerk-Filterung erfolgt aktuell **clientseitig in JS** (bei der kleinen
  Datenmenge ausreichend).
- Helfer `getGewerke()` in `lib/types.ts` extrahiert die verknüpften Gewerke.

### Gewerke & Platzhalterfarben (`lib/gewerke.ts`)
bodenleger · maler · fliesenleger · trockenbau · sanitaer · elektro · tischler ·
dachdecker · garten · material — jeweils mit eigener Platzhalterfarbe, Fallback `#64748B`.

## 6. Supabase-Anbindung

- **`utils/supabase/server.ts`** – Server-Client für Server Components (Cookies)
- **`utils/supabase/client.ts`** – Browser-Client
- **`utils/supabase/proxy.ts`** – Session-Refresh in der Proxy/Middleware

Konfiguration über Umgebungsvariablen:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

## 7. Offene Punkte / Bekannte Themen

- **Vercel-Env-Variablen:** `.env*` ist per `.gitignore` ausgeschlossen. Die
  Supabase-Variablen müssen im Vercel-Dashboard gesetzt sein, sonst crasht die
  Seite (Proxy ruft bei jedem Request `auth.getUser()` auf).
- **Leere Startseite ("Für dieses Gewerk sind aktuell keine Anbieter verfügbar"):**
  Tritt auf, wenn die Supabase-Query keine Daten liefert. Mögliche Ursachen:
  keine `aktiv`-Anbieter in der DB oder **RLS-Policies** verhindern den
  anonymen Lesezugriff. Query-Fehler werden im Code derzeit **verschluckt**
  (kein `error`-Handling) → liefert stillschweigend leere Daten.
- **Gewerk-Bilder:** laut Git-Historie für 7 von 10 Gewerken vorhanden.
- **Filterung** könnte bei wachsender Datenmenge auf serverseitige DB-Filterung
  umgestellt werden.

## 8. Nächste sinnvolle Schritte

1. Env-Variablen in Vercel setzen und Redeploy.
2. RLS-Policies in Supabase prüfen (anonymer SELECT auf `anbieter`,
   `kategorien`, `anbieter_kategorien`).
3. Fehlerbehandlung der Supabase-Queries ergänzen (statt Fehler zu verschlucken).
4. Restliche Gewerk-Bilder ergänzen.
