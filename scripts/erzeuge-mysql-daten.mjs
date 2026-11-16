// Erzeugt aus einem Supabase-Export (JSON) die INSERT-Anweisungen für MySQL.
// Aufruf: node scripts/erzeuge-mysql-daten.mjs [export.json] [ziel.sql]
import { readFileSync, writeFileSync } from "node:fs";

const quelle = process.argv[2] ?? "backups/supabase-export-public-2026-11-11.json";
const ziel = process.argv[3] ?? "db/mysql/002_daten.sql";

// Reihenfolge und Spalten der Tabellen, die Inhalt übernehmen.
const TABELLEN = {
  kategorien: ["id", "name", "slug", "icon"],
  artikel: [
    "id", "slug", "titel", "auszug", "inhalt", "cover_url", "autor",
    "kategorie_slug", "status", "veroeffentlicht_am", "aktualisiert_am",
    "erstellt_am", "seo_titel", "seo_beschreibung",
  ],
};
const ZEITSPALTEN = new Set(["veroeffentlicht_am", "aktualisiert_am", "erstellt_am"]);

// Postgres-Zeitstempel (timestamptz) -> 'YYYY-MM-DD HH:MM:SS.ffffff' in UTC.
// Die Mikrosekunden bleiben erhalten; Date kennt nur Millisekunden.
function alsUtc(wert) {
  const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}:?\d{2})$/.exec(wert);
  if (!m) throw new Error(`Unerwartetes Zeitformat: ${wert}`);
  const [, tag, zeit, bruchteil = "", zone] = m;
  const mikro = bruchteil.padEnd(6, "0");
  const sekunden = new Date(`${tag}T${zeit}${zone}`).toISOString().slice(0, 19).replace("T", " ");
  return `${sekunden}.${mikro}`;
}

function alsSql(wert, spalte) {
  if (wert === null || wert === undefined) return "NULL";
  if (ZEITSPALTEN.has(spalte)) return `'${alsUtc(wert)}'`;
  if (typeof wert !== "string") throw new Error(`Unerwarteter Typ in ${spalte}: ${typeof wert}`);
  const maskiert = wert
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
  return `'${maskiert}'`;
}

const daten = JSON.parse(readFileSync(quelle, "utf8"));
const zeilen = [
  `-- Phase 2: Inhalte aus Supabase. Erzeugt von scripts/erzeuge-mysql-daten.mjs`,
  `-- Quelle: ${quelle} (exportiert am ${daten.exportiert_am})`,
  `-- Zeitstempel in UTC. Vorher 001_schema.sql ausführen.`,
  ``,
  `SET NAMES utf8mb4;`,
  `SET time_zone = '+00:00';`,
  `START TRANSACTION;`,
  ``,
];

for (const [tabelle, spalten] of Object.entries(TABELLEN)) {
  const eintraege = daten.tabellen[tabelle];
  if (!Array.isArray(eintraege)) throw new Error(`Tabelle fehlt im Export: ${tabelle}`);
  for (const eintrag of eintraege) {
    const unbekannt = Object.keys(eintrag).filter((s) => !spalten.includes(s));
    if (unbekannt.length) throw new Error(`Unbekannte Spalten in ${tabelle}: ${unbekannt.join(", ")}`);
    const werte = spalten.map((s) => alsSql(eintrag[s], s)).join(", ");
    zeilen.push(`INSERT INTO ${tabelle} (${spalten.join(", ")}) VALUES (${werte});`);
  }
  zeilen.push(``);
  console.log(`${tabelle}: ${eintraege.length} Zeilen`);
}

zeilen.push(
  `COMMIT;`,
  ``,
  `-- Kontrolle: erwartet kategorien = ${daten.tabellen.kategorien.length}, artikel = ${daten.tabellen.artikel.length}`,
  `SELECT 'kategorien' AS tabelle, COUNT(*) AS anzahl FROM kategorien`,
  `UNION ALL SELECT 'artikel', COUNT(*) FROM artikel;`,
  ``,
);

writeFileSync(ziel, zeilen.join("\n"), "utf8");
console.log(`Geschrieben: ${ziel}`);
