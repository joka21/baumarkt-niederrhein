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
| Datenbank      | **MySQL** bei Mittwald (`mysql2`)            |
| Schrift        | Inter (`next/font/google`)                   |
| Sprache        | TypeScript 5                                 |
| Hosting        | Vercel                                       |

### Next.js 16 Besonderheit
Es gibt keine Middleware/Proxy und keine Anmeldung. Öffentliche Daten werden ohne
Cookies geladen, damit die Seiten statisch erzeugt und per ISR (stündlich) aktualisiert
werden können.

## 3. Seitenstruktur (App Router)

| Route                  | Typ      | Inhalt                                              |
|------------------------|----------|-----------------------------------------------------|
| `/`                    | dynamisch| Startseite: Anbieter-Raster + Gewerk-Filter         |
| `/fuer-anbieter`       | statisch | Werbeseite für neue Anbieter (Vorteile, CTA)        |
| `/impressum`           | statisch | Rechtstext                                          |
| `/datenschutz`         | statisch | Rechtstext                                          |
| `/agb`                 | statisch | Rechtstext                                          |

## 4. Komponenten

- **`Header`** – globale Kopfzeile / Navigation
- **`Footer`** – globaler Fußbereich

## 5. Datenmodell (MySQL)

Schema: `db/mysql/001_schema.sql`, Inhalte: `db/mysql/002_daten.sql`.

```
kategorien (= Gewerke)
  id, name, slug, icon

artikel (Ratgeber)
  id, slug, titel, auszug, inhalt, cover_url, autor, kategorie_slug, status,
  veroeffentlicht_am, aktualisiert_am, erstellt_am, seo_titel, seo_beschreibung
```

Betriebe und Anfragen liegen nicht in dieser Datenbank, sondern im Hub.
Das Team steht statisch in `lib/autoren.ts`.

## 6. Datenbank-Anbindung

- **`lib/db.ts`** – serverseitiger Verbindungspool (`mysql2`), SSL über `BAUMARKT_MYSQL_SSL`
- **`lib/artikel.ts`** – alle Abfragen für Artikel und Kategorien

Konfiguration über Umgebungsvariablen (Vorlage: `.env.example`):
```
BAUMARKT_MYSQL_HOST
BAUMARKT_MYSQL_PORT
BAUMARKT_MYSQL_DATABASE
BAUMARKT_MYSQL_USER
BAUMARKT_MYSQL_PASSWORD
BAUMARKT_MYSQL_SSL
```

## 7. Offene Punkte / Bekannte Themen

- **Env-Variablen beim Hosting:** `.env*` ist per `.gitignore` ausgeschlossen
  (außer `.env.example`). Die MySQL-Variablen müssen beim Hosting gesetzt sein,
  sonst schlagen Build und ISR-Aktualisierung fehl.
- **Filterung** könnte bei wachsender Datenmenge auf serverseitige DB-Filterung
  umgestellt werden.

## 8. Nächste sinnvolle Schritte

1. MySQL-Variablen beim Hosting setzen und Redeploy.
