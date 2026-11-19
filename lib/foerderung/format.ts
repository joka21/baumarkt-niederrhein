// Darstellung von Beträgen und Daten im Förderrechner.

const ZAHL = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0, useGrouping: true });

/** Ganze Euro mit Tausenderpunkt, immer abgerundet, geschütztes Leerzeichen vor dem €. */
export function euro(betrag: number): string {
  return `${ZAHL.format(Math.floor(betrag))} €`;
}

/** Spanne "Y bis X €", bei gleichen Werten nur "X €". */
export function euroSpanne(von: number, bis: number): string {
  return von === bis ? euro(bis) : `${ZAHL.format(Math.floor(von))} bis ${euro(bis)}`;
}

/** Prozent mit Komma als Dezimaltrennzeichen, z. B. "0,5 %". */
export function prozent(wert: number): string {
  return `${String(wert).replace(".", ",")} %`;
}

/** ISO-Datum "JJJJ-MM-TT" als "TT.MM.JJJJ". */
export function datum(iso: string): string {
  const [j, m, t] = iso.split("-");
  return `${t}.${m}.${j}`;
}

/** Heutiges Datum in der Zeitzone des Geräts als ISO "JJJJ-MM-TT". */
export function heuteIso(jetzt = new Date()): string {
  const m = String(jetzt.getMonth() + 1).padStart(2, "0");
  const t = String(jetzt.getDate()).padStart(2, "0");
  return `${jetzt.getFullYear()}-${m}-${t}`;
}
