import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamKarte from "@/components/TeamKarte";
import { AUTOREN } from "@/lib/autoren";
import { mailtoLink } from "@/lib/kontakt";

export const metadata: Metadata = {
  title: "Unser Team",
  description:
    "Sechs Tiere vom Niederrhein, sechs Meinungen: Steinkauz, Biberin, Fuchs, Feldhase, Kiebitz und Blässgans schreiben über Bauen und Renovieren.",
  alternates: { canonical: "/team" },
};

const TEXTLINK = "text-primary-strong underline underline-offset-2 hover:opacity-80";

export default function TeamSeite() {
  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="max-w-3xl pb-8">
          <h1 className="text-text">
            Unser Team
          </h1>
          <p className="mt-3 text-lg font-medium text-text">
            Sechs Tiere vom Niederrhein, sechs Meinungen, und selten sind sich alle einig.
          </p>
          <p className="mt-4 leading-relaxed text-text">
            Auf Baumarkt Niederrhein schreiben ein Steinkauz, eine Biberin, ein Fuchs, ein
            Feldhase, ein Kiebitz und eine Blässgans über Bauen, Renovieren und Handwerk in
            der Region. Jedes sieht dieselbe Frage anders. So bekommst du die Sichtweisen,
            die du für deine eigene Entscheidung brauchst.
          </p>
        </div>

        <section aria-labelledby="wer-schreibt" className="max-w-3xl rounded-2xl bg-surface p-6">
          <h2 id="wer-schreibt" className="text-xl text-text">
            Wer hier schreibt
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            Willi, Sandra, Rolf, Marco, Lena und Petra sind erfundene Figuren. Hinter ihnen
            steht die Redaktion von Baumarkt Niederrhein, die alle Texte schreibt und die
            fachlichen Angaben prüft.
          </p>
        </section>

        <section aria-label="Team-Mitglieder" className="mt-12">
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {AUTOREN.map((autor, i) => (
              <li key={autor.slug}>
                <TeamKarte autor={autor} preload={i === 0} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sanierungsprojekt" className="mt-16 max-w-3xl">
          <h2 id="sanierungsprojekt" className="text-xl text-text">
            Unser Sanierungsprojekt: Wer welche Rolle hat
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            Im{" "}
            <Link href="/altbau-sanieren/unser-projekt" className={TEXTLINK}>
              Sanierungsprojekt
            </Link>{" "}
            nehmen sich alle sechs gemeinsam ein altes Haus von 1964 vor. Jedes Tier schaut
            dabei auf etwas anderes:
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <strong>Willi</strong> prüft die Bausubstanz: Feuchtigkeit, Risse, Dach und alles,
            was man nicht einfach überstreichen sollte.
            <br />
            <strong>Sandra</strong> denkt an die Ausführung: Dachkonstruktion, Böden und alles,
            was später in Wand und Boden verschwindet.
            <br />
            <strong>Rolf</strong> rechnet: ob das Budget vollständig ist, warum es eine Reserve
            braucht und was warten kann.
            <br />
            <strong>Marco</strong> will einziehen, am liebsten sofort, und lernt, warum der
            schöne Boden zuletzt kommt.
            <br />
            <strong>Lena</strong> fragt nach: Lüftung, Solarpflicht und ob jede angebotene
            Technik wirklich nötig ist.
            <br />
            <strong>Petra</strong> plant die Reihenfolge und sorgt dafür, dass Fachleute wie
            Energieberater rechtzeitig dazukommen.
          </p>
          <p className="mt-3 leading-relaxed text-text">
            Das Haus ist erfunden, die Zahlen sind ein Rechenbeispiel. Statik, Energieberatung,
            Schadstoffuntersuchungen und verbindliche Angebote gehören bei einem echten Haus in
            die Hände qualifizierter Fachleute.
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <Link href="/altbau-sanieren/unser-projekt" className={TEXTLINK}>
              Zum Sanierungsprojekt
            </Link>{" "}
            ·{" "}
            <Link href="/altbau-sanieren" className={TEXTLINK}>
              Altbau sanieren am Niederrhein
            </Link>
          </p>
        </section>

        <section aria-labelledby="thema-fehlt" className="mt-16 max-w-3xl">
          <h2 id="thema-fehlt" className="text-xl text-text">
            Dir fehlt ein Thema?
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            <a
              href={mailtoLink("Themenwunsch")}
              className="text-primary-strong underline underline-offset-2 hover:opacity-80"
            >
              Schreib uns
            </a>
            , welche Frage wir als Nächstes beantworten sollen.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
