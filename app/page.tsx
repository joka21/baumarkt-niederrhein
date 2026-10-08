import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabasePublic } from "@/utils/supabase/public";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamKarte from "@/components/TeamKarte";
import {
  AUTOREN,
  autorAltText,
  autorenAusFeld,
  autorenNamen,
  type Autor,
} from "@/lib/autoren";
import { getLiveStaedte } from "@/lib/staedte";

// Statisch erzeugt, stündlich aktualisiert (ISR).
export const revalidate = 3600;

const TITEL = "Baumarkt Niederrhein: Ratgeber für Bauen und Renovieren";
const BESCHREIBUNG =
  "Sechs Tiere vom Niederrhein schreiben über Bauen, Renovieren und Handwerk. Mit Ratgebern, Kostenübersichten und den Baumärkten in deiner Stadt.";

export const metadata: Metadata = {
  title: { absolute: TITEL },
  description: BESCHREIBUNG,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Baumarkt Niederrhein",
    title: TITEL,
    description: BESCHREIBUNG,
  },
};

type ArtikelZeile = {
  slug: string;
  titel: string;
  auszug: string | null;
  autor: unknown;
  kategorie_slug: string | null;
};

const BUTTON_PRIMAER =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary-strong px-7 py-3.5 text-button text-surface transition-opacity hover:opacity-90";
const BUTTON_SEKUNDAER =
  "inline-flex items-center justify-center gap-2 rounded-full border border-primary-strong px-7 py-3.5 text-button text-primary-strong transition-opacity hover:opacity-80";
const TEXTLINK = "text-button text-primary-strong transition-opacity hover:opacity-80";

// Kleines quadratisches Autorenbild; ohne Team-Zuordnung das Redaktions-Kürzel.
function AutorBild({ autor, groesse }: { autor?: Autor; groesse: number }) {
  if (!autor) {
    return (
      <span
        aria-hidden="true"
        style={{ width: groesse, height: groesse }}
        className="flex shrink-0 items-center justify-center rounded-lg bg-primary-strong text-body-sm font-bold text-surface"
      >
        BN
      </span>
    );
  }
  return (
    <Image
      src={autor.bild}
      alt={autorAltText(autor)}
      width={groesse}
      height={groesse}
      className="shrink-0 rounded-lg object-cover"
    />
  );
}

