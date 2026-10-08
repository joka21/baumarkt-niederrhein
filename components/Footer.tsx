import Link from "next/link";
import { getHauptmenue } from "@/lib/navigation";

const rechtliches = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

export default function Footer() {
  const jahr = new Date().getFullYear();
  const menue = getHauptmenue();

  return (
    <footer className="mt-auto bg-dark-surface text-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-strong text-body-sm font-bold text-surface">
              BN
            </span>
            <span className="text-lg font-bold">Baumarkt Niederrhein</span>
          </Link>
          <p className="mt-4 max-w-sm">
            Sechs Stimmen zu Bauen, Renovieren und Handwerk am Niederrhein.
          </p>
        </div>

        <nav aria-label="Fußzeile">
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {menue.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-nav transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-surface/15">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-body-sm text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {jahr} Baumarkt Niederrhein</p>
          <ul className="flex items-center gap-6">
            {rechtliches.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-surface">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
