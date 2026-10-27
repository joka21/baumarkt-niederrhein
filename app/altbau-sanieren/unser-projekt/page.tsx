import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AltbauSeite from "@/components/AltbauSeite";
import Markdown from "@/components/Markdown";
import { altbauMetadata, ladeSeite } from "@/lib/altbau";

export const metadata: Metadata = (() => {
  const seite = ladeSeite("unser-projekt");
  return seite ? altbauMetadata(seite) : {};
})();

export default function UnserProjekt() {
  const seite = ladeSeite("unser-projekt");
  if (!seite) notFound();

  return (
    <AltbauSeite seite={seite}>
      <Markdown figurenZitate>{seite.inhalt}</Markdown>
    </AltbauSeite>
  );
}
