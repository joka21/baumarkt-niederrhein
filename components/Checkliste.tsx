"use client";

import { useSyncExternalStore } from "react";
import type { ChecklistenGruppe } from "@/lib/altbau";

// Abgehakte Punkte pro Besucher im localStorage. Jeder Zugriff ist abgesichert:
// Ohne Speicher (privater Modus, gesperrt) bleibt der Status nur im Arbeitsspeicher.
const SCHLUESSEL = "altbau-checkliste";
const LEER = "[]";

let ersatz = LEER;
let speicherNutzbar = true;
const zuhoerer = new Set<() => void>();

function lesen(): string {
  if (!speicherNutzbar) return ersatz;
  try {
    return window.localStorage.getItem(SCHLUESSEL) ?? LEER;
  } catch {
    speicherNutzbar = false;
    return ersatz;
  }
}

function schreiben(wert: string) {
  ersatz = wert;
  try {
    window.localStorage.setItem(SCHLUESSEL, wert);
  } catch {
    speicherNutzbar = false;
  }
  zuhoerer.forEach((z) => z());
}

function abonnieren(z: () => void) {
  zuhoerer.add(z);
  // Änderungen aus anderen Tabs übernehmen
  const beiSpeicher = (e: StorageEvent) => {
    if (e.key === SCHLUESSEL) z();
  };
  window.addEventListener("storage", beiSpeicher);
  return () => {
    zuhoerer.delete(z);
    window.removeEventListener("storage", beiSpeicher);
  };
}

function auswerten(wert: string): Set<string> {
  try {
    const liste: unknown = JSON.parse(wert);
    return new Set(Array.isArray(liste) ? liste.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

export default function Checkliste({ gruppen }: { gruppen: ChecklistenGruppe[] }) {
  const roh = useSyncExternalStore(abonnieren, lesen, () => LEER);
  const geprueft = auswerten(roh);
  const gesamt = gruppen.reduce((n, g) => n + g.punkte.length, 0);
  const anzahl = gruppen.reduce(
    (n, g) => n + g.punkte.filter((p) => geprueft.has(p.nummer)).length,
    0
  );

  function umschalten(nummer: string) {
    const neu = new Set(geprueft);
    if (neu.has(nummer)) neu.delete(nummer);
    else neu.add(nummer);
    schreiben(JSON.stringify([...neu].sort()));
  }

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stroke p-4">
        <p className="font-semibold text-text" aria-live="polite">
          {anzahl} von {gesamt} geprüft
        </p>
        <button
          type="button"
          onClick={() => schreiben(LEER)}
          disabled={anzahl === 0}
          className="rounded-full border border-primary-strong px-5 py-2.5 text-button text-primary-strong transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          Zurücksetzen
        </button>
      </div>

      {gruppen.map((gruppe) => (
        <section key={gruppe.titel} aria-labelledby={`gruppe-${gruppe.punkte[0].nummer}`}>
          <h2
            id={`gruppe-${gruppe.punkte[0].nummer}`}
            className="mt-10 text-xl text-text sm:text-2xl"
          >
            {gruppe.titel}
          </h2>
          <ul className="mt-4 space-y-2">
            {gruppe.punkte.map((punkt) => {
              const id = `punkt-${punkt.nummer}`;
              return (
                <li key={punkt.nummer} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={id}
                    checked={geprueft.has(punkt.nummer)}
                    onChange={() => umschalten(punkt.nummer)}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong"
                  />
                  <label htmlFor={id} className="cursor-pointer leading-relaxed text-text">
                    {punkt.nummer} {punkt.text}
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
