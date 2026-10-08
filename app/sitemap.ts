import type { MetadataRoute } from "next";
import { supabasePublic } from "@/utils/supabase/public";
import { AUTOREN, autorenAusFeld } from "@/lib/autoren";

const BASE_URL = "https://www.baumarkt-niederrhein.de";

// Statisch erzeugt, stündlich aktualisiert (ISR).
export const revalidate = 3600;

// Letzte inhaltliche Änderung der festen Seiten – bei Textänderungen anpassen.
const STAND = {
  fuerBetriebe: "2026-10-08",
  impressum: "2026-10-08",
  datenschutz: "2026-10-08",
  team: "2026-10-08",
};

const spaetestes = (...daten: (string | null | undefined)[]) =>
  daten.filter(Boolean).sort().at(-1) ?? undefined;

// Anbieterseiten (/anbieter/[slug]) stehen bewusst nicht in der Sitemap –
// sie sind noindex, follow (siehe app/anbieter/[slug]/page.tsx).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabasePublic
    .from("artikel")
    .select("slug, autor, veroeffentlicht_am, aktualisiert_am")
    .eq("status", "veroeffentlicht");

  const artikel = (data ?? []).map((a) => ({
    slug: a.slug as string,
    autoren: autorenAusFeld(a.autor),
    stand: spaetestes(a.veroeffentlicht_am, a.aktualisiert_am),
  }));
  const neuesterArtikel = spaetestes(...artikel.map((a) => a.stand));

  return [
    { url: `${BASE_URL}/`, lastModified: spaetestes(neuesterArtikel, STAND.team) },
    { url: `${BASE_URL}/ratgeber`, lastModified: neuesterArtikel },
    ...artikel.map((a) => ({ url: `${BASE_URL}/ratgeber/${a.slug}`, lastModified: a.stand })),
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
