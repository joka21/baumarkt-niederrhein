import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

// Bereich "Altbau sanieren": Inhalte liegen als Markdown in content/altbau-sanieren
// (Quelle: docs/altbau_texte_2026_v2.md) und werden beim Build gelesen.

const ORDNER = path.join(process.cwd(), "content", "altbau-sanieren");

export const ALTBAU_BASIS = "/altbau-sanieren";
export const PROJEKT_BASIS = `${ALTBAU_BASIS}/unser-projekt`;

export type AltbauSeite = {
  slug: string;
  titel: string;
  seoTitel: string;
  seoBeschreibung: string;
  /** ISO-Datum der letzten inhaltlichen Änderung, z. B. "2026-10-27". */
  stand: string;
  reihenfolge: number;
  inhalt: string;
};

export type Seitentyp = "uebersicht" | "loesung" | "checkliste" | "projekt" | "etappe";

// Einfaches Frontmatter: "schluessel: wert" je Zeile, Strings in doppelten Anführungszeichen.
function parse(datei: string): AltbauSeite {
  const roh = fs.readFileSync(path.join(ORDNER, datei), "utf8").replace(/\r\n/g, "\n");
  const treffer = roh.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!treffer) throw new Error(`Frontmatter fehlt in ${datei}`);

  const felder: Record<string, string> = {};
  for (const zeile of treffer[1].split("\n")) {
    const m = zeile.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const wert = m[2].trim();
    felder[m[1]] = wert.startsWith('"') ? (JSON.parse(wert) as string) : wert;
  }

  for (const feld of ["slug", "titel", "seoTitel", "seoBeschreibung", "stand", "reihenfolge"]) {
    if (!felder[feld]) throw new Error(`Feld "${feld}" fehlt in ${datei}`);
  }

  return {
    slug: felder.slug,
    titel: felder.titel,
    seoTitel: felder.seoTitel,
    seoBeschreibung: felder.seoBeschreibung,
    stand: felder.stand,
    reihenfolge: Number(felder.reihenfolge),
    inhalt: treffer[2].trim(),
  };
}

export function ladeSeite(slug: string): AltbauSeite | null {
  const datei = `${slug}.md`;
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(path.join(ORDNER, datei))) return null;
  return parse(datei);
}

function alleDateien(): AltbauSeite[] {
  return fs
    .readdirSync(ORDNER)
    .filter((d) => d.endsWith(".md"))
    .map(parse);
}

export function seitentyp(slug: string): Seitentyp {
  if (slug === "uebersicht") return "uebersicht";
  if (slug === "checkliste") return "checkliste";
  if (slug === "unser-projekt") return "projekt";
  if (/^etappe-\d+$/.test(slug)) return "etappe";
  return "loesung";
}

/** Seiten unter /altbau-sanieren/[slug]: Lösungsseiten und Checkliste, nach Reihenfolge. */
export function themenSeiten(): AltbauSeite[] {
  return alleDateien()
    .filter((s) => ["loesung", "checkliste"].includes(seitentyp(s.slug)))
    .sort((a, b) => a.reihenfolge - b.reihenfolge);
}

/** Übersicht, Lösungsseiten, Checkliste und Projekt (ohne Etappen), nach Reihenfolge. */
export function bereichsSeiten(): AltbauSeite[] {
  return alleDateien()
    .filter((s) => seitentyp(s.slug) !== "etappe")
    .sort((a, b) => a.reihenfolge - b.reihenfolge);
}

/** Etappen unter /altbau-sanieren/unser-projekt/[etappe], nach Reihenfolge. */
export function etappen(): AltbauSeite[] {
  return alleDateien()
    .filter((s) => seitentyp(s.slug) === "etappe")
    .sort((a, b) => a.reihenfolge - b.reihenfolge);
}

/** Alle Seiten des Bereichs mit ihrer Adresse (für die Sitemap). */
export function alleSeiten(): (AltbauSeite & { url: string })[] {
  return alleDateien().map((s) => ({ ...s, url: seitenUrl(s.slug) }));
}

export function seitenUrl(slug: string): string {
  switch (seitentyp(slug)) {
    case "uebersicht":
      return ALTBAU_BASIS;
    case "projekt":
      return PROJEKT_BASIS;
    case "etappe":
      return `${PROJEKT_BASIS}/${slug}`;
    default:
      return `${ALTBAU_BASIS}/${slug}`;
  }
}

export type ChecklistenPunkt = { nummer: string; text: string };
export type ChecklistenGruppe = { titel: string; punkte: ChecklistenPunkt[] };

/**
 * Zerlegt die Checkliste in den Text davor, die Gruppen mit ihren Punkten
 * ("- [ ] 01 …") und den Text danach.
 */
export function zerlegeCheckliste(inhalt: string): {
  vorher: string;
  gruppen: ChecklistenGruppe[];
  nachher: string;
} {
  const bloecke = inhalt.split(/\n(?=## )/);
  const vorher: string[] = [];
  const nachher: string[] = [];
  const gruppen: ChecklistenGruppe[] = [];

  for (const block of bloecke) {
    const zeilen = block.split("\n");
    const punkte = zeilen
      .map((z) => z.match(/^- \[ \] (\d{2}) (.+)$/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map((m) => ({ nummer: m[1], text: m[2] }));

    if (punkte.length > 0) {
      gruppen.push({ titel: zeilen[0].replace(/^## /, "").trim(), punkte });
    } else if (gruppen.length === 0) {
      vorher.push(block);
    } else {
      nachher.push(block);
    }
  }

  return { vorher: vorher.join("\n"), gruppen, nachher: nachher.join("\n") };
}

/** Metadaten einer Seite des Bereichs (Titel ohne Suffix, Canonical ohne Schrägstrich). */
export function altbauMetadata(seite: AltbauSeite): Metadata {
  const url = seitenUrl(seite.slug);
  return {
    title: { absolute: seite.seoTitel },
    description: seite.seoBeschreibung,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "de_DE",
      url,
      siteName: "Baumarkt Niederrhein",
      title: seite.seoTitel,
      description: seite.seoBeschreibung,
      // explizit setzen, sonst greift der siteweite Fallback nicht
      images: ["/opengraph-image"],
      modifiedTime: seite.stand,
      authors: ["Baumarkt Niederrhein"],
    },
  };
}
