// Alle Förderzahlen des Förderrechners – nur hier, nirgends sonst im Code oder in Texten.
// Jeder Wert trägt seinen Gültigkeitszeitraum (ISO-Datum, beide Grenzen einschließlich).
// Fehlt "von", gilt der Wert laufend; fehlt "bis", gilt er ohne Ablaufdatum.
// Gibt es für ein Datum keinen Wert, zeigt der Rechner einen Warnhinweis statt eines Betrags.
// Quelle der Werte: Bauauftrag docs/BAUAUFTRAG-foerderrechner.md, Abschnitt 8.

export type Zeitwert<T> = { wert: T; von?: string; bis?: string };

/** Wert, der am Datum (ISO "JJJJ-MM-TT") gilt, sonst undefined. */
export function wertAm<T>(werte: readonly Zeitwert<T>[], datum: string): T | undefined {
  return werte.find((w) => (!w.von || w.von <= datum) && (!w.bis || datum <= w.bis))?.wert;
}

/** Stand der Förderregeln, erscheint im Pflichthinweis. */
export const STAND_DER_REGELN = "2026-11-19";

// ---------------------------------------------------------------------------
// Heizung (KfW 458)

export type EinkommensStufe = {
  id: "bis30" | "bis40" | "bis50" | "bis60" | "ueber60";
  /** Beschriftung der Antwort in Frage E6 */
  label: string;
  /** Einkommensbonus in Prozentpunkten ohne Kind unter 18 */
  ohneKind: number;
  /** Einkommensbonus in Prozentpunkten mit Kind unter 18 */
  mitKind: number;
};

export const HEIZUNG = {
  /** Kostenobergrenze erste Wohneinheit in Euro */
  kostenobergrenze: [
    { wert: 28_000, von: "2026-07-21", bis: "2027-01-31" },
    { wert: 27_250, von: "2027-02-01", bis: "2027-07-31" },
  ],
  /** Grundförderung in Prozentpunkten */
  grundfoerderung: [{ wert: 30, von: "2026-07-21" }],
  /** Klimageschwindigkeitsbonus in Prozentpunkten */
  klimabonus: [
    { wert: 16, von: "2026-07-21", bis: "2027-01-31" },
    { wert: 12, von: "2027-02-01", bis: "2027-07-31" },
  ],
  /** Einkommensbonus nach zu versteuerndem Haushaltseinkommen */
  einkommensbonus: [
    {
      von: "2026-07-21",
      wert: [
        { id: "bis30", label: "bis 30.000 €", ohneKind: 40, mitKind: 40 },
        { id: "bis40", label: "30.001 bis 40.000 €", ohneKind: 30, mitKind: 40 },
        { id: "bis50", label: "40.001 bis 50.000 €", ohneKind: 10, mitKind: 30 },
        { id: "bis60", label: "50.001 bis 60.000 €", ohneKind: 0, mitKind: 10 },
        { id: "ueber60", label: "über 60.000 €", ohneKind: 0, mitKind: 0 },
      ] as EinkommensStufe[],
    },
  ],
  /** Deckel der Summe der Sätze; bei Einkommensbonus in Höhe von "abEinkommensbonus" gilt "hoch" */
  deckel: [{ wert: { regel: 70, hoch: 80, abEinkommensbonus: 40 }, von: "2026-07-21" }],
} satisfies Record<string, Zeitwert<unknown>[]>;

// ---------------------------------------------------------------------------
// Gebäudehülle (BAFA)

export const HUELLE = {
  /** Fördersatz in Prozent */
  foerdersatz: [{ wert: 15 }],
  /** Kostenobergrenze in Euro ohne Sanierungsfahrplan */
  grenzeOhneIsfp: [{ wert: 30_000 }],
  /** Kostenobergrenze in Euro mit Sanierungsfahrplan */
  grenzeMitIsfp: [{ wert: 60_000 }],
  /** iSFP-Bonus in Prozent auf den Anteil der Kosten über "grenzeOhneIsfp" */
  isfpBonus: [{ wert: 5, von: "2026-07-21" }],
} satisfies Record<string, Zeitwert<unknown>[]>;

