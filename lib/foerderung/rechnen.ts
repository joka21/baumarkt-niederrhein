// Rechnung des Förderrechners: reine Funktionen ohne Oberfläche.
// Eingabe: Antworten und Datum (ISO "JJJJ-MM-TT"). Ausgabe: ein Ergebnisobjekt.
// Alle Zahlen kommen aus parameter.ts. Beträge werden auf ganze Euro abgerundet.

import { bereinigen, mitHeizung, mitHuelle, type Antworten } from "./fragen";
import {
  HEIZUNG,
  HUELLE,
  RECHENPARAMETER,
  STAND_DER_REGELN,
  STEUER,
  wertAm,
  type Zeitwert,
} from "./parameter";

export type Spanne = { von: number; bis: number };

export type HeizungsBlock = {
  stelle: "KfW";
  kosten: number;
  obergrenze: number;
  anrechenbar: number;
  gekappt: boolean;
  /** gedeckelter Fördersatz in Prozentpunkten */
  satz: Spanne;
  zuschuss: Spanne;
};

export type HuellenBlock = {
  stelle: "BAFA";
  kosten: number;
  mitIsfp: boolean;
  obergrenze: number;
  anrechenbar: number;
  gekappt: boolean;
  /** Grundsatz in Prozent */
  foerdersatz: number;
  /** iSFP-Bonus in Prozent und der Kostenanteil, auf den er gilt (0 ohne iSFP) */
  isfpBonus: number;
  bonusBasis: number;
  zuschuss: number;
};

export type Vergleich = "steuer" | "zuschuss" | "gleich" | "offen";

export type SteuerBlock = {
  block: "heizung" | "huelle";
  kosten: number;
  /** Steuerermäßigung insgesamt, nach Höchstbetrag */
  betrag: number;
  /** Verteilung auf das Jahr des Abschlusses und die zwei Folgejahre */
  jahre: [number, number, number];
  /** true, wenn der Höchstbetrag je Objekt den Betrag begrenzt hat */
  gekappt: boolean;
  /** Welcher Weg ist für diesen Block rechnerisch höher? "offen" bei Spanne mit Überlappung */
  hoeher: Vergleich;
};

export type Tipp =
  | { art: "isfp"; mehr: number; zuschussMitIsfp: number }
  | { art: "klimabonus"; mehr: number }
  | { art: "einkommen"; mehr: number };

export type Hinweise = {
  /** NRW.BANK-Eigentumsförderung Modernisierung */
  h1: boolean;
  /** NRW.BANK.Gebäudesanierung */
  h2: boolean;
  /** Solarpflicht NRW */
  h3: boolean;
  /** Kein Auftrag vor dem Antrag – immer */
  h4: true;
  /** Energieberatung und Baubegleitung, bei Hüllenmaßnahmen */
  nebenfoerderung: boolean;
};

export type Ergebnis =
  | { art: "abbruch"; grund: "neubau"; stand: string }
  | { art: "warnung"; stand: string }
  | {
      art: "ergebnis";
      datum: string;
      stand: string;
      summe: Spanne;
      heizung?: HeizungsBlock;
      huelle?: HuellenBlock;
      steuer?: { satz: number; hoechstbetrag: number; bloecke: SteuerBlock[] };
      tipps: Tipp[];
      hinweise: Hinweise;
    };

const HOECHSTENS_TIPPS = 2;

function pflicht<T>(werte: readonly Zeitwert<T>[], datum: string): T {
  const wert = wertAm(werte, datum);
  if (wert === undefined) throw new Error(`Kein Parameterwert für ${datum}`);
  return wert;
}

/** Gibt es für das Datum zu jedem Rechenparameter einen Wert? */
export function parameterGueltig(datum: string): boolean {
  return RECHENPARAMETER.every((werte) => wertAm(werte, datum) !== undefined);
}

/** Prozentsatz von Euro, auf ganze Euro abgerundet (ganzzahlig gerechnet). */
function anteil(euro: number, prozent: number): number {
  return Math.floor((euro * Math.round(prozent * 100)) / 10_000);
}

// ---------------------------------------------------------------------------
// Heizung

type HeizungsEingabe = {
  selbst: boolean;
  klimabonus: boolean;
  einkommensbonus: number;
};

