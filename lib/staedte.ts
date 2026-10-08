// Städte mit Baumarkt-Übersicht. Eine Stadt erscheint erst auf der Seite,
// wenn ihre Stadtseite /baumaerkte/[slug] live ist.

export type Stadt = {
  slug: string;
  name: string;
  live: boolean;
};

export const STAEDTE: Stadt[] = [
  { slug: "moenchengladbach", name: "Mönchengladbach", live: false },
  { slug: "krefeld", name: "Krefeld", live: false },
  { slug: "neuss", name: "Neuss", live: false },
  { slug: "wesel", name: "Wesel", live: false },
  { slug: "moers", name: "Moers", live: false },
  { slug: "kleve", name: "Kleve", live: false },
  { slug: "viersen", name: "Viersen", live: false },
];

export function getLiveStaedte(): Stadt[] {
  return STAEDTE.filter((s) => s.live);
}
