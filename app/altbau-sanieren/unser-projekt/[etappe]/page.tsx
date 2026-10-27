import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AltbauSeite from "@/components/AltbauSeite";
import Markdown from "@/components/Markdown";
import { altbauMetadata, etappen, PROJEKT_BASIS, seitenUrl } from "@/lib/altbau";

// Nur etappe-1 … etappe-6 aus content/altbau-sanieren.
export const dynamicParams = false;

export function generateStaticParams() {
  return etappen().map((s) => ({ etappe: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ etappe: string }>;
}): Promise<Metadata> {
  const { etappe } = await params;
  const seite = etappen().find((s) => s.slug === etappe);
  return seite ? altbauMetadata(seite) : {};
}

const NAV_LINK = "font-bold text-text transition-colors hover:text-primary-strong";

export default async function Etappe({ params }: { params: Promise<{ etappe: string }> }) {
  const { etappe } = await params;
  const alle = etappen();
  const index = alle.findIndex((s) => s.slug === etappe);
  if (index < 0) notFound();

  const seite = alle[index];
  const zurueck = alle[index - 1];
  const weiter = alle[index + 1];

  const navigation = (
    <nav aria-label="Etappen" className="mt-12 border-t border-stroke pt-8">
      <ul className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <li>
          {zurueck && (
            <Link href={seitenUrl(zurueck.slug)} className={NAV_LINK}>
              <span aria-hidden="true">← </span>Zurück: {zurueck.titel}
            </Link>
          )}
        </li>
        <li className="sm:text-right">
          {weiter && (
            <Link href={seitenUrl(weiter.slug)} className={NAV_LINK}>
              Weiter: {weiter.titel}
              <span aria-hidden="true"> →</span>
            </Link>
          )}
        </li>
      </ul>
      <p className="mt-6">
        <Link
          href={PROJEKT_BASIS}
          className="text-button text-primary-strong transition-opacity hover:opacity-80"
        >
          Zur Projekt-Einführung
        </Link>
      </p>
    </nav>
  );

  return (
    <AltbauSeite seite={seite} unterhalb={navigation}>
      <Markdown figurenZitate>{seite.inhalt}</Markdown>
    </AltbauSeite>
  );
}