function heizungsSatz(e: HeizungsEingabe, datum: string): number {
  const grund = pflicht(HEIZUNG.grundfoerderung, datum);
  if (!e.selbst) return grund;
  const klima = e.klimabonus ? pflicht(HEIZUNG.klimabonus, datum) : 0;
  const deckel = pflicht(HEIZUNG.deckel, datum);
  const grenze = e.einkommensbonus >= deckel.abEinkommensbonus ? deckel.hoch : deckel.regel;
  return Math.min(grund + klima + e.einkommensbonus, grenze);
}

function einkommensbonus(a: Antworten, datum: string): number[] {
  if (a.e1 !== "selbst") return [0];
  const stufen = pflicht(HEIZUNG.einkommensbonus, datum);
  if (a.e6 === "keineAngabe" || a.e6 === undefined) {
    return [0, Math.max(...stufen.map((s) => s.ohneKind), ...stufen.map((s) => s.mitKind))];
  }
  const stufe = stufen.find((s) => s.id === a.e6);
  if (!stufe) throw new Error(`Unbekannte Einkommensstufe ${a.e6}`);
  return [a.e7 ? stufe.mitKind : stufe.ohneKind];
}

function klimaOptionen(a: Antworten): boolean[] {
  if (a.e1 !== "selbst") return [false];
  if (a.e5 === "ja") return [true];
  if (a.e5 === "weissNicht") return [false, true];
  return [false];
}

function heizungsBlock(a: Antworten, datum: string): HeizungsBlock {
  const kosten = a.e4!;
  const obergrenze = pflicht(HEIZUNG.kostenobergrenze, datum);
  const anrechenbar = Math.min(kosten, obergrenze);
  const selbst = a.e1 === "selbst";
  const klima = klimaOptionen(a);
  const bonus = einkommensbonus(a, datum);

  const satzVon = heizungsSatz(
    { selbst, klimabonus: klima[0], einkommensbonus: Math.min(...bonus) },
    datum
  );
  const satzBis = heizungsSatz(
    { selbst, klimabonus: klima[klima.length - 1], einkommensbonus: Math.max(...bonus) },
    datum
  );

  return {
    stelle: "KfW",
    kosten,
    obergrenze,
    anrechenbar,
    gekappt: kosten > obergrenze,
    satz: { von: satzVon, bis: satzBis },
    zuschuss: { von: anteil(anrechenbar, satzVon), bis: anteil(anrechenbar, satzBis) },
  };
}

// ---------------------------------------------------------------------------
// Gebäudehülle

function huellenBlock(kosten: number, mitIsfp: boolean, datum: string): HuellenBlock {
  const satz = pflicht(HUELLE.foerdersatz, datum);
  const schwelle = pflicht(HUELLE.grenzeOhneIsfp, datum);
  const obergrenze = mitIsfp ? pflicht(HUELLE.grenzeMitIsfp, datum) : schwelle;
  const anrechenbar = Math.min(kosten, obergrenze);
  const isfpBonus = mitIsfp ? pflicht(HUELLE.isfpBonus, datum) : 0;
  const bonusBasis = mitIsfp ? Math.max(0, anrechenbar - schwelle) : 0;
  // gemeinsam abrunden: 15 % von K plus Bonus auf den Teil über der Schwelle
  const zuschuss = Math.floor(
    (anrechenbar * Math.round(satz * 100) + bonusBasis * Math.round(isfpBonus * 100)) / 10_000
  );
  return {
    stelle: "BAFA",
    kosten,
    mitIsfp,
    obergrenze,
    anrechenbar,
    gekappt: kosten > obergrenze,
    foerdersatz: satz,
    isfpBonus,
    bonusBasis,
    zuschuss,
  };
}

// ---------------------------------------------------------------------------
// Steuer

function vergleiche(zuschuss: Spanne, steuer: number): Vergleich {
  if (steuer > zuschuss.bis) return "steuer";
  if (zuschuss.von > steuer) return "zuschuss";
  if (zuschuss.von === steuer && zuschuss.bis === steuer) return "gleich";
  return "offen";
}

