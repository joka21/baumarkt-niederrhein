import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description:
    "Diese Seite gibt es auf Baumarkt Niederrhein nicht. Hier findest du den Weg zurück zur Startseite, zu unseren Ratgebern und zum Team vom Niederrhein.",
};

const ziele = [
  { label: "Zur Startseite", href: "/" },
  { label: "Zum Ratgeber", href: "/ratgeber" },
  { label: "Zum Team", href: "/team" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <h1>Seite nicht gefunden</h1>
        <p className="mt-4">
          Diese Seite gibt es nicht oder nicht mehr. Vielleicht hilft dir einer dieser Wege weiter:
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {ziele.map((ziel) => (
            <li key={ziel.href}>
              <Link
                href={ziel.href}
                className="inline-flex items-center justify-center rounded-full bg-primary-strong px-7 py-3.5 text-button text-surface transition-opacity hover:opacity-90"
              >
                {ziel.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
