import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FIGUREN_HINWEIS } from "@/lib/autoren";
import {
  ALTBAU_BASIS,
  PROJEKT_BASIS,
  seitentyp,
  seitenUrl,
  type AltbauSeite as Seite,
} from "@/lib/altbau";

const BASE_URL = "https://www.baumarkt-niederrhein.de";

type Kruemel = { name: string; href: string };

function brotkrumen(seite: Seite): Kruemel[] {
  const typ = seitentyp(seite.slug);
  const pfad: Kruemel[] = [
    { name: "Startseite", href: "/" },
    { name: "Altbau sanieren", href: ALTBAU_BASIS },
  ];
  if (typ === "uebersicht") return pfad;
  if (typ === "etappe") pfad.push({ name: "Unser Projekt", href: PROJEKT_BASIS });
  pfad.push({ name: seite.titel, href: seitenUrl(seite.slug) });
  return pfad;
}

// Strukturierte Daten: WebPage bzw. Article plus BreadcrumbList.
function jsonLd(seite: Seite, pfad: Kruemel[]) {
  const typ = seitentyp(seite.slug);
  const url = `${BASE_URL}${seitenUrl(seite.slug)}`;
  const organization = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Baumarkt Niederrhein",
    url: `${BASE_URL}/`,
  };
  const istArtikel = typ === "loesung" || typ === "etappe";

  const seitenSchema = {
    "@type": istArtikel ? "Article" : "WebPage",
    ...(istArtikel
      ? {
          headline: seite.titel,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          image: `${BASE_URL}/opengraph-image`,
        }
      : { name: seite.titel }),
    url,
    description: seite.seoBeschreibung,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    // Bewusst kein "Person"-Schema: Die Team-Figuren sind erfunden, verantwortlich
    // ist die Redaktion – Autor und Herausgeber ist die Organisation.
    publisher: organization,
    author: organization,
    dateModified: seite.stand,
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: pfad.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k.name,
      item: `${BASE_URL}${k.href === "/" ? "/" : k.href}`,
    })),
  };

  return { "@context": "https://schema.org", "@graph": [seitenSchema, breadcrumb] };
}

/** Seitenrahmen für alle Seiten unter /altbau-sanieren. */
export default function AltbauSeite({
  seite,
  children,
  unterhalb,
  druckansicht = false,
}: {
  seite: Seite;
  children: React.ReactNode;
  /** Navigation unterhalb des Inhalts ("Mehr zum Thema", Etappen). */
  unterhalb?: React.ReactNode;
  /** Markiert die Seite für die Druckansicht (siehe app/globals.css). */
  druckansicht?: boolean;
}) {
  const pfad = brotkrumen(seite);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(seite, pfad)) }}
      />

      <Header />

      <main
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6"
        {...(druckansicht ? { "data-druckansicht": "" } : {})}
      >
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-muted-strong">
          <ol className="flex flex-wrap items-center gap-1.5">
            {pfad.map((k, i) => {
              const letzter = i === pfad.length - 1;
              return (
                <li key={k.href} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true">›</span>}
                  {letzter ? (
                    <span aria-current="page" className="text-text">
                      {k.name}
                    </span>
                  ) : (
                    <Link href={k.href} className="transition-colors hover:text-primary-strong">
                      {k.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <article>
          <h1 className="text-text">{seite.titel}</h1>
          <div className="mt-6">{children}</div>
        </article>

        {unterhalb}

        <p className="mt-12 border-t border-stroke pt-4 text-body-sm text-text">
          {FIGUREN_HINWEIS}
        </p>
      </main>

      <Footer />
    </>
  );
}

/** Liste "Mehr zum Thema" mit den übrigen Seiten des Bereichs. */
export function MehrZumThema({ seiten }: { seiten: Seite[] }) {
  if (seiten.length === 0) return null;
  return (
    <section aria-labelledby="mehr-titel" className="mt-12 border-t border-stroke pt-8">
      <h2 id="mehr-titel" className="text-h4">
        Mehr zum Thema
      </h2>
      <ul className="mt-4 space-y-3">
        {seiten.map((s) => (
          <li key={s.slug}>
            <Link
              href={seitenUrl(s.slug)}
              className="font-bold text-text transition-colors hover:text-primary-strong"
            >
              {s.titel}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
