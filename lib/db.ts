import "server-only";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

// Serverseitiger Zugriff auf die MySQL-Datenbank (Inhalte der Seite).
// "server-only" bricht den Build ab, falls die Datei je in Browser-Code landet.

// Eigene Namen mit Präfix BAUMARKT_: Auf dem Mittwald-Server setzt das node-Startskript
// projektweit MYSQL_* einer anderen App, und Next.js überschreibt gesetzte Variablen nicht.
// Fehlermeldungen nennen nur den Namen der Variable, nie ihren Wert.

function pflicht(name: string): string {
  const wert = process.env[name];
  if (!wert) throw new Error(`Umgebungsvariable ${name} fehlt.`);
  return wert;
}

function port(name: string): number {
  const wert = Number(pflicht(name));
  if (!Number.isInteger(wert) || wert < 1 || wert > 65535) {
    throw new Error(`Umgebungsvariable ${name} ist keine gültige Portnummer.`);
  }
  return wert;
}

function schalter(name: string): boolean {
  const wert = pflicht(name);
  if (wert !== "true" && wert !== "false") {
    throw new Error(`Umgebungsvariable ${name} muss "true" oder "false" sein.`);
  }
  return wert === "true";
}

function erzeugePool(): Pool {
  return mysql.createPool({
    host: pflicht("BAUMARKT_MYSQL_HOST"),
    port: port("BAUMARKT_MYSQL_PORT"),
    database: pflicht("BAUMARKT_MYSQL_DATABASE"),
    user: pflicht("BAUMARKT_MYSQL_USER"),
    password: pflicht("BAUMARKT_MYSQL_PASSWORD"),
    ssl: schalter("BAUMARKT_MYSQL_SSL") ? { rejectUnauthorized: true, minVersion: "TLSv1.2" } : undefined,
    // Zeitstempel als Text lesen: DATETIME-Werte sind UTC, ohne Umrechnung in die lokale Zeitzone.
    dateStrings: true,
    timezone: "Z",
    connectionLimit: 5,
    enableKeepAlive: true,
  });
}

// Ein Pool pro Prozess; im Dev-Modus über Hot Reloads hinweg wiederverwendet.
const globalFuerPool = globalThis as typeof globalThis & { __mysqlPool?: Pool };

function pool(): Pool {
  globalFuerPool.__mysqlPool ??= erzeugePool();
  return globalFuerPool.__mysqlPool;
}

/** Führt eine Abfrage als Prepared Statement aus. Werte nur über Platzhalter (?) übergeben. */
export async function abfrage<T>(sql: string, werte: (string | number | null)[] = []): Promise<T[]> {
  const [zeilen] = await pool().execute<RowDataPacket[]>(sql, werte);
  return zeilen as T[];
}

/**
 * DATETIME(6) in UTC ("2026-10-08 15:11:24.842004") im Format, das Supabase für
 * timestamptz geliefert hat ("2026-10-08T15:11:24.842004+00:00"): Nachkommastellen
 * ohne Nullen am Ende, ganz ohne Nachkommastellen, wenn sie null sind.
 */
export function alsZeitstempel(wert: string | null): string | null {
  if (!wert) return null;
  const m = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})(?:\.(\d+))?$/.exec(wert);
  if (!m) throw new Error(`Unerwartetes Zeitformat aus MySQL: ${wert}`);
  const bruchteil = (m[3] ?? "").replace(/0+$/, "");
  return `${m[1]}T${m[2]}${bruchteil ? `.${bruchteil}` : ""}+00:00`;
}
