import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KONTAKT_EMAIL, KONTAKT_TELEFON } from "@/lib/kontakt";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von Baumarkt Niederrhein.",
  alternates: { canonical: "/impressum" },
};

const LINK = "text-primary underline underline-offset-2 hover:opacity-80";

export default function Impressum() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <h1>Impressum</h1>

        <p className="mt-8">
          Josef Kalenberg
          <br />
          Baumarkt Niederrhein
          <br />
          Am Königshof 47
          <br />
          47807 Krefeld
        </p>

        <h2 className="mt-10 text-h4">Kontakt</h2>
        <p className="mt-3">
          Telefon:{" "}
          <a href={`tel:${KONTAKT_TELEFON.replace(/\s/g, "")}`} className={LINK}>
            {KONTAKT_TELEFON}
          </a>
          <br />
          E-Mail:{" "}
          <a href={`mailto:${KONTAKT_EMAIL}`} className={LINK}>
            {KONTAKT_EMAIL}
          </a>
        </p>

        <h2 className="mt-10 text-h4">Umsatzsteuer-ID</h2>
        <p className="mt-3">
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          DE251978449
        </p>

        <h2 className="mt-10 text-h4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
        <p className="mt-3">Berufsbezeichnung: Entwickler</p>

        <h2 className="mt-10 text-h4">Redaktionell verantwortlich</h2>
        <p className="mt-3">
          Josef Kalenberg
          <br />
          Am Königshof 47
          <br />
          47807 Krefeld
        </p>

        <h2 className="mt-10 text-h4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
        <p className="mt-3">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <p className="mt-10 text-body-sm text-text-muted">
          Quelle:{" "}
          <a href="https://www.e-recht24.de/impressum-generator.html" className={LINK}>
            e-recht24.de
          </a>
        </p>
      </main>
      <Footer />
    </>
  );
}
