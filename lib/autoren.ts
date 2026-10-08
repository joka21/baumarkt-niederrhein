// Redaktionsteam des Ratgebers – erfundene Figuren, statisch im Code.
// Die Texte schreibt und prüft die Redaktion von Baumarkt Niederrhein.
// Artikel verweisen über das Feld "autor" (Slug oder Liste von Slugs) auf diese Einträge.

export type Autor = {
  slug: string;
  name: string;
  /** Tier mit bestimmtem Artikel im Nominativ, z. B. "der Steinkauz" (für den Alt-Text). */
  tier: string;
  /** Nur nötig, wenn der Dativ unregelmäßig ist, z. B. "dem Feldhasen". */
  tierDativ?: string;
  ort: string;
  rolle: string;
  zitat: string;
  themen: string[];
  /** Pfad unter /public, quadratisches WebP 1024x1024. */
  bild: string;
};

export const AUTOREN: Autor[] = [
  {
    slug: "willi",
    name: "Willi",
    tier: "der Steinkauz",
    ort: "Krefeld",
    rolle: "Unser Fachmann für Fliesen, Untergründe und Fugen",
    zitat: "Ich sitze oben und sehe alles. Der Untergrund entscheidet, nicht die Fliese. Wer da spart, zahlt zweimal.",
    themen: ["Fliesen", "Untergründe", "Fugen"],
    bild: "/team/willi.webp",
  },
  {
    slug: "sandra",
    name: "Sandra",
    tier: "die Biberin",
    ort: "Kempen",
    rolle: "Unsere Fachfrau für Holz, Parkett und Böden",
    zitat: "Holz ist mein Material. Mir reicht es nicht zu sagen, wie etwas geht. Ich will, dass du verstehst, warum.",
    themen: ["Holz", "Parkett", "Böden"],
    bild: "/team/sandra.webp",
  },
  {
    slug: "rolf",
    name: "Rolf",
    tier: "der Fuchs",
    ort: "Moers",
    rolle: "Unser Rechner für Preise, Angebote und Stundenlöhne",
    zitat: "Am Ende steht immer eine Zahl. Ich rechne dir vor, was etwas kostet und wann sich Selbermachen nicht lohnt.",
    themen: ["Preise", "Angebote", "Stundenlöhne"],
    bild: "/team/rolf.webp",
  },
  {
    slug: "marco",
    name: "Marco",
    tier: "der Feldhase",
    tierDativ: "dem Feldhasen",
    ort: "Viersen",
    rolle: "Unser Anfänger für erste Versuche und Pannen",
    zitat: "Ich renne los, bevor ich die Anleitung gelesen habe. Was dabei schiefgeht, schreibe ich auf, damit es dir nicht auch passiert.",
    themen: ["Erste Versuche", "Pannen"],
    bild: "/team/marco.webp",
  },
  {
    slug: "lena",
    name: "Lena",
    tier: "der Kiebitz",
    ort: "Mönchengladbach",
    rolle: "Unsere Stimme für Mietwohnung, kleines Budget und Gebrauchtes",
    zitat: "Ich kiebitze, das liegt in der Familie. Ich frage das, was sich im Baumarkt keiner zu fragen traut.",
    themen: ["Mietwohnung", "Kleines Budget", "Gebrauchtes"],
    bild: "/team/lena.webp",
  },
  {
    slug: "petra",
    name: "Petra",
    tier: "die Blässgans",
    ort: "Kleve",
    rolle: "Unsere Planerin für Abläufe, Zeitplanung und Handwerkersuche",
    zitat: "Bei uns fliegt keiner los, bevor die Formation steht. Die meisten Baustellen scheitern an der Reihenfolge, nicht am Können.",
    themen: ["Abläufe", "Zeitplanung", "Handwerkersuche"],
    bild: "/team/petra.webp",
  },
];

export const FIGUREN_HINWEIS =
  "Die Figuren unseres Teams sind erfunden. Alle Texte schreibt und prüft die Redaktion von Baumarkt Niederrhein.";

export function getAutor(slug: string): Autor | undefined {
  return AUTOREN.find((a) => a.slug === slug);
}

/** Tier ohne Artikel, z. B. "Steinkauz". */
export function tierName(autor: Autor): string {
  return autor.tier.replace(/^(der|die|das)\s+/i, "");
}

/** Alt-Text, z. B. "Illustration von Willi, dem Steinkauz aus Krefeld". */
export function autorAltText(autor: Autor): string {
  const dativ = autor.tierDativ ?? autor.tier.replace(/^(der|die|das)\s+/i, (artikel) =>
    artikel.trim().toLowerCase() === "die" ? "der " : "dem "
  );
  return `Illustration von ${autor.name}, ${dativ} aus ${autor.ort}`;
}

/**
 * Löst das Artikelfeld "autor" in Autoren auf. Akzeptiert einen Slug, ein Array
 * von Slugs (Meinungsstücke) oder eine kommagetrennte Liste. Unbekannte Werte
 * werden ignoriert.
 */
export function autorenAusFeld(feld: unknown): Autor[] {
  const werte = Array.isArray(feld)
    ? feld
    : typeof feld === "string"
      ? feld.split(",")
      : [];
  return werte
    .map((w) => (typeof w === "string" ? getAutor(w.trim()) : undefined))
    .filter((a): a is Autor => Boolean(a));
}

/** Anzeigename für eine Autorenzeile; ohne Team-Zuordnung "Redaktion". */
export function autorenNamen(autoren: Autor[]): string {
  return autoren.length > 0 ? autoren.map((a) => a.name).join(" & ") : "Redaktion";
}