export default async function Home() {
  const supabase = supabasePublic;

  const [{ data: artikelData }, { data: kategorienData }] = await Promise.all([
    supabase
      .from("artikel")
      .select("slug, titel, auszug, autor, kategorie_slug")
      .eq("status", "veroeffentlicht")
      .order("veroeffentlicht_am", { ascending: false })
      .limit(50),
    supabase.from("kategorien").select("name, slug"),
  ]);

  const artikel = ((artikelData ?? []) as ArtikelZeile[]).map((a) => ({
    ...a,
    autoren: autorenAusFeld(a.autor),
  }));
  const themaName = new Map(
    ((kategorienData ?? []) as { name: string; slug: string }[]).map((k) => [k.slug, k.name])
  );

  const staedte = getLiveStaedte();
  const frageDerWoche = artikel.find((a) => a.autoren.length > 1);
  const neueArtikel = artikel.slice(0, 6);

  // Siteweites Marken-Schema (Organization + WebSite) mit stabilen @id-Ankern.
  // Bewusst kein "Person": Die Autorenfiguren sind erfunden.
  const BASE_URL = "https://www.baumarkt-niederrhein.de";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Baumarkt Niederrhein",
        url: `${BASE_URL}/`,
        description: BESCHREIBUNG,
        areaServed: "Niederrhein",
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: "Baumarkt Niederrhein",
        inLanguage: "de-DE",
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
        {/* 1. Einstieg */}
        <section aria-labelledby="einstieg" className="py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 id="einstieg">Bauen und Renovieren am Niederrhein</h1>
            <p className="mt-4">
              Sechs Tiere vom Niederrhein sagen dir, was sie von Laminat, Fliesen und
              Handwerkerpreisen halten. Dazu findest du die Baumärkte in deiner Stadt.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
            {AUTOREN.map((autor) => (
              <li key={autor.slug}>
                <Link href={`/team/${autor.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src={autor.bild}
                      alt={autorAltText(autor)}
                      fill
                      preload
                      sizes="(min-width: 768px) 16vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-2 block text-center text-body-sm text-text group-hover:text-primary-strong">
                    {autor.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ratgeber" className={BUTTON_PRIMAER}>
              Ratgeber lesen
            </Link>
            {staedte.length > 0 && (
              <Link href="#baumaerkte" className={BUTTON_SEKUNDAER}>
                Baumarkt in deiner Stadt
              </Link>
            )}
          </div>
        </section>

        {/* 2. Baumärkte nach Stadt – nur wenn mindestens eine Stadt live ist */}
        {staedte.length > 0 && (
          <section
            id="baumaerkte"
            aria-labelledby="baumaerkte-titel"
            className="scroll-mt-24 border-t border-stroke py-12 md:py-16"
          >
            <h2 id="baumaerkte-titel">Baumärkte in deiner Stadt</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {staedte.map((stadt) => (
                <li key={stadt.slug}>
                  <Link
                    href={`/baumaerkte/${stadt.slug}`}
                    className="flex h-full items-center justify-between gap-2 rounded-2xl border border-stroke p-5 text-text transition-colors hover:border-primary-strong hover:text-primary-strong"
                  >
                    <span className="font-bold">{stadt.name}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 3. Die Frage der Woche – neuester Artikel mit mehreren Autoren */}
        {frageDerWoche && (
          <section aria-labelledby="frage-titel" className="border-t border-stroke py-12 md:py-16">
            <h2 id="frage-titel">Die Frage der Woche</h2>
            <article className="mt-8 rounded-2xl border border-stroke p-6 md:p-8">
              <h3 className="text-h4">{frageDerWoche.titel}</h3>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Beteiligte Autoren">
                {frageDerWoche.autoren.map((autor) => (
                  <li key={autor.slug}>
                    <AutorBild autor={autor} groesse={56} />
                  </li>
                ))}
              </ul>
              {frageDerWoche.auszug && (
                <p className="mt-4 max-w-3xl">{frageDerWoche.auszug}</p>
              )}
              <Link href={`/ratgeber/${frageDerWoche.slug}`} className={`mt-6 ${BUTTON_PRIMAER}`}>
                Alle Meinungen lesen
              </Link>
            </article>
          </section>
        )}

        {/* 4. Neu im Ratgeber */}
        {neueArtikel.length > 0 && (
          <section aria-labelledby="neu-titel" className="border-t border-stroke py-12 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="neu-titel">Neu im Ratgeber</h2>
              <Link href="/ratgeber" className={TEXTLINK}>
                Alle Ratgeber →
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {neueArtikel.map((a) => {
                const thema = a.kategorie_slug ? themaName.get(a.kategorie_slug) : undefined;
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/ratgeber/${a.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-stroke p-6 transition-colors hover:border-primary-strong"
                    >
                      {thema && <p className="text-body-sm text-text-muted-strong">{thema}</p>}
                      <h3 className="mt-2 text-h5 group-hover:text-primary-strong">{a.titel}</h3>
                      <div className="mt-auto flex items-center gap-3 pt-6">
                        <AutorBild autor={a.autoren[0]} groesse={40} />
                        <span className="text-body-sm text-text">{autorenNamen(a.autoren)}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* 5. Das Team */}
        <section aria-labelledby="team-titel" className="border-t border-stroke py-12 md:py-16">
          <h2 id="team-titel">Wer hier schreibt</h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {AUTOREN.map((autor) => (
              <li key={autor.slug}>
                <TeamKarte autor={autor} ueberschrift="h3" />
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl">
            Willi, Sandra, Rolf, Marco, Lena und Petra sind erfundene Figuren. Die Texte
            schreibt und prüft die Redaktion von Baumarkt Niederrhein.
          </p>
          <Link href="/team" className={`mt-4 inline-block ${TEXTLINK}`}>
            Das Team kennenlernen →
          </Link>
        </section>

        {/* 6. Für Betriebe */}
        <section aria-labelledby="betriebe-titel" className="py-12 md:py-16">
          <div className="rounded-2xl bg-dark-surface p-8 text-surface md:p-12">
            <h2 id="betriebe-titel" className="text-h3">
              Du führst einen Betrieb am Niederrhein?
            </h2>
            <p className="mt-4 max-w-2xl">
              Handwerksbetriebe und Händler aus der Region können sich bei uns eintragen.
            </p>
            <Link href="/fuer-anbieter" className={`mt-6 ${BUTTON_PRIMAER}`}>
              Betrieb vormerken
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
