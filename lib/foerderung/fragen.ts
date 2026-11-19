// Fragen des Förderrechners und die Regeln, wann welche Frage gestellt wird.
// Reine Logik ohne Oberfläche.

export type Nutzung = "selbst" | "vermietet";
/** Gebäudealter: jung = unter GEBAEUDE.mindestalterBestandJahre, alt = über
 *  STEUER.mindestalterJahre, mittel = dazwischen (Grenzen in parameter.ts). */
export type Alter = "jung" | "mittel" | "alt";
export type Massnahme = "heizung" | "dach" | "fassade" | "decke" | "fenster";
export type JaNeinWeissNicht = "ja" | "nein" | "weissNicht";
export type Einkommen = "bis30" | "bis40" | "bis50" | "bis60" | "ueber60" | "keineAngabe";

export type Antworten = {
  e1?: Nutzung;
  e2?: Alter;
  e3?: Massnahme[];
  e4?: number;
  e5?: JaNeinWeissNicht;
  e6?: Einkommen;
  e7?: boolean;
  e8?: number;
  e9?: boolean;
  e10?: boolean;
};

export type FrageId = keyof Antworten;

export const REIHENFOLGE: FrageId[] = ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "e10"];

export const HUELLEN_MASSNAHMEN: Massnahme[] = ["dach", "fassade", "decke", "fenster"];

/** Kostenfelder: ganze Eurobeträge in diesem Bereich. */
export const BETRAG_MIN = 300;
export const BETRAG_MAX = 500_000;

export function betragGueltig(wert: unknown): wert is number {
  return typeof wert === "number" && Number.isInteger(wert) && wert >= BETRAG_MIN && wert <= BETRAG_MAX;
}

export function mitHeizung(a: Antworten): boolean {
  return a.e3?.includes("heizung") ?? false;
}

export function mitHuelle(a: Antworten): boolean {
  return a.e3?.some((m) => HUELLEN_MASSNAHMEN.includes(m)) ?? false;
}

/** Wird die Frage bei diesen Antworten gestellt? */
export function wirdGefragt(id: FrageId, a: Antworten): boolean {
  // Gebäude jünger als das Mindestalter der Bestandsförderung: Berechnung endet nach E2.
  if (a.e2 === "jung" && id !== "e1" && id !== "e2") return false;

  const selbst = a.e1 === "selbst";
  switch (id) {
    case "e1":
    case "e2":
    case "e3":
      return true;
    case "e4":
      return mitHeizung(a);
    case "e5":
    case "e6":
      return mitHeizung(a) && selbst;
    case "e7":
      // Nur, wenn ein Kind den Bonus ändern kann.
      return (
        mitHeizung(a) && selbst && (a.e6 === "bis40" || a.e6 === "bis50" || a.e6 === "bis60")
      );
    case "e8":
    case "e9":
      return mitHuelle(a);
    case "e10":
      return a.e3?.includes("dach") ?? false;
  }
}

/** Die gestellten Fragen in Reihenfolge. */
export function gestellteFragen(a: Antworten): FrageId[] {
  return REIHENFOLGE.filter((id) => wirdGefragt(id, a));
}

/** Ist die Frage gültig beantwortet? */
export function istBeantwortet(id: FrageId, a: Antworten): boolean {
  const wert = a[id];
  switch (id) {
    case "e3":
      return Array.isArray(wert) && wert.length > 0;
    case "e4":
    case "e8":
      return betragGueltig(wert);
    default:
      return wert !== undefined;
  }
}

/** Nur die Antworten auf gestellte Fragen. Antworten auf übersprungene Fragen bleiben im
 *  Formular erhalten (Zurück ohne Verlust), zählen aber nicht für die Rechnung. */
export function bereinigen(a: Antworten): Antworten {
  const ergebnis: Antworten = {};
  for (const id of gestellteFragen(a)) {
    if (a[id] !== undefined) Object.assign(ergebnis, { [id]: a[id] });
  }
  return ergebnis;
}

/** Sind alle gestellten Fragen beantwortet? */
export function vollstaendig(a: Antworten): boolean {
  return gestellteFragen(a).every((id) => istBeantwortet(id, a));
}
