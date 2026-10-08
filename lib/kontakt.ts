// Kontaktdaten laut Impressum – einzige Quelle für Impressum und mailto-Links.
export const KONTAKT_EMAIL = "service@medienwerkstatt-niederrhein.de";
export const KONTAKT_TELEFON = "0176 42463017";

export function mailtoLink(betreff: string): string {
  return `mailto:${KONTAKT_EMAIL}?subject=${encodeURIComponent(betreff)}`;
}
