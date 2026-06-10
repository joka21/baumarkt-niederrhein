import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vorteile = [
  {
    titel: "Sichtbar in der Region",
    text: "Präsentieren Sie Ihr Handwerk unter einer starken regionalen Marke und werden Sie von Kunden am Niederrhein gefunden.",
  },
  {
    titel: "Eigenes Profil",
    text: "Name, Leistungen, Gewerke und Kontaktdaten – übersichtlich aufbereitet im modernen Inserats-Stil.",
  },
  {
    titel: "Anfragen direkt erhalten",
    text: "Interessenten nehmen unkompliziert Kontakt auf. Sie entscheiden, welche Aufträge zu Ihnen passen.",
  },
];

export default function FuerAnbieter() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
            Anbieter werden
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Ihr Handwerk. Ihre Region. Ihre Kunden.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            Werden Sie Teil von Baumarkt Niederrhein und erreichen Sie neue
            Kunden aus Ihrer Umgebung – mit einem professionellen Profil unter
            einer gemeinsamen, vertrauenswürdigen Marke.
          </p>
          <div className="mt-10">
            <Link
              href="/fuer-anbieter"
              className="inline-block rounded-full bg-orange-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Jetzt kostenlos starten
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {vorteile.map((vorteil) => (
              <div
                key={vorteil.titel}
                className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-stone-900">
                  {vorteil.titel}
                </h2>
                <p className="mt-3 text-stone-600">{vorteil.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
