import Link from "next/link";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-sm font-bold text-white">
              BN
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Baumarkt Niederrhein
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-stone-600 sm:gap-6">
            <Link href="/anbieter" className="transition-colors hover:text-amber-700">
              Anbieter finden
            </Link>
            <Link
              href="/fuer-anbieter"
              className="rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700"
            >
              Für Anbieter
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              Der regionale Marktplatz fürs Handwerk
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Handwerk &amp; Material vom Niederrhein
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-600">
              Geprüfte Handwerker und Händler aus Ihrer Region – mit Profil,
              Leistungen und Shop. Alles unter einer Marke, direkt vom
              Niederrhein.
            </p>

            {/* Suche (Platzhalter) */}
            <form className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Gewerk oder Ort suchen, z. B. Bodenleger Krefeld"
                aria-label="Gewerk oder Ort suchen"
                className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
              />
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Suchen
              </button>
            </form>
          </div>
        </section>

        {/* Zwei Karten: Für Kunden / Für Anbieter */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">
                Für Kunden
              </h2>
              <p className="mt-3 flex-1 text-stone-600">
                Finden Sie geprüfte Handwerker und Händler aus Ihrer Region.
                Vergleichen Sie Leistungen und kaufen Sie Material direkt im
                Shop.
              </p>
              <Link
                href="/anbieter"
                className="mt-6 inline-flex items-center font-semibold text-amber-700 transition-colors hover:text-amber-800"
              >
                Anbieter finden →
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">
                Für Anbieter
              </h2>
              <p className="mt-3 flex-1 text-stone-600">
                Präsentieren Sie Ihr Handwerk unter einer starken regionalen
                Marke und verkaufen Sie über Ihren eigenen Shop – wir kümmern
                uns um die Plattform.
              </p>
              <Link
                href="/fuer-anbieter"
                className="mt-6 inline-flex items-center font-semibold text-amber-700 transition-colors hover:text-amber-800"
              >
                Mehr erfahren →
              </Link>
            </div>
          </div>
        </section>

        {/* Unsere Anbieter */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            Unsere Anbieter
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Bodenjäger */}
            <Link
              href="/anbieter/bodenjaeger"
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-base font-bold text-white">
                BJ
              </span>
              <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-amber-700">
                Bodenjäger
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                Bodenbeläge &amp; Verlegung · Niederrhein
              </p>
              <span className="mt-4 text-sm font-semibold text-amber-700">
                Profil ansehen →
              </span>
            </Link>

            {/* Platzhalter */}
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-6 text-center"
              >
                <span className="text-sm font-medium text-stone-400">
                  Weitere Anbieter folgen
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:px-6">
          <p>© {year} Baumarkt Niederrhein</p>
          <nav className="flex items-center gap-6">
            <Link href="/impressum" className="transition-colors hover:text-amber-700">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:text-amber-700">
              Datenschutz
            </Link>
            <Link href="/agb" className="transition-colors hover:text-amber-700">
              AGB
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