// ---------------------------------------------------------------------------
// Gebäude

export const GEBAEUDE = {
  /** Mindestalter in Jahren, ab dem die Bestandsförderung in der Regel greift (Frage E2) */
  mindestalterBestandJahre: [{ wert: 5 }],
} satisfies Record<string, Zeitwert<unknown>[]>;

// ---------------------------------------------------------------------------
// Steuerermäßigung (§ 35c EStG)

export const STEUER = {
  /** Satz in Prozent der Kosten */
  satz: [{ wert: 20 }],
  /** Höchstbetrag der Ermäßigung je Objekt in Euro, für alle Blöcke zusammen */
  hoechstbetrag: [{ wert: 40_000 }],
  /** Verteilung in Prozent der Kosten auf drei Jahre (Summe = Satz) */
  verteilung: [{ wert: [7, 7, 6] }],
  /** Mindestalter des Gebäudes in Jahren (Frage E2: "älter als …") */
  mindestalterJahre: [{ wert: 10 }],
} satisfies Record<string, Zeitwert<unknown>[]>;

// ---------------------------------------------------------------------------
// Hinweise ohne Betrag in der Summe

export const NEBENFOERDERUNG = {
  /** Energieberatung: Prozent des Honorars, höchstens Euro (Ein- und Zweifamilienhaus) */
  energieberatung: [{ wert: { satz: 50, hoechstens: 650 } }],
  /** Fachplanung und Baubegleitung: Prozent von höchstens "kostenHoechstens" Euro */
  baubegleitung: [{ wert: { satz: 50, kostenHoechstens: 5_000 } }],
} satisfies Record<string, Zeitwert<unknown>[]>;

export const NRW_BANK = {
  /** Eigentumsförderung Modernisierung, Förderjahr 2026 */
  eigentumsfoerderung: [
    {
      von: "2026-01-01",
      bis: "2026-12-31",
      wert: {
        darlehenHoechstens: 220_000,
        zinsAnfangProzent: 0,
        jahreZinsAnfang: 5,
        zinsDanachProzent: 0.5,
        erlassGruppeAProzent: 25,
        erlassMitZuschlaegenProzent: 50,
        beispielGruppeAFamilieEinKindBrutto: 57_000,
      },
    },
  ],
  /** NRW.BANK.Gebäudesanierung: Darlehen bis Euro */
  gebaeudesanierung: [{ wert: { darlehenHoechstens: 150_000 } }],
} satisfies Record<string, Zeitwert<unknown>[]>;

/** Chancenprüfer der NRW.BANK (Link in Hinweis H1, keine Förderzahl) */
export const NRW_BANK_CHANCENPRUEFER =
  "https://www.nrwbank.de/de/info-und-service/tools-und-rechner/chancenpruefer/";

export const SOLARPFLICHT = {
  /** NRW: Pflicht bei kompletter Erneuerung der Dachhaut */
  nrw: [{ wert: { abDatum: "2026-01-01", flaecheProzent: 30, pauschalKwp: 3 }, von: "2026-01-01" }],
} satisfies Record<string, Zeitwert<unknown>[]>;

// ---------------------------------------------------------------------------
// Richtwerte zum Antippen in den Kostenfeldern (Euro, keine Förderzahlen)

export const RICHTWERTE = {
  heizung: [20_000, 30_000, 40_000],
  huelle: [15_000, 35_000, 60_000],
} as const;

/** Parameter, aus denen Beträge berechnet werden. Fehlt einer am Datum: Warnhinweis. */
export const RECHENPARAMETER: readonly Zeitwert<unknown>[][] = [
  ...Object.values(GEBAEUDE),
  ...Object.values(HEIZUNG),
  ...Object.values(HUELLE),
  ...Object.values(STEUER),
];
