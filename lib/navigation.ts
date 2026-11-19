import { getLiveStaedte } from "@/lib/staedte";
import { FOERDERRECHNER_OEFFENTLICH, FOERDERRECHNER_URL } from "@/lib/foerderung/sichtbarkeit";

export type NavLink = { label: string; href: string };

// Hauptmenü für Kopf- und Fußzeile. "Baumärkte" nur, wenn mindestens eine Stadt live ist.
export function getHauptmenue(): NavLink[] {
  return [
    ...(getLiveStaedte().length > 0
      ? [{ label: "Baumärkte", href: "/#baumaerkte" }]
      : []),
    { label: "Altbau sanieren", href: "/altbau-sanieren" },
    ...(FOERDERRECHNER_OEFFENTLICH ? [{ label: "Förderrechner", href: FOERDERRECHNER_URL }] : []),
    { label: "Ratgeber", href: "/ratgeber" },
    { label: "Team", href: "/team" },
    { label: "Für Betriebe", href: "/fuer-anbieter" },
  ];
}
