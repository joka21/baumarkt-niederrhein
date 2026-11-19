"use client";

import type { Ref } from "react";
import { AUSWAHLFLAECHE } from "./stil";

export type Option = { wert: string; label: string };

type Props = {
  id: string;
  frage: string;
  hinweis?: string;
  optionen: Option[];
  /** Mehrfachauswahl (Checkboxen) statt Einfachauswahl (Radio-Knöpfe) */
  mehrfach?: boolean;
  ausgewaehlt: string[];
  onChange: (werte: string[]) => void;
  fehlerId?: string;
  ueberschriftRef?: Ref<HTMLHeadingElement>;
};

/** Eine Frage mit großen Antwortflächen. Echte Radio-Knöpfe bzw. Checkboxen für
 *  Tastatur und Screenreader. */
export default function AuswahlFrage({
  id,
  frage,
  hinweis,
  optionen,
  mehrfach = false,
  ausgewaehlt,
  onChange,
  fehlerId,
  ueberschriftRef,
}: Props) {
  const hinweisId = hinweis ? `${id}-hinweis` : undefined;

  function umschalten(wert: string, an: boolean) {
    if (!mehrfach) return onChange([wert]);
    onChange(an ? [...ausgewaehlt, wert] : ausgewaehlt.filter((w) => w !== wert));
  }

  return (
    <fieldset aria-describedby={[hinweisId, fehlerId].filter(Boolean).join(" ") || undefined}>
      <legend className="w-full">
        <h2 ref={ueberschriftRef} tabIndex={-1} className="text-h4 text-text outline-none">
          {frage}
        </h2>
      </legend>
      {hinweis && (
        <p id={hinweisId} className="mt-2 text-body-sm text-text-muted-strong">
          {hinweis}
        </p>
      )}
      <div className="mt-5 grid gap-3">
        {optionen.map((o) => (
          <label key={o.wert} className={AUSWAHLFLAECHE}>
            <input
              type={mehrfach ? "checkbox" : "radio"}
              name={id}
              value={o.wert}
              checked={ausgewaehlt.includes(o.wert)}
              onChange={(e) => umschalten(o.wert, e.target.checked)}
              className="h-5 w-5 shrink-0 accent-primary-strong"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
