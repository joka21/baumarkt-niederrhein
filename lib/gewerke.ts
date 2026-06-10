// Zuordnung Gewerk-Slug -> Platzhalterfarbe (Hex).
// Wird für die farbigen Platzhalter-Bildflächen (Karten & Detailgalerie) genutzt.

export const GEWERKE_FARBEN: Record<string, string> = {
  bodenleger: "#B07A4F",
  maler: "#2F6FED",
  fliesenleger: "#0E9594",
  trockenbau: "#6B7280",
  sanitaer: "#0891B2",
  elektro: "#D97706",
  tischler: "#92400E",
  dachdecker: "#B91C1C",
  garten: "#15803D",
  material: "#475569",
};

// Fallback für unbekannte Gewerke oder Anbieter ohne Gewerk.
export const GEWERK_FALLBACK_FARBE = "#64748B";

export function getGewerkeFarbe(slug?: string | null): string {
  if (!slug) return GEWERK_FALLBACK_FARBE;
  return GEWERKE_FARBEN[slug] ?? GEWERK_FALLBACK_FARBE;
}
