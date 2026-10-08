import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { supabasePublic } from "@/utils/supabase/public";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AutorenBox from "@/components/AutorenBox";
import { autorenAusFeld, autorenNamen } from "@/lib/autoren";

const datumFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

function formatDatum(wert: string | null): string | null {
  if (!wert) return null;
  const datum = new Date(wert);
  return Number.isNaN(datum.getTime()) ? null : datumFormat.format(datum);
}

// Statisch erzeugt, stündlich aktualisiert (ISR); neue Artikel werden beim ersten Aufruf erzeugt.
export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabasePublic
    .from("artikel")
    .select("slug")
    .eq("status", "veroeffentlicht");
  return (data ?? []).map((a) => ({ slug: a.slug as string }));
}

type Artikel = {
  slug: string;
  titel: string;
  auszug: string | null;
  inhalt: string;
  cover_url: string | null;
  autor: unknown;
  kategorie_slug: string | null;
  veroeffentlicht_am: string | null;
  aktualisiert_am: string | null;
  // Optionale SEO-Felder; fehlen sie in der Tabelle, bleibt der Wert undefined.
  seo_titel?: string | null;
  seo_beschreibung?: string | null;
};

// "*" statt Spaltenliste, damit die Seite auch ohne die SEO-Spalten funktioniert.
async function ladeArtikel(slug: string): Promise<Artikel | null> {
  const { data } = await supabasePublic
    .from("artikel")
    .select("*")
    .eq("slug", slug)
    .eq("status", "veroeffentlicht")
    .maybeSingle();
  return (data as Artikel | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await ladeArtikel(slug);
  if (!artikel) return { title: "Artikel nicht gefunden" };

  // seo_titel (max. 60 Zeichen) wird ohne Suffix verwendet.
  const titel = artikel.seo_titel || artikel.titel;
  const beschreibung = artikel.seo_beschreibung || artikel.auszug || undefined;

  return {
    title: artikel.seo_titel ? { absolute: artikel.seo_titel } : artikel.titel,
    description: beschreibung,
    alternates: { canonical: `/ratgeber/${slug}` },
    openGraph: {
      type: "article",
      locale: "de_DE",
      url: `/ratgeber/${slug}`,
      siteName: "Baumarkt Niederrhein",
      title: titel,
      description: beschreibung,
      // explizit setzen, sonst greift der siteweite Fallback nicht
      images: artikel.cover_url ? [artikel.cover_url] : ["/opengraph-image"],
      ...(artikel.veroeffentlicht_am ? { publishedTime: artikel.veroeffentlicht_am } : {}),
      ...(artikel.aktualisiert_am ? { modifiedTime: artikel.aktualisiert_am } : {}),
      authors: ["Baumarkt Niederrhein"],
    },
  };
}

// Tailwind-Styling fuer den gerenderten Markdown (kein @tailwindcss/typography
// vorhanden). Markdown-# wird auf h2 abgebildet, damit genau eine h1 (der Titel)
// pro Seite bestehen bleibt.
const markdownComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl text-text sm:text-2xl" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl text-text sm:text-2xl" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-lg text-text" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed text-text" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-1 pl-6 text-text" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-1 pl-6 text-text" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-primary-strong underline underline-offset-2 hover:opacity-80" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-4 border-l-4 border-stroke pl-4 italic text-text"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-text" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-stroke py-2 pr-4 font-semibold text-text" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-stroke py-2 pr-4 text-text" {...props} />
  ),
};

