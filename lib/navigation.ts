import { getLiveStaedte } from "@/lib/staedte";

export type NavLink = { label: string; href: string };

// Hauptmenü für Kopf- und Fußzeile. "Baumärkte" nur, wenn mindestens eine Stadt live ist.
export function getHauptmenue(): NavLink[] {
  return [
    ...(getLiveStaedte().length > 0
      ? [{ label: "Baumärkte", href: "/#baumaerkte" }]
      : []),
    { label: "Ratgeber", href: "/ratgeber" },
    { label: "Team", href: "/team" },
    { label: "Für Betriebe", href: "/fuer-anbieter" },
  ];
}
