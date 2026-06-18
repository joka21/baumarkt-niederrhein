import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ratgeber – Tipps rund um Handwerk & Material am Niederrhein",
  description:
    "Praktische Ratgeber-Artikel zu Handwerk, Material und Renovierung am Niederrhein.",
  alternates: { canonical: "/ratgeber" },
};

const datumFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" });

function formatDatum(wert: string | null): string | null {
  if (!wert) return null;
  const datum = new Date(wert);
  return Number.isNaN(datum.getTime()) ? null : datumFormat.format(datum);
}

type ArtikelKarte = {
  slug: string;
  titel: string;
  auszug: string | null;
  cover_url: string | null;
  veroeffentlicht_am: string | null;
};

export default async function RatgeberUebersicht() {
  const supabase = createClient(await cookies());

  const { data } = await supabase
    .from("artikel")
    .select("slug, titel, auszug, cover_url, veroeffentlicht_am")
    .eq("status", "veroeffentlicht")
    .order("veroeffentlicht_am", { ascending: false });

  const artikel = (data ?? []) as ArtikelKarte[];

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="pb-6 sm:pb-8">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Ratgeber – Tipps rund um Handwerk &amp; Material am Niederrhein
          </h1>
          <p className="mt-2 text-stone-600">
            Praktische Artikel zu Handwerk, Material und Renovierung.
          </p>
        </div>

        {artikel.length === 0 ? (
          <p className="py-16 text-center text-stone-500">
            Aktuell sind noch keine Ratgeber-Artikel verfügbar – schauen Sie bald
            wieder vorbei.
          </p>
        ) : (
          <section aria-label="Ratgeber-Artikel">
            <h2 className="sr-only">Artikel</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {artikel.map((a) => {
                const datum = formatDatum(a.veroeffentlicht_am);
                return (
                  <Link
                    key={a.slug}
                    href={`/ratgeber/${a.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100">
                      {a.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.cover_url}
                          alt={a.titel}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center bg-stone-200"
                          aria-hidden="true"
                        >
                          <span className="text-4xl font-bold text-white/90">
                            {a.titel.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      {datum && (
                        <p className="text-xs font-medium text-stone-500">{datum}</p>
                      )}
                      <h3 className="mt-1 font-semibold text-stone-900 group-hover:text-orange-700">
                        {a.titel}
                      </h3>
                      {a.auszug && (
                        <p className="mt-1 line-clamp-3 text-sm text-stone-500">
                          {a.auszug}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
