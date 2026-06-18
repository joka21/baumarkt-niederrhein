import Link from "next/link";

const gruppen = [
  {
    titel: "Service",
    links: [
      { label: "Anbieter finden", href: "/" },
      { label: "Ratgeber", href: "/ratgeber" },
      { label: "Kontakt", href: "/" },
    ],
  },
  {
    titel: "Für Anbieter",
    links: [
      { label: "Anbieter werden", href: "/fuer-anbieter" },
      { label: "So funktioniert's", href: "/fuer-anbieter" },
      { label: "Anbieter-Login", href: "/fuer-anbieter" },
    ],
  },
  {
    titel: "Unternehmen",
    links: [
      { label: "Über uns", href: "/" },
      { label: "Karriere", href: "/" },
      { label: "Presse", href: "/" },
    ],
  },
];

export default function Footer() {
  const jahr = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-sm font-bold text-white">
                BN
              </span>
              <span className="text-base font-semibold tracking-tight text-stone-900">
                Baumarkt Niederrhein
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-stone-500">
              Der regionale Marktplatz für Handwerk und Material am Niederrhein.
            </p>
          </div>

          {gruppen.map((gruppe) => (
            <div key={gruppe.titel}>
              <h3 className="text-sm font-semibold text-stone-900">{gruppe.titel}</h3>
              <ul className="mt-4 space-y-3">
                {gruppe.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-500 transition-colors hover:text-orange-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-stone-500 sm:flex-row sm:px-6">
          <p>© {jahr} Baumarkt Niederrhein</p>
          <nav className="flex items-center gap-6">
            <Link href="/impressum" className="transition-colors hover:text-orange-700">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:text-orange-700">
              Datenschutz
            </Link>
            <Link href="/agb" className="transition-colors hover:text-orange-700">
              AGB
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
