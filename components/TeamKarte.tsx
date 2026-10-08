import Image from "next/image";
import Link from "next/link";
import { autorAltText, type Autor } from "@/lib/autoren";

// Team-Karte nach Figma "Desktop Angebot Karte" (Knoten 75:568):
// Bild oben, Headline, Check-Liste (Themen), Zitat, Primär-Button.
export default function TeamKarte({
  autor,
  ueberschrift: Ueberschrift = "h2",
}: {
  autor: Autor;
  /** Überschriften-Ebene passend zur Seitengliederung. */
  ueberschrift?: "h2" | "h3";
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-surface drop-shadow-[0px_4px_3px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
        <Image
          src={autor.bild}
          alt={autorAltText(autor)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col items-start gap-3 p-6">
        <Ueberschrift className="text-h4 text-text">
          <Link href={`/team/${autor.slug}`} className="hover:text-primary">
            {autor.name}, {autor.tier} aus {autor.ort}
          </Link>
        </Ueberschrift>

        <p className="text-body-sm leading-snug text-text-muted">{autor.rolle}</p>

        <ul className="flex flex-col gap-1.5">
          {autor.themen.map((thema) => (
            <li key={thema} className="flex items-center gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Image src="/icons/check.svg" alt="" width={12} height={12} />
              </span>
              <span className="text-body-sm text-text-muted">{thema}</span>
            </li>
          ))}
        </ul>

        <blockquote className="text-body text-text">„{autor.zitat}“</blockquote>

        <Link
          href={`/team/${autor.slug}`}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-button text-surface transition-opacity hover:opacity-90"
        >
          Mehr über {autor.name}
          <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
        </Link>
      </div>
    </article>
  );
}