export default async function ArtikelSeite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artikel = await ladeArtikel(slug);
  if (!artikel) notFound();

  const veroeffentlicht = formatDatum(artikel.veroeffentlicht_am);
  const aktualisiert = formatDatum(artikel.aktualisiert_am);
  // "autor" enthält Team-Slug(s); ohne Zuordnung erscheint die Redaktion.
  const autoren = autorenAusFeld(artikel.autor);
  const autorText = autorenNamen(autoren);

  // Bis zu drei verwandte Artikel: gleiches Gewerk oder gleiche Autorenschaft zuerst.
  const { data: andereData } = await supabasePublic
    .from("artikel")
    .select("slug, titel, autor, kategorie_slug, veroeffentlicht_am")
    .eq("status", "veroeffentlicht")
    .neq("slug", slug)
    .order("veroeffentlicht_am", { ascending: false })
    .limit(30);
  const autorSlugs = new Set(autoren.map((a) => a.slug));
  const verwandt = ((andereData ?? []) as Pick<Artikel, "slug" | "titel" | "autor" | "kategorie_slug">[])
    .map((a) => ({
      ...a,
      punkte:
        (artikel.kategorie_slug && a.kategorie_slug === artikel.kategorie_slug ? 2 : 0) +
        (autorenAusFeld(a.autor).some((x) => autorSlugs.has(x.slug)) ? 1 : 0),
    }))
    .sort((a, b) => b.punkte - a.punkte)
    .slice(0, 3);

  // Strukturierte Daten (BlogPosting + BreadcrumbList) – wiederverwendet das
  // bereits geladene artikel, kein zusaetzlicher Query.
  const BASE_URL = "https://www.baumarkt-niederrhein.de";
  const articleUrl = `${BASE_URL}/ratgeber/${slug}`;
  const articleImage = artikel.cover_url ?? `${BASE_URL}/opengraph-image`;

  const organization = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Baumarkt Niederrhein",
    url: `${BASE_URL}/`,
  };

  const blogPosting = {
    "@type": "BlogPosting",
    headline: artikel.titel,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    image: articleImage,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    // Bewusst kein "Person"-Schema: Die Team-Figuren sind erfunden, verantwortlich
    // ist die Redaktion – Autor und Herausgeber ist die Organisation.
    publisher: organization,
    author: organization,
    ...((artikel.seo_beschreibung || artikel.auszug)
      ? { description: artikel.seo_beschreibung || artikel.auszug }
      : {}),
    ...(artikel.veroeffentlicht_am
      ? { datePublished: artikel.veroeffentlicht_am }
      : {}),
    ...(artikel.aktualisiert_am
      ? { dateModified: artikel.aktualisiert_am }
      : {}),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${BASE_URL}/ratgeber` },
      { "@type": "ListItem", position: 3, name: artikel.titel, item: articleUrl },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [blogPosting, breadcrumb],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {/* Sichtbare Breadcrumb – spiegelt das JSON-LD BreadcrumbList */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-muted-strong">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-primary-strong">
                Startseite
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                href="/ratgeber"
                className="transition-colors hover:text-primary-strong"
              >
                Ratgeber
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <span aria-current="page" className="text-text">
                {artikel.titel}
              </span>
            </li>
          </ol>
        </nav>

        <article>
          {artikel.cover_url && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={artikel.cover_url}
                alt={artikel.titel}
                fill
                preload
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <h1 className="text-text">
            {artikel.titel}
          </h1>

          <p className="mt-3 text-body-sm text-text-muted-strong">
            {autorText}
            {veroeffentlicht && artikel.veroeffentlicht_am && (
              <>
                {" · Veröffentlicht am "}
                <time dateTime={artikel.veroeffentlicht_am}>{veroeffentlicht}</time>
              </>
            )}
            {aktualisiert && artikel.aktualisiert_am && aktualisiert !== veroeffentlicht && (
              <>
                {" · Aktualisiert am "}
                <time dateTime={artikel.aktualisiert_am}>{aktualisiert}</time>
              </>
            )}
          </p>

          {artikel.auszug && (
            <p className="mt-6 text-lg leading-relaxed text-text">
              {artikel.auszug}
            </p>
          )}

          <div className="mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {artikel.inhalt}
            </ReactMarkdown>
          </div>

          <AutorenBox autoren={autoren} />
        </article>

        {verwandt.length > 0 && (
          <section aria-labelledby="verwandt-titel" className="mt-12 border-t border-stroke pt-8">
            <h2 id="verwandt-titel" className="text-h4">
              Weitere Ratgeber
            </h2>
            <ul className="mt-4 space-y-3">
              {verwandt.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/ratgeber/${a.slug}`}
                    className="font-bold text-text transition-colors hover:text-primary-strong"
                  >
                    {a.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
