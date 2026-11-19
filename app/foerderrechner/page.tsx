import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Foerderrechner from "@/components/foerderrechner/Foerderrechner";
import type { ZielSeite } from "@/components/foerderrechner/Ergebnis";
import { ladeSeite, seitenUrl } from "@/lib/altbau";
import { FOERDERRECHNER_OEFFENTLICH, FOERDERRECHNER_URL } from "@/lib/foerderung/sichtbarkeit";

const TITEL = "Förderrechner Sanierung NRW: Zuschuss für Heizung und Dämmung";
const BESCHREIBUNG =
  "Wie viel Förderung bekommst du für Heizungstausch, Dämmung und Fenster? Unser Rechner schätzt Zuschuss und Steuervorteil in wenigen Fragen, kostenlos und ohne Anmeldung.";

export const metadata: Metadata = {
  title: { absolute: TITEL },
  description: BESCHREIBUNG,
  alternates: { canonical: FOERDERRECHNER_URL },
  // Bis zur Freigabe nicht in Suchmaschinen (Schalter in lib/foerderung/sichtbarkeit.ts).
  robots: { index: FOERDERRECHNER_OEFFENTLICH, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: FOERDERRECHNER_URL,
    siteName: "Baumarkt Niederrhein",
    title: TITEL,
    description: BESCHREIBUNG,
    images: ["/opengraph-image"],
  },
};

// Vorhandene Altbau-Seiten für "Nächste Schritte" – nur, soweit sie existieren.
const ZIELSEITEN = [
  "energieberatung-isfp",
  "heizungsfoerderung-kfw-458",
  "solarpflicht-nrw",
  "fenster-lueftung",
  "checkliste",
];

function zielSeiten(): ZielSeite[] {
  return ZIELSEITEN.flatMap((slug) => {
    const seite = ladeSeite(slug);
    return seite ? [{ slug, titel: seite.titel, url: seitenUrl(slug) }] : [];
  });
}

export default function FoerderrechnerSeite() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-text">Förderrechner: Was bekommst du für deine Sanierung?</h1>
        <p className="mt-4 text-text">
          Heizung tauschen, Dach dämmen, neue Fenster: Für vieles gibt es Geld von KfW und BAFA
          oder einen Steuervorteil. Beantworte ein paar kurze Fragen, wir schätzen, was für dich
          drin ist. Deine Angaben bleiben in deinem Browser.
        </p>
        <noscript>
          <p className="mt-6 rounded-xl border border-stroke p-4 text-text">
            Der Rechner braucht JavaScript. Bitte schalte es für diese Seite ein.
          </p>
        </noscript>
        <Foerderrechner seiten={zielSeiten()} />
      </main>
      <Footer />
    </>
  );
}
