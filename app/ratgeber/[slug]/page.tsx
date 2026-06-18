import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const datumFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

function formatDatum(wert: string | null): string | null {
  if (!wert) return null;
  const datum = new Date(wert);
  return Number.isNaN(datum.getTime()) ? null : datumFormat.format(datum);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient(await cookies());
  const { data: artikel } = await supabase
    .from("artikel")
    .select("titel, auszug, cover_url, autor, veroeffentlicht_am, aktualisiert_am")
    .eq("slug", slug)
    .eq("status", "veroeffentlicht")
    .maybeSingle();

  if (!artikel) return { title: "Artikel nicht gefunden" };

  return {
    title: artikel.titel,
    description: artikel.auszug ?? undefined,
    alternates: { canonical: `/ratgeber/${slug}` },
    openGraph: {
      type: "article",
      locale: "de_DE",
      url: `/ratgeber/${slug}`,
      siteName: "Baumarkt Niederrhein",
      title: artikel.titel,
      description: artikel.auszug ?? undefined,
      // explizit setzen, sonst greift der siteweite Fallback nicht (gleiches
      // Next.js-Verhalten wie auf den Anbieter-Detailseiten):
      images: artikel.cover_url ? [artikel.cover_url] : ["/opengraph-image"],
      ...(artikel.veroeffentlicht_am
        ? { publishedTime: artikel.veroeffentlicht_am }
        : {}),
      ...(artikel.aktualisiert_am
        ? { modifiedTime: artikel.aktualisiert_am }
        : {}),
      ...(artikel.autor ? { authors: [artikel.autor] } : {}),
    },
  };
}

// Tailwind-Styling fuer den gerenderten Markdown (kein @tailwindcss/typography
// vorhanden). Markdown-# wird auf h2 abgebildet, damit genau eine h1 (der Titel)
// pro Seite bestehen bleibt.
const markdownComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl font-bold text-stone-900 sm:text-2xl" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl font-bold text-stone-900 sm:text-2xl" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-lg font-semibold text-stone-900" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed text-stone-700" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-1 pl-6 text-stone-700" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-1 pl-6 text-stone-700" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-orange-700 underline hover:text-orange-800" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-4 border-l-4 border-stone-300 pl-4 italic text-stone-600"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm text-stone-800" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-stone-300 py-2 pr-4 font-semibold text-stone-900" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-stone-200 py-2 pr-4 text-stone-700" {...props} />
  ),
};

export default async function ArtikelSeite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient(await cookies());
  const { data: artikel } = await supabase
    .from("artikel")
    .select(
      "titel, auszug, inhalt, cover_url, autor, kategorie_slug, veroeffentlicht_am"
    )
    .eq("slug", slug)
    .eq("status", "veroeffentlicht")
    .maybeSingle();

  if (!artikel) notFound();

  const datum = formatDatum(artikel.veroeffentlicht_am);
  const metaZeile = [artikel.autor, datum].filter(Boolean).join(" · ");

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <article>
          {artikel.cover_url && (
            <div className="mb-8 overflow-hidden rounded-2xl bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artikel.cover_url}
                alt={artikel.titel}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {artikel.titel}
          </h1>

          {metaZeile && (
            <p className="mt-3 text-sm text-stone-500">{metaZeile}</p>
          )}

          {artikel.auszug && (
            <p className="mt-6 text-lg leading-relaxed text-stone-600">
              {artikel.auszug}
            </p>
          )}

          <div className="mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {artikel.inhalt}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