function steuerBloecke(
  posten: { block: "heizung" | "huelle"; kosten: number; zuschuss: Spanne }[],
  datum: string
) {
  const satz = pflicht(STEUER.satz, datum);
  const hoechstbetrag = pflicht(STEUER.hoechstbetrag, datum);
  const verteilung = pflicht(STEUER.verteilung, datum);
  const summeKosten = posten.reduce((s, p) => s + p.kosten, 0);
  const gesamt = anteil(summeKosten, satz);
  const gekappt = gesamt > hoechstbetrag;

  const bloecke: SteuerBlock[] = posten.map((p) => {
    // Über dem Höchstbetrag: im Verhältnis der Kosten aufteilen.
    const betrag = gekappt
      ? Math.floor((hoechstbetrag * p.kosten) / summeKosten)
      : anteil(p.kosten, satz);
    const jahre = verteilung.map((v) => Math.floor((betrag * v) / satz)) as [
      number,
      number,
      number,
    ];
    return {
      block: p.block,
      kosten: p.kosten,
      betrag,
      jahre,
      gekappt,
      hoeher: vergleiche(p.zuschuss, betrag),
    };
  });
  return { satz, hoechstbetrag, bloecke };
}

// ---------------------------------------------------------------------------
// Tipps

function tippsErmitteln(a: Antworten, datum: string, heizung?: HeizungsBlock): Tipp[] {
  const tipps: Tipp[] = [];

  // Fester Tipp: Sanierungsfahrplan, nur wenn er bei den Kosten mehr bringt.
  if (mitHuelle(a) && a.e9 === false && a.e8! > pflicht(HUELLE.grenzeOhneIsfp, datum)) {
    const ohne = huellenBlock(a.e8!, false, datum).zuschuss;
    const mit = huellenBlock(a.e8!, true, datum).zuschuss;
    if (mit > ohne) tipps.push({ art: "isfp", mehr: mit - ohne, zuschussMitIsfp: mit });
  }

  if (heizung && a.e1 === "selbst") {
    const bonus = einkommensbonus(a, datum);
    const klima = klimaOptionen(a);
    const z = (klimabonus: boolean, eb: number) =>
      anteil(heizung.anrechenbar, heizungsSatz({ selbst: true, klimabonus, einkommensbonus: eb }, datum));

    if (a.e5 === "weissNicht") {
      const eb = Math.min(...bonus);
      const mehr = z(true, eb) - z(false, eb);
      if (mehr > 0) tipps.push({ art: "klimabonus", mehr });
    }
    if (a.e6 === "keineAngabe") {
      const k = klima[klima.length - 1];
      const mehr = z(k, Math.max(...bonus)) - z(k, 0);
      if (mehr > 0) tipps.push({ art: "einkommen", mehr });
    }
  }

  return tipps.sort((x, y) => y.mehr - x.mehr).slice(0, HOECHSTENS_TIPPS);
}

// ---------------------------------------------------------------------------

/** Rechnet die Förderung für die Antworten am Datum (ISO "JJJJ-MM-TT"). */
export function rechnen(antworten: Antworten, datum: string): Ergebnis {
  const a = bereinigen(antworten);
  const stand = STAND_DER_REGELN;

  if (a.e2 === "unter5") return { art: "abbruch", grund: "neubau", stand };
  if (!parameterGueltig(datum)) return { art: "warnung", stand };

  const heizung = mitHeizung(a) ? heizungsBlock(a, datum) : undefined;
  const huelle = mitHuelle(a) ? huellenBlock(a.e8!, a.e9 === true, datum) : undefined;

  const summe: Spanne = {
    von: (heizung?.zuschuss.von ?? 0) + (huelle?.zuschuss ?? 0),
    bis: (heizung?.zuschuss.bis ?? 0) + (huelle?.zuschuss ?? 0),
  };

  // Die Antwort "älter als 10 Jahre" in E2 entspricht STEUER.mindestalterJahre.
  const steuerMoeglich = a.e1 === "selbst" && a.e2 === "ueber10";
  const posten = [
    ...(heizung ? [{ block: "heizung" as const, kosten: heizung.kosten, zuschuss: heizung.zuschuss }] : []),
    ...(huelle
      ? [{ block: "huelle" as const, kosten: huelle.kosten, zuschuss: { von: huelle.zuschuss, bis: huelle.zuschuss } }]
      : []),
  ];
  const steuer = steuerMoeglich && posten.length > 0 ? steuerBloecke(posten, datum) : undefined;

  const selbst = a.e1 === "selbst";
  return {
    art: "ergebnis",
    datum,
    stand,
    summe,
    heizung,
    huelle,
    steuer,
    tipps: tippsErmitteln(a, datum, heizung),
    hinweise: {
      h1: selbst,
      h2: selbst,
      h3: (a.e3?.includes("dach") ?? false) && a.e10 === true,
      h4: true,
      nebenfoerderung: mitHuelle(a),
    },
  };
}
