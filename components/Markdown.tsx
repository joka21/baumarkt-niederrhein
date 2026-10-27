import Image from "next/image";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { autorAltText, getAutor } from "@/lib/autoren";

// Tailwind-Styling fuer den gerenderten Markdown (kein @tailwindcss/typography
// vorhanden). Markdown-# wird auf h2 abgebildet, damit genau eine h1 (der Titel)
// pro Seite bestehen bleibt.
export const markdownComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl text-text sm:text-2xl" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-xl text-text sm:text-2xl" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-lg text-text" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed text-text" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-1 pl-6 text-text" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-1 pl-6 text-text" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-primary-strong underline underline-offset-2 hover:opacity-80" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-4 border-l-4 border-stroke pl-4 italic text-text"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-surface px-1.5 py-0.5 text-sm text-text" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border-b border-stroke py-2 pr-4 font-semibold text-text" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-stroke py-2 pr-4 text-text" {...props} />
  ),
};

type HastKnoten = { type: string; tagName?: string; value?: string; children?: HastKnoten[] };

// Erkennt Absätze wie "**Rolf, der Fuchs aus Moers:** „…“" oder "**Rolf:** „…“",
// deren Name einer Figur aus lib/autoren.ts entspricht.
function figurAusAbsatz(node: HastKnoten | undefined) {
  const erstes = node?.children?.[0];
  if (erstes?.type !== "element" || erstes.tagName !== "strong") return null;
  const label = erstes.children?.length === 1 ? erstes.children[0].value : undefined;
  const m = label?.match(/^([A-ZÄÖÜ][a-zäöüß]+)(, .+)?:$/);
  const autor = m ? getAutor(m[1].toLowerCase()) : undefined;
  if (!m || !autor) return null;
  // Langform bleibt wörtlich; bei der Kurzform werden Tier und Ort ergänzt.
  return { autor, label: m[2] ? label! : `${autor.name}, ${autor.tier} aus ${autor.ort}:` };
}

function FigurenAbsatz({ node, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & ExtraProps) {
  const figur = figurAusAbsatz(node as HastKnoten | undefined);
  if (!figur) return markdownComponents.p({ ...props, children });

  // Erstes Kind ist das fette Label, der Rest das Zitat.
  const [, ...zitat] = Array.isArray(children) ? children : [children];
  if (typeof zitat[0] === "string") zitat[0] = zitat[0].trimStart();

  return (
    <figure className="mt-8 rounded-2xl border border-stroke p-6">
      <figcaption className="flex items-center gap-4">
        <Image
          src={figur.autor.bild}
          alt={autorAltText(figur.autor)}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-lg bg-surface object-cover"
        />
        <span className="font-semibold text-text">{figur.label}</span>
      </figcaption>
      <blockquote className="mt-4 leading-relaxed text-text">{zitat}</blockquote>
    </figure>
  );
}

const komponentenMitFiguren = { ...markdownComponents, p: FigurenAbsatz };

/**
 * Gerenderter Markdown im Stil der Ratgeber-Artikel. Mit `figurenZitate` werden
 * Absätze, die mit dem Namen einer Team-Figur beginnen, als Zitatkasten gezeigt.
 */
export default function Markdown({
  children,
  figurenZitate = false,
}: {
  children: string;
  figurenZitate?: boolean;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={figurenZitate ? komponentenMitFiguren : markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
}
