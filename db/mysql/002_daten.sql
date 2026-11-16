-- Phase 2: Inhalte aus Supabase. Erzeugt von scripts/erzeuge-mysql-daten.mjs
-- Quelle: backups/supabase-export-public-2026-11-11.json (exportiert am 2026-11-11T17:02:17.087Z)
-- Zeitstempel in UTC. Vorher 001_schema.sql ausführen.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO kategorien (id, name, slug, icon) VALUES ('a0710c9a-a769-40bf-a41a-87e29ca07d1d', 'Bodenleger', 'bodenleger', 'layers');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('79ee1732-7351-46b9-b647-9cbf313c8a14', 'Maler', 'maler', 'paint-roller');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('d28385af-04f2-4974-8d1f-d7f5f498a8fa', 'Fliesenleger', 'fliesenleger', 'grid');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('98aec0c6-19fa-40f3-b68e-e77b2e3d90d8', 'Trockenbau', 'trockenbau', 'square');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('4e169451-4e96-4b0b-835d-eae8c83a1a59', 'Sanitär', 'sanitaer', 'droplet');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('85133bb3-81d7-4535-ae4c-26a6b47e5957', 'Elektro', 'elektro', 'zap');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('153f429b-6f90-47be-a276-075ddbcd467c', 'Tischler', 'tischler', 'hammer');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('25d43c8c-714a-466a-b211-02a8aea0b392', 'Dachdecker', 'dachdecker', 'home');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('9217634a-de3f-4d2d-b445-1d94eb280760', 'Garten', 'garten', 'tree-pine');
INSERT INTO kategorien (id, name, slug, icon) VALUES ('a51ed299-0bd7-4537-bc70-0e9457a8d8b5', 'Material', 'material', 'package');

INSERT INTO artikel (id, slug, titel, auszug, inhalt, cover_url, autor, kategorie_slug, status, veroeffentlicht_am, aktualisiert_am, erstellt_am, seo_titel, seo_beschreibung) VALUES ('786b08af-7684-4ace-a54a-7fc51998e139', 'bodenbelag-richtig-auswaehlen', 'Bodenbelag richtig auswählen: Ein Leitfaden für den Niederrhein', 'Vinyl, Parkett oder Fliesen? So findest du den passenden Bodenbelag – und den richtigen Bodenleger in deiner Region.', '## Welcher Bodenbelag passt zu welchem Raum?\r\n\r\nDie Wahl des Bodenbelags hängt vor allem von Nutzung, Feuchtigkeit und Budget ab. Für Wohnräume eignet sich Parkett oder hochwertiges Vinyl, in Bad und Küche sind Fliesen die robustere Wahl.\r\n\r\n## Worauf es bei der Verlegung ankommt\r\n\r\nEin sauberer, ebener Untergrund ist die halbe Miete. Gerade bei schwimmender Verlegung entscheidet die Vorbereitung über das spätere Ergebnis – hier lohnt sich ein Fachbetrieb.\r\n\r\n## Selbst verlegen oder Bodenleger beauftragen?\r\n\r\nKlickvinyl und Laminat lassen sich mit etwas Übung selbst verlegen. Bei Parkett, Fliesen und unebenem Untergrund lohnt sich ein Fachbetrieb. Hol dir mindestens zwei Angebote und lass dir erklären, wie der Untergrund vorbereitet wird.', NULL, 'sandra', 'bodenleger', 'veroeffentlicht', '2026-06-18 15:19:42.084210', '2026-10-08 15:11:24.842004', '2026-06-18 15:19:42.084210', 'Bodenbelag auswählen: Welcher Boden für welchen Raum?', 'Vinyl, Parkett oder Fliesen? Sandra erklärt, welcher Bodenbelag in welchen Raum passt und worauf du bei Nutzung, Feuchtigkeit und Budget achten solltest.');

COMMIT;

-- Kontrolle: erwartet kategorien = 10, artikel = 1
SELECT 'kategorien' AS tabelle, COUNT(*) AS anzahl FROM kategorien
UNION ALL SELECT 'artikel', COUNT(*) FROM artikel;
