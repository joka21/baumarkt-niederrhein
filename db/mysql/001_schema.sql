-- Phase 2: Zielschema für den Umzug von Supabase (Postgres) nach MySQL/MariaDB.
-- Quelle: Spaltenliste aus dem Supabase-SQL-Editor vom 12.11.2026.
--
-- Voraussetzung: MySQL >= 8.0.16 oder MariaDB >= 10.2.1
-- (Ausdrücke als Standardwert, durchgesetzte CHECK-Bedingungen).
--
-- Umsetzung der Typen:
--   uuid         -> CHAR(36), Standardwert UUID()
--   timestamptz  -> DATETIME(6), Werte immer in UTC, Standardwert UTC_TIMESTAMP(6)
--   slug         -> VARCHAR(255) mit eindeutigem Index
--   text         -> VARCHAR(255) für kurze Felder, TEXT/MEDIUMTEXT für Fließtext
--
-- Inhalt: nur die Inhalte der Seite (kategorien, artikel).
-- Nicht angelegt: anbieter, anbieter_kategorien, anbieter_bilder, anfragen,
-- bewertungen, profiles. Betriebe und Anfragen liegen künftig im Hub.
-- Das Team steht statisch in lib/autoren.ts und bekommt keine Tabelle.

SET NAMES utf8mb4;

CREATE TABLE kategorien (
  id    CHAR(36)     NOT NULL DEFAULT (UUID()),
  name  VARCHAR(255) NOT NULL,
  slug  VARCHAR(255) NOT NULL,
  icon  VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY kategorien_slug_eindeutig (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE artikel (
  id                 CHAR(36)     NOT NULL DEFAULT (UUID()),
  slug               VARCHAR(255) NOT NULL,
  titel              VARCHAR(255) NOT NULL,
  auszug             TEXT         NULL,
  inhalt             MEDIUMTEXT   NOT NULL,
  cover_url          TEXT         NULL,
  autor              VARCHAR(255) NOT NULL DEFAULT 'Baumarkt Niederrhein',
  kategorie_slug     VARCHAR(255) NULL,
  status             VARCHAR(50)  NOT NULL DEFAULT 'entwurf',
  veroeffentlicht_am DATETIME(6)  NULL,
  aktualisiert_am    DATETIME(6)  NOT NULL DEFAULT (UTC_TIMESTAMP(6)),
  erstellt_am        DATETIME(6)  NOT NULL DEFAULT (UTC_TIMESTAMP(6)),
  seo_titel          VARCHAR(255) NULL,
  seo_beschreibung   VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY artikel_slug_eindeutig (slug),
  KEY artikel_status_veroeffentlicht (status, veroeffentlicht_am),
  KEY artikel_kategorie_slug (kategorie_slug),
  CONSTRAINT artikel_seo_titel_laenge
    CHECK (seo_titel IS NULL OR CHAR_LENGTH(seo_titel) <= 60),
  CONSTRAINT artikel_seo_beschreibung_laenge
    CHECK (seo_beschreibung IS NULL OR CHAR_LENGTH(seo_beschreibung) BETWEEN 120 AND 155)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
