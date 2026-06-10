import Link from "next/link";
import type { Kategorie } from "@/lib/types";

function FilterIcon({ className = "" }: { className?: string }) {
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
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="white" />
      <circle cx="15" cy="12" r="2" fill="white" />
      <circle cx="8" cy="18" r="2" fill="white" />
    </svg>
  );
}

type CategoryBarProps = {
  kategorien: Kategorie[];
  activeSlug?: string;
};

export default function CategoryBar({ kategorien, activeSlug }: CategoryBarProps) {
  const eintraege = [
    { name: "Alle", slug: undefined as string | undefined, href: "/" },
    ...kategorien.map((k) => ({
      name: k.name,
      slug: k.slug,
      href: `/?kategorie=${k.slug}`,
    })),
  ];

  return (
    <div className="sticky top-[65px] z-40 border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <nav className="flex flex-1 items-center gap-6 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {eintraege.map((eintrag) => {
            const aktiv = eintrag.slug === activeSlug;
            return (
              <Link
                key={eintrag.name}
                href={eintrag.href}
                className={`group flex shrink-0 flex-col items-center gap-1 border-b-2 pb-1 text-sm font-medium transition-colors ${
                  aktiv
                    ? "border-orange-600 text-stone-900"
                    : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-900"
                }`}
              >
                {eintrag.name}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-900"
        >
          <FilterIcon className="h-4 w-4" />
          Filter
        </button>
      </div>
    </div>
  );
}
