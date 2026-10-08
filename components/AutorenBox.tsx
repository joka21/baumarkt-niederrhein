import Image from "next/image";
import Link from "next/link";
import { autorAltText, FIGUREN_HINWEIS, tierName, type Autor } from "@/lib/autoren";

// Autorenbox unter einem Ratgeber-Artikel – eine Zeile pro Autor.
export default function AutorenBox({ autoren }: { autoren: Autor[] }) {
  if (autoren.length === 0) return null;

  return (
    <aside
      aria-label={autoren.length > 1 ? "Über die Autoren" : "Über den Autor"}
      className="mt-12 rounded-2xl border border-stroke p-6"
    >
      <ul className="space-y-6">
        {autoren.map((autor) => (
          <li key={autor.slug} className="flex items-center gap-4">
            <Image
              src={autor.bild}
              alt={autorAltText(autor)}
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 bg-surface object-cover"
            />
            <div>
              <p className="font-semibold text-text">{autor.name}</p>
              <p className="text-sm text-text">
                {tierName(autor)} · {autor.rolle}
              </p>
              <Link
                href={`/team/${autor.slug}`}
                className="mt-1 inline-block text-sm font-medium text-primary transition-colors hover:opacity-80"
              >
                Mehr über {autor.name} →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-stroke pt-4 text-body-sm text-text">
        {FIGUREN_HINWEIS}
      </p>
    </aside>
  );
}
