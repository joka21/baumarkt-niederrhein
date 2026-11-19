"use client";

import type { Ref } from "react";
import { euro } from "@/lib/foerderung/format";

type Props = {
  id: string;
  frage: string;
  /** Eingabe als Text, damit Tausenderpunkte beim Tippen stehen bleiben dürfen */
  text: string;
  onChange: (text: string) => void;
  richtwerte: readonly number[];
  hinweis: string;
  fehlerId?: string;
  ueberschriftRef?: Ref<HTMLHeadingElement>;
};

/** Ziffern aus der Eingabe lesen ("30.000 €" → 30000). Leer oder ohne Ziffern: undefined. */
export function betragAusText(text: string): number | undefined {
  const ziffern = text.replace(/\D/g, "");
  return ziffern ? Number(ziffern) : undefined;
}

/** Kostenfeld mit Zifferntastatur auf dem Handy und Richtwerten zum Antippen. */
export default function BetragFrage({
  id,
  frage,
  text,
  onChange,
  richtwerte,
  hinweis,
  fehlerId,
  ueberschriftRef,
}: Props) {
  const feldId = `${id}-feld`;
  const hinweisId = `${id}-hinweis`;
  const aktuell = betragAusText(text);

  return (
    <div>
      <h2 ref={ueberschriftRef} tabIndex={-1} className="text-h4 text-text outline-none">
        <label htmlFor={feldId}>{frage}</label>
      </h2>
      <p id={hinweisId} className="mt-2 text-body-sm text-text-muted-strong">
        {hinweis}
      </p>

      <div className="relative mt-5">
        <input
          id={feldId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={[hinweisId, fehlerId].filter(Boolean).join(" ")}
          aria-invalid={fehlerId ? true : undefined}
          className="w-full rounded-xl border border-text-muted-strong bg-surface py-3 pl-4 pr-12 text-h4 font-bold text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-h4 font-bold text-text"
        >
          €
        </span>
      </div>

      <p className="mt-5 text-body-sm text-text">Richtwerte zum Antippen:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {richtwerte.map((wert) => (
          <button
            key={wert}
            type="button"
            aria-pressed={aktuell === wert}
            onClick={() => onChange(new Intl.NumberFormat("de-DE").format(wert))}
            className="min-h-11 rounded-full border border-primary-strong px-4 py-2 text-button text-primary-strong transition-colors hover:bg-secondary aria-pressed:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
          >
            {euro(wert)}
          </button>
        ))}
      </div>
    </div>
  );
}
