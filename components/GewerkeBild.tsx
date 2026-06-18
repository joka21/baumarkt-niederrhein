// Zeigt das flächenfüllende Gewerk-Foto (public/gewerke/<slug>.jpg), sofern
// vorhanden – andernfalls die farbige Platzhalterfläche mit Initiale.
// Server Component (liest das Dateisystem) – nicht in Client Components importieren.

import { getGewerkeFarbe } from "@/lib/gewerke";
import { getGewerkeBild } from "@/lib/gewerke-bilder";
import PlatzhalterBild from "@/components/PlatzhalterBild";

type GewerkeBildProps = {
  gewerkeSlug?: string | null;
  gewerkeName?: string | null;
  name: string;
  ort?: string | null;
  className?: string;
  letterClassName?: string;
};

export default function GewerkeBild({
  gewerkeSlug,
  gewerkeName,
  name,
  ort,
  className = "",
  letterClassName,
}: GewerkeBildProps) {
  const bild = getGewerkeBild(gewerkeSlug);

  if (bild) {
    // Beschreibender Alt-Text aus dem, was vorliegt: Gewerk (+ Ort) – Name.
    const gewerkTeil = gewerkeName
      ? ort
        ? `${gewerkeName} in ${ort}`
        : gewerkeName
      : "";
    const alt = gewerkTeil ? `${gewerkTeil} – ${name}` : name;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={bild}
        alt={alt}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <PlatzhalterBild
      color={getGewerkeFarbe(gewerkeSlug)}
      initial={name.charAt(0).toUpperCase()}
      className={className}
      letterClassName={letterClassName}
    />
  );
}
