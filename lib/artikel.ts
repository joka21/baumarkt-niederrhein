import "server-only";
import { cache } from "react";
import { abfrage, alsZeitstempel } from "@/lib/db";

// Abfragen für Ratgeber-Artikel und Kategorien aus MySQL.
//
// Gleiches Verhalten wie zuvor mit Supabase (Postgres):
// - Absteigend sortiert stehen Einträge ohne veroeffentlicht_am zuerst (Postgres: NULLS FIRST).
// - Slugs werden exakt verglichen (utf8mb4_bin), nicht ohne Groß-/Kleinschreibung.
// - Zeitstempel kommen als Text im Supabase-Format zurück (siehe alsZeitstempel).

const VEROEFFENTLICHT = "veroeffentlicht";

type Zeitfelder = { veroeffentlicht_am: string | null; aktualisiert_am: string | null };

function mitZeitstempeln<T extends Partial<Zeitfelder>>(zeile: T): T {
  return {
    ...zeile,
    ...("veroeffentlicht_am" in zeile ? { veroeffentlicht_am: alsZeitstempel(zeile.veroeffentlicht_am ?? null) } : {}),
    ...("aktualisiert_am" in zeile ? { aktualisiert_am: alsZeitstempel(zeile.aktualisiert_am ?? null) } : {}),
  };
}

export type Artikel = {
  slug: string;
  titel: string;
  auszug: string | null;
  inhalt: string;
  cover_url: string | null;
  autor: string;
  kategorie_slug: string | null;
  veroeffentlicht_am: string | null;
  aktualisiert_am: string | null;
  seo_titel: string | null;
  seo_beschreibung: string | null;
};

/** Startseite: die 50 neuesten veröffentlichten Artikel. */
export async function artikelFuerStartseite() {
  return abfrage<Pick<Artikel, "slug" | "titel" | "auszug" | "autor" | "kategorie_slug">>(
    `SELECT slug, titel, auszug, autor, kategorie_slug FROM artikel
     WHERE status = ? ORDER BY veroeffentlicht_am IS NULL DESC, veroeffentlicht_am DESC LIMIT 50`,
    [VEROEFFENTLICHT],
  );
}

/** Alle Kategorien (Name und Slug). */
export async function kategorien() {
  return abfrage<{ name: string; slug: string }>("SELECT name, slug FROM kategorien");
}

/** Ratgeber-Übersicht: alle veröffentlichten Artikel, neueste zuerst. */
export async function artikelUebersicht() {
  const zeilen = await abfrage<Pick<Artikel, "slug" | "titel" | "auszug" | "cover_url" | "veroeffentlicht_am">>(
    `SELECT slug, titel, auszug, cover_url, veroeffentlicht_am FROM artikel
     WHERE status = ? ORDER BY veroeffentlicht_am IS NULL DESC, veroeffentlicht_am DESC`,
    [VEROEFFENTLICHT],
  );
  return zeilen.map(mitZeitstempeln);
}

/** Slugs aller veröffentlichten Artikel (für generateStaticParams). */
export async function artikelSlugs() {
  return abfrage<{ slug: string }>("SELECT slug FROM artikel WHERE status = ?", [VEROEFFENTLICHT]);
}

/** Ein veröffentlichter Artikel; pro Render nur einmal abgefragt (Metadaten und Seite). */
export const artikelNachSlug = cache(async (slug: string): Promise<Artikel | null> => {
  const zeilen = await abfrage<Artikel>(
    `SELECT slug, titel, auszug, inhalt, cover_url, autor, kategorie_slug,
            veroeffentlicht_am, aktualisiert_am, seo_titel, seo_beschreibung
     FROM artikel
     WHERE slug COLLATE utf8mb4_bin = ? AND status = ?
     LIMIT 1`,
    [slug, VEROEFFENTLICHT],
  );
  return zeilen[0] ? mitZeitstempeln(zeilen[0]) : null;
});

/** Bis zu 30 andere veröffentlichte Artikel, neueste zuerst (für "Weitere Ratgeber"). */
export async function andereArtikel(slug: string) {
  return abfrage<Pick<Artikel, "slug" | "titel" | "autor" | "kategorie_slug">>(
    `SELECT slug, titel, autor, kategorie_slug FROM artikel
     WHERE status = ? AND slug COLLATE utf8mb4_bin <> ? ORDER BY veroeffentlicht_am IS NULL DESC, veroeffentlicht_am DESC LIMIT 30`,
    [VEROEFFENTLICHT, slug],
  );
}

/** Team-Seiten: alle veröffentlichten Artikel mit Autorfeld, neueste zuerst. */
export async function artikelFuerTeam() {
  const zeilen = await abfrage<Pick<Artikel, "slug" | "titel" | "auszug" | "autor" | "veroeffentlicht_am">>(
    `SELECT slug, titel, auszug, autor, veroeffentlicht_am FROM artikel
     WHERE status = ? ORDER BY veroeffentlicht_am IS NULL DESC, veroeffentlicht_am DESC`,
    [VEROEFFENTLICHT],
  );
  return zeilen.map(mitZeitstempeln);
}

/** Sitemap: Slug, Autor und Zeitstempel aller veröffentlichten Artikel. */
export async function artikelFuerSitemap() {
  const zeilen = await abfrage<Pick<Artikel, "slug" | "autor" | "veroeffentlicht_am" | "aktualisiert_am">>(
    "SELECT slug, autor, veroeffentlicht_am, aktualisiert_am FROM artikel WHERE status = ?",
    [VEROEFFENTLICHT],
  );
  return zeilen.map(mitZeitstempeln);
}
