// Gemeinsame Klassen des Förderrechners – nur vorhandene Farben und Schriften des Projekts.

const FOKUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong";

export const KNOPF_PRIMAER = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-strong px-5 py-3.5 sm:px-7 text-button text-surface transition-opacity hover:opacity-90 ${FOKUS}`;

export const KNOPF_SEKUNDAER = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary-strong px-5 py-3.5 sm:px-7 text-button text-primary-strong transition-opacity hover:opacity-80 ${FOKUS}`;

export const TEXTLINK = `font-bold text-primary-strong underline underline-offset-2 transition-opacity hover:opacity-80 ${FOKUS}`;

export const AUSWAHLFLAECHE =
  "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-stroke bg-surface px-4 py-3 text-text transition-colors hover:border-primary-strong has-[:checked]:border-primary-strong has-[:checked]:bg-secondary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-strong";
