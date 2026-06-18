import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen von Baumarkt Niederrhein.",
  alternates: { canonical: "/agb" },
};

export default function AGB() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">AGB</h1>
        <p className="mt-4 text-stone-600">Inhalt folgt.</p>
      </main>
      <Footer />
    </>
  );
}
