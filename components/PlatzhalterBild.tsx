// Einheitliche Platzhalter-Bildfläche: farbige Fläche in Gewerk-Farbe mit
// zentrierter weißer Initiale. Füllt den umgebenden Container (Größe/Aspekt
// steuert das Elternelement). Wird von Karten und der Detailgalerie genutzt.

type PlatzhalterBildProps = {
  color: string;
  initial: string;
  className?: string;
  letterClassName?: string;
};

export default function PlatzhalterBild({
  color,
  initial,
  className = "",
  letterClassName = "text-5xl",
}: PlatzhalterBildProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <span className={`font-bold text-white/90 ${letterClassName}`}>
        {initial}
      </span>
    </div>
  );
}
