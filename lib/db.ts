import "server-only";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

// Serverseitiger Zugriff auf die MySQL-Datenbank (Inhalte der Seite).
// "server-only" bricht den Build ab, falls die Datei je in Browser-Code landet.

function pflicht(name: string): string {
  const wert = process.env[name];
  if (!wert) throw new Error(`Umgebungsvariable ${name} fehlt.`);
  return wert;
}

function erzeugePool(): Pool {
  return mysql.createPool({
    host: pflicht("MYSQL_HOST"),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: pflicht("MYSQL_DATABASE"),
    user: pflicht("MYSQL_USER"),
    password: pflicht("MYSQL_PASSWORD"),
    ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: true, minVersion: "TLSv1.2" } : undefined,
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
