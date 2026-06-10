import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getGewerke, type Anbieter } from "@/lib/types";
import { getGewerkeFarbe } from "@/lib/gewerke";
import GewerkeBild from "@/components/GewerkeBild";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export default async function AnbieterDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("anbieter")
    .select(
      "id, slug, name, beschreibung, ort, plz, einzugsgebiet, kontakt_email, kontakt_telefon, logo_url, status, anbieter_kategorien(kategorien(name, slug))"
    )
    .eq("slug", slug)
    .eq("status", "aktiv")
    .maybeSingle();

  if (!data) {
    notFound();
  }

  // Supabase typisiert die verschachtelte Relation als Array; zur Laufzeit ist
  // kategorien jedoch ein einzelnes Objekt – daher die Konvertierung über unknown.
  const anbieter = data as unknown as Anbieter;
  const gewerke = getGewerke(anbieter);
  const erstesGewerk = gewerke[0];
  const farbe = getGewerkeFarbe(erstesGewerk?.slug);
  const standort = [anbieter.plz, anbieter.ort].filter(Boolean).join(" ");

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Titelzeile */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            {anbieter.name}
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            {[gewerke.map((g) => g.name).join(", "), standort || anbieter.ort]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        {/* Galerie aus Platzhalter-Bildflächen in Gewerk-Farbe */}
        <div className="mt-6 grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-80">
          <div className="col-span-4 row-span-2 h-48 sm:col-span-2 sm:h-auto">
            <GewerkeBild
              gewerkeSlug={erstesGewerk?.slug}
              gewerkeName={erstesGewerk?.name}
              name={anbieter.name}
              letterClassName="text-7xl"
            />
          </div>
          <div className="hidden opacity-90 sm:block" style={{ backgroundColor: farbe }} />
          <div className="hidden opacity-75 sm:block" style={{ backgroundColor: farbe }} />
          <div className="hidden opacity-80 sm:block" style={{ backgroundColor: farbe }} />
          <div className="hidden opacity-95 sm:block" style={{ backgroundColor: farbe }} />
        </div>

        {/* Zweispaltig */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Beschreibung */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-stone-900">Über den Anbieter</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">
              {anbieter.beschreibung ?? "Für diesen Anbieter liegt noch keine Beschreibung vor."}
            </p>

            {gewerke.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-stone-900">Gewerke</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {gewerke.map((g) => (
                    <span
                      key={g.slug}
                      className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {anbieter.einzugsgebiet && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-stone-900">Einzugsgebiet</h3>
                <p className="mt-2 text-stone-700">{anbieter.einzugsgebiet}</p>
              </div>
            )}
          </div>

          {/* Sticky Kontaktkarte */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-stone-200 p-6 shadow-lg">
              <p className="text-lg font-semibold text-stone-900">Kontakt aufnehmen</p>
              <p className="mt-1 text-sm text-stone-500">
                Unverbindlich anfragen – meist Antwort innerhalb eines Werktags.
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                {anbieter.kontakt_email && (
                  <div className="flex items-center gap-3 text-stone-700">
                    <MailIcon className="h-5 w-5 text-orange-600" />
                    <span className="truncate">{anbieter.kontakt_email}</span>
                  </div>
                )}
                {anbieter.kontakt_telefon && (
                  <div className="flex items-center gap-3 text-stone-700">
                    <PhoneIcon className="h-5 w-5 text-orange-600" />
                    <span>{anbieter.kontakt_telefon}</span>
                  </div>
                )}
              </dl>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Anfrage senden
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
