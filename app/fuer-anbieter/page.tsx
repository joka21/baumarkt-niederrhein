import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mailtoLink } from "@/lib/kontakt";

export const metadata: Metadata = {
  title: "Für Betriebe am Niederrhein",
  description:
    "Handwerksbetriebe und Händler vom Niederrhein können sich für das Verzeichnis von Baumarkt Niederrhein vormerken lassen.",
  alternates: { canonical: "/fuer-anbieter" },
};

const aufnahme = [
  "Handwerksbetriebe aller Gewerke",
  "Baumärkte, Baustoffhändler und Fachhändler",
  "Betriebe mit Sitz am Niederrhein",
];

export default function FuerBetriebe() {
  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <p className="text-body-sm font-bold uppercase tracking-wide text-primary">
          Für Betriebe
        </p>
        <h1 className="mt-4">Dein Betrieb auf Baumarkt Niederrhein</h1>
        <p className="mt-6">
          Baumarkt Niederrhein ist ein Ratgeber für Bauen, Renovieren und Handwerk in der
          Region. Ein Verzeichnis mit Handwerksbetrieben und Händlern vom Niederrhein bauen
          wir gerade auf.
        </p>
        <p className="mt-4">
          Wenn du mit deinem Betrieb dabei sein willst, schreib uns kurz Name, Gewerk und Ort.
          Wir melden uns, sobald die Einträge starten.
        </p>
        <a
          href={mailtoLink("Betrieb vormerken")}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-button text-surface transition-opacity hover:opacity-90"
        >
          Betrieb vormerken
        </a>

        <section aria-labelledby="aufnahme-titel" className="mt-16">
          <h2 id="aufnahme-titel">Was wir aufnehmen</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {aufnahme.map((punkt) => (
              <li key={punkt} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Image src="/icons/check.svg" alt="" width={12} height={12} />
                </span>
                {punkt}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
