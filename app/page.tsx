import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getGewerke, type Anbieter, type Kategorie } from "@/lib/types";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import AnbieterCard from "@/components/AnbieterCard";
import Footer from "@/components/Footer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: anbieterData } = await supabase
    .from("anbieter")
    .select(
      "id, slug, name, beschreibung, ort, anbieter_kategorien(kategorien(name, slug))"
    )
    .eq("status", "aktiv")
    .order("name");

  const { data: kategorienData } = await supabase
    .from("kategorien")
    .select("name, slug")
    .order("name");

  // Supabase typisiert die verschachtelte Relation als Array; zur Laufzeit ist
  // kategorien jedoch ein einzelnes Objekt – daher die Konvertierung über unknown.
  const alleAnbieter = (anbieterData ?? []) as unknown as Anbieter[];
  const kategorien = (kategorienData ?? []) as Kategorie[];

  // Filterung nach Gewerk im JS – bei der aktuellen Datenmenge ausreichend.
  const anbieter = kategorie
    ? alleAnbieter.filter((a) =>
        getGewerke(a).some((g) => g.slug === kategorie)
      )
    : alleAnbieter;

  return (
    <>
      <Header />
      <CategoryBar kategorien={kategorien} activeSlug={kategorie} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {anbieter.length === 0 ? (
          <p className="py-16 text-center text-stone-500">
            Für dieses Gewerk sind aktuell keine Anbieter verfügbar.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {anbieter.map((a) => (
              <AnbieterCard key={a.id} anbieter={a} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
