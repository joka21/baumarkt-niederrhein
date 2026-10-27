import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AltbauSeite, { MehrZumThema } from "@/components/AltbauSeite";
import Checkliste from "@/components/Checkliste";
import Markdown from "@/components/Markdown";
import {
  altbauMetadata,
  bereichsSeiten,
  ladeSeite,
  seitentyp,
  themenSeiten,
  zerlegeCheckliste,
} from "@/lib/altbau";

// Lösungsseiten und Checkliste – nur die Dateien aus content/altbau-sanieren.
export const dynamicParams = false;

export function generateStaticParams() {
  return themenSeiten().map((s) => ({ slug: s.slug }));
}

function ladeThemenSeite(slug: string) {
  const seite = ladeSeite(slug);
  const typ = seitentyp(slug);
  return seite && (typ === "loesung" || typ === "checkliste") ? seite : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seite = ladeThemenSeite(slug);
  return seite ? altbauMetadata(seite) : {};
}

export default async function AltbauThemenSeite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seite = ladeThemenSeite(slug);
  if (!seite) notFound();

  if (seitentyp(slug) === "checkliste") {
    const { vorher, gruppen, nachher } = zerlegeCheckliste(seite.inhalt);
    return (
      <AltbauSeite seite={seite} druckansicht>
        <Markdown figurenZitate>{vorher}</Markdown>
        <Checkliste gruppen={gruppen} />
        <Markdown figurenZitate>{nachher}</Markdown>
      </AltbauSeite>
    );
  }

  const weitere = bereichsSeiten().filter((s) => s.slug !== slug);
  return (
    <AltbauSeite seite={seite} unterhalb={<MehrZumThema seiten={weitere} />}>
      <Markdown figurenZitate>{seite.inhalt}</Markdown>
    </AltbauSeite>
  );
}
