import type { MetadataRoute } from "next";
import { artikelFuerSitemap } from "@/lib/artikel";
import { AUTOREN, autorenAusFeld } from "@/lib/autoren";
import { alleSeiten as altbauSeiten } from "@/lib/altbau";
import { FOERDERRECHNER_OEFFENTLICH, FOERDERRECHNER_URL } from "@/lib/foerderung/sichtbarkeit";
import { STAND_DER_REGELN } from "@/lib/foerderung/parameter";

const BASE_URL = "https://www.baumarkt-niederrhein.de";

// Statisch erzeugt, stündlich aktualisiert (ISR).
export const revalidate = 3600;

// Letzte inhaltliche Änderung der festen Seiten – bei Textänderungen anpassen.
const STAND = {
  fuerBetriebe: "2026-10-08",
  impressum: "2026-10-08",
  datenschutz: "2026-11-16",
  team: "2026-10-27",
};

const spaetestes = (...daten: (string | null | undefined)[]) =>
  daten.filter(Boolean).sort().at(-1) ?? undefined;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await artikelFuerSitemap();

  const artikel = data.map((a) => ({
    slug: a.slug,
    autoren: autorenAusFeld(a.autor),
    stand: spaetestes(a.veroeffentlicht_am, a.aktualisiert_am),
  }));
  const neuesterArtikel = spaetestes(...artikel.map((a) => a.stand));

  return [
    { url: `${BASE_URL}/`, lastModified: spaetestes(neuesterArtikel, STAND.team) },
    { url: `${BASE_URL}/ratgeber`, lastModified: neuesterArtikel },
    ...artikel.map((a) => ({ url: `${BASE_URL}/ratgeber/${a.slug}`, lastModified: a.stand })),
    ...altbauSeiten()
      .sort((a, b) => a.url.localeCompare(b.url))
      .map((s) => ({ url: `${BASE_URL}${s.url}`, lastModified: s.stand })),
    ...(FOERDERRECHNER_OEFFENTLICH
      ? [{ url: `${BASE_URL}${FOERDERRECHNER_URL}`, lastModified: STAND_DER_REGELN }]
      : []),
    { url: `${BASE_URL}/team`, lastModified: STAND.team },
    ...AUTOREN.map((autor) => ({
      url: `${BASE_URL}/team/${autor.slug}`,
      lastModified: spaetestes(
        STAND.team,
        ...artikel.filter((a) => a.autoren.some((x) => x.slug === autor.slug)).map((a) => a.stand)
      ),
    })),
    { url: `${BASE_URL}/fuer-anbieter`, lastModified: STAND.fuerBetriebe },
    { url: `${BASE_URL}/impressum`, lastModified: STAND.impressum },
    { url: `${BASE_URL}/datenschutz`, lastModified: STAND.datenschutz },
  ];
}
