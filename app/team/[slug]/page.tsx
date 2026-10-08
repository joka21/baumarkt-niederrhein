import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/utils/supabase/public";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AUTOREN,
  autorAltText,
  autorenAusFeld,
  FIGUREN_HINWEIS,
  getAutor,
  tierName,
} from "@/lib/autoren";

// Nur die sechs festen Team-Slugs; alles andere liefert 404.
export const dynamicParams = false;
// Statisch erzeugt, stündlich aktualisiert (ISR) – die Artikelliste kommt aus Supabase.
export const revalidate = 3600;

export function generateStaticParams() {
  return AUTOREN.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const autor = getAutor(slug);
  if (!autor) return { title: "Nicht gefunden" };

  return {
    title: `${autor.name}, ${tierName(autor)} aus ${autor.ort}`,
    description: `${autor.name} – ${autor.rolle} im Ratgeber-Team von Baumarkt Niederrhein. Alle Artikel von ${autor.name} im Überblick.`,
    alternates: { canonical: `/team/${slug}` },
  };
}

const datumFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

function formatDatum(wert: string | null): string | null {
  if (!wert) return null;
  const datum = new Date(wert);
  return Number.isNaN(datum.getTime()) ? null : datumFormat.format(datum);
}

type ArtikelZeile = {
  slug: string;
  titel: string;
  auszug: string | null;
  autor: unknown;
  veroeffentlicht_am: string | null;
};

export default async function AutorSeite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const autor = getAutor(slug);
  if (!autor) notFound();

  // Wenige Artikel – Zuordnung im JS, funktioniert für Text- und Array-Feld.
  const supabase = supabasePublic;
  const { data } = await supabase
    .from("artikel")
    .select("slug, titel, auszug, autor, veroeffentlicht_am")
    .eq("status", "veroeffentlicht")
    .order("veroeffentlicht_am", { ascending: false });

  const artikel = ((data ?? []) as ArtikelZeile[]).filter((a) =>
    autorenAusFeld(a.autor).some((x) => x.slug === autor.slug)
  );

  const BASE_URL = "https://www.baumarkt-niederrhein.de";
  // BreadcrumbList spiegelt die sichtbare Brotkrumen-Navigation.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Unser Team", item: `${BASE_URL}/team` },
      { "@type": "ListItem", position: 3, name: autor.name, item: `${BASE_URL}/team/${autor.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-muted-strong">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-primary-strong">
                Startseite
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/team" className="transition-colors hover:text-primary-strong">
                Unser Team
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <span aria-current="page" className="text-text">
                {autor.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Figur */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
            <Image
              src={autor.bild}
              alt={autorAltText(autor)}
              fill
              preload
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-text">
              {autor.name}
            </h1>
            <p className="mt-2 text-text">
              {tierName(autor)} aus {autor.ort} · {autor.rolle}
            </p>
            <blockquote className="mt-6 border-l-4 border-primary-strong pl-4 text-lg italic text-text">
              „{autor.zitat}“
            </blockquote>

            {autor.themen.length > 0 && (
              <div className="mt-6">
                <h2 className="text-base text-text">Themen</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {autor.themen.map((thema) => (
                    <li
                      key={thema}
                      className="rounded-full border border-stroke px-4 py-1.5 text-sm font-medium text-text"
                    >
                      {thema}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-body-sm text-text">{FIGUREN_HINWEIS}</p>
          </div>
        </div>

        {/* Artikel der Figur */}
        <section aria-labelledby="artikel-titel" className="mt-14">
          <h2 id="artikel-titel" className="text-xl text-text">
            Artikel von {autor.name}
          </h2>

          {artikel.length === 0 ? (
            <p className="mt-4 text-text">
              Von {autor.name} sind noch keine Artikel erschienen.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stroke border-y border-stroke">
              {artikel.map((a) => {
                const datum = formatDatum(a.veroeffentlicht_am);
                return (
                  <li key={a.slug}>
                    <Link href={`/ratgeber/${a.slug}`} className="group block py-4">
                      {datum && (
                        <p className="text-xs font-medium text-text-muted-strong">{datum}</p>
                      )}
                      <h3 className="mt-1 text-text group-hover:text-primary-strong">
                        {a.titel}
                      </h3>
                      {a.auszug && (
                        <p className="mt-1 line-clamp-2 text-sm text-text">{a.auszug}</p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
