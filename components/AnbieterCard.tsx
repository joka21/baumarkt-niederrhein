import Link from "next/link";
import { getGewerke, type Anbieter } from "@/lib/types";
import GewerkeBild from "@/components/GewerkeBild";

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="white"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 1.9 4.9 5.2 4.3 7.4 3.9 9.4 5 12 7.5 14.6 5 16.6 3.9 18.8 4.3c3.3.6 4.8 4.1 3.2 7.4C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

export default function AnbieterCard({ anbieter }: { anbieter: Anbieter }) {
  const gewerke = getGewerke(anbieter);
  const erstesGewerk = gewerke[0];

  return (
    <Link href={`/anbieter/${anbieter.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <GewerkeBild
          gewerkeSlug={erstesGewerk?.slug}
          gewerkeName={erstesGewerk?.name}
          name={anbieter.name}
          className="transition-transform duration-300 group-hover:scale-105"
          letterClassName="text-6xl"
        />
        <span className="absolute right-3 top-3 text-stone-900/30 transition-colors group-hover:text-stone-900/50">
          <HeartIcon className="h-7 w-7 drop-shadow" />
        </span>
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-stone-900">{anbieter.name}</h3>
        <p className="mt-0.5 text-sm text-stone-500">
          {[erstesGewerk?.name, anbieter.ort].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
