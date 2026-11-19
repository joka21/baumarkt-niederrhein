import { describe, expect, it } from "vitest";
import type { Antworten } from "./fragen";
import { rechnen, type Ergebnis } from "./rechnen";

const STAND = "2026-11-19";

/** Erwartet ein Ergebnis mit Beträgen und gibt es typisiert zurück. */
function ergebnis(a: Antworten, datum = STAND) {
  const e = rechnen(a, datum);
  if (e.art !== "ergebnis") throw new Error(`Erwartet Ergebnis, bekommen: ${e.art}`);
  return e;
}

// Klimabonus der Prüffälle als Antworten auf E5/E5b: ja = funktionierende Ölheizung,
// nein = andere Heizung, weiß nicht = E5 "weiß nicht".
const KLIMA: Record<"ja" | "nein" | "weissNicht", Pick<Antworten, "e5" | "e5b">> = {
  ja: { e5: "fossil", e5b: true },
  nein: { e5: "andere" },
  weissNicht: { e5: "weissNicht" },
};

// Heizung, selbst bewohnt. Gebäudealter 5 bis 10 Jahre, wenn der Prüffall keins nennt.
function heizung(
  kosten: number,
  klima: keyof typeof KLIMA,
  einkommen: Antworten["e6"],
  kind?: boolean,
  e2: Antworten["e2"] = "mittel"
): Antworten {
  return { e1: "selbst", e2, e3: ["heizung"], e4: kosten, ...KLIMA[klima], e6: einkommen, e7: kind };
}

function huelle(kosten: number, isfp: boolean, e2: Antworten["e2"] = "mittel"): Antworten {
  return { e1: "selbst", e2, e3: ["fassade"], e8: kosten, e9: isfp };
}

describe("Prüffälle aus Abschnitt 11", () => {
  it("P1: 80 % von 28.000 € = 22.400 €", () => {
    const e = ergebnis(heizung(32_000, "ja", "bis30", false));
    expect(e.heizung?.anrechenbar).toBe(28_000);
    expect(e.heizung?.gekappt).toBe(true);
    expect(e.heizung?.satz).toEqual({ von: 80, bis: 80 });
    expect(e.summe).toEqual({ von: 22_400, bis: 22_400 });
  });

  it("P2: 30 % von 28.000 € = 8.400 €", () => {
    const e = ergebnis(heizung(32_000, "nein", "ueber60"));
    expect(e.summe).toEqual({ von: 8_400, bis: 8_400 });
  });

  it("P3: 76 gedeckelt auf 70 = 14.000 €", () => {
    const e = ergebnis(heizung(20_000, "ja", "bis40", false));
    expect(e.heizung?.satz).toEqual({ von: 70, bis: 70 });
    expect(e.summe.bis).toBe(14_000);
  });

  it("P4: wie P3 mit Kind, 86 gedeckelt auf 80 = 16.000 €", () => {
    const e = ergebnis(heizung(20_000, "ja", "bis40", true));
    expect(e.heizung?.satz).toEqual({ von: 80, bis: 80 });
    expect(e.summe.bis).toBe(16_000);
  });

  it("P5: 56 = 11.200 €", () => {
    const e = ergebnis(heizung(20_000, "ja", "bis50", false));
    expect(e.heizung?.satz).toEqual({ von: 56, bis: 56 });
    expect(e.summe.bis).toBe(11_200);
  });

  it("P6: 70 = 14.000 €", () => {
    const e = ergebnis(heizung(20_000, "nein", "bis30"));
    expect(e.heizung?.satz).toEqual({ von: 70, bis: 70 });
    expect(e.summe.bis).toBe(14_000);
  });

  it("P7: vermietet, 30 % von 28.000 € = 8.400 €, kein Steuerweg", () => {
    const e = ergebnis({ e1: "vermietet", e2: "alt", e3: ["heizung"], e4: 32_000 });
    expect(e.summe).toEqual({ von: 8_400, bis: 8_400 });
    expect(e.steuer).toBeUndefined();
  });

  it("P8: Hülle 20.000 € mit iSFP = 3.000 €, kein iSFP-Tipp", () => {
    const e = ergebnis(huelle(20_000, true));
    expect(e.huelle?.zuschuss).toBe(3_000);
    expect(e.tipps.some((t) => t.art === "isfp")).toBe(false);
  });

  it("P9: Hülle 50.000 € mit iSFP: Zuschuss 8.500 €, Steuer 10.000 € höher", () => {
    const e = ergebnis(huelle(50_000, true, "alt"));
    expect(e.huelle?.zuschuss).toBe(8_500);
    const s = e.steuer?.bloecke.find((b) => b.block === "huelle");
    expect(s?.betrag).toBe(10_000);
    expect(s?.jahre).toEqual([3_500, 3_500, 3_000]);
    expect(s?.hoeher).toBe("steuer");
  });

  it("P10: Hülle 50.000 € ohne iSFP: 4.500 €, Tipp mit iSFP 8.500 €", () => {
    const e = ergebnis(huelle(50_000, false));
    expect(e.huelle?.zuschuss).toBe(4_500);
    expect(e.tipps).toContainEqual({ art: "isfp", mehr: 4_000, zuschussMitIsfp: 8_500 });
  });

  it("P11: Hülle 80.000 € mit iSFP: 10.500 € auf 60.000 €, Steuer 16.000 €", () => {
    const e = ergebnis(huelle(80_000, true, "alt"));
    expect(e.huelle?.anrechenbar).toBe(60_000);
    expect(e.huelle?.gekappt).toBe(true);
    expect(e.huelle?.zuschuss).toBe(10_500);
    const s = e.steuer?.bloecke[0];
    expect(s?.betrag).toBe(16_000);
    expect(s?.jahre).toEqual([5_600, 5_600, 4_800]);
  });

  it("P12: P1 plus Hülle 60.000 € mit iSFP = 32.900 €", () => {
    const e = ergebnis({
      ...heizung(32_000, "ja", "bis30", false),
      e3: ["heizung", "dach"],
      e8: 60_000,
      e9: true,
      e10: false,
    });
    expect(e.heizung?.zuschuss.bis).toBe(22_400);
    expect(e.huelle?.zuschuss).toBe(10_500);
    expect(e.summe).toEqual({ von: 32_900, bis: 32_900 });
  });

  it("P13: Heizung 45.000 €: Zuschuss 8.400 €, Steuer 9.000 € höher", () => {
    const e = ergebnis(heizung(45_000, "nein", "ueber60", undefined, "alt"));
    expect(e.summe.bis).toBe(8_400);
    const s = e.steuer?.bloecke[0];
    expect(s?.betrag).toBe(9_000);
    expect(s?.jahre).toEqual([3_150, 3_150, 2_700]);
    expect(s?.hoeher).toBe("steuer");
  });
});

describe("Zusätzliche Prüfungen", () => {
  it("Dach mit kompletter Neueindeckung: Hinweis H3", () => {
    const e = ergebnis({ e1: "selbst", e2: "alt", e3: ["dach"], e8: 30_000, e9: false, e10: true });
    expect(e.hinweise.h3).toBe(true);
    const ohne = ergebnis({ e1: "selbst", e2: "alt", e3: ["dach"], e8: 30_000, e9: false, e10: false });
    expect(ohne.hinweise.h3).toBe(false);
  });

  it("Gebäude unter fünf Jahren: keine Berechnung, nur der Hinweis", () => {
    const e: Ergebnis = rechnen({ e1: "selbst", e2: "jung", e3: ["heizung"], e4: 20_000 }, STAND);
    expect(e.art).toBe("abbruch");
  });

  it("P1 mit Einkommen keine Angabe: Spanne 12.880 € (46) bis 22.400 €", () => {
    const e = ergebnis(heizung(32_000, "ja", "keineAngabe"));
    expect(e.heizung?.satz).toEqual({ von: 46, bis: 80 });
    expect(e.summe).toEqual({ von: 12_880, bis: 22_400 });
  });

  it("P2 am 01.02.2027: 30 % von 27.250 € = 8.175 €", () => {
    const e = ergebnis(heizung(32_000, "nein", "ueber60"), "2027-02-01");
    expect(e.heizung?.anrechenbar).toBe(27_250);
    expect(e.summe.bis).toBe(8_175);
  });

  it("Am 01.08.2027: Warnhinweis statt Betrag", () => {
    expect(rechnen(heizung(32_000, "nein", "ueber60"), "2027-08-01").art).toBe("warnung");
    expect(rechnen(huelle(20_000, true), "2027-08-01").art).toBe("warnung");
  });

  it("Über 60.000 € mit Kind, Heizung 20.000 €, Klimabonus nein: 30 % = 6.000 €", () => {
    const e = ergebnis(heizung(20_000, "nein", "ueber60", true));
    expect(e.heizung?.satz).toEqual({ von: 30, bis: 30 });
    expect(e.summe.bis).toBe(6_000);
  });
});

describe("Weitere Regeln", () => {
  it("Klimabonus weiß nicht: Spanne ohne bis mit Bonus, Tipp zum Klimabonus", () => {
    const e = ergebnis(heizung(28_000, "weissNicht", "ueber60"));
    expect(e.heizung?.satz).toEqual({ von: 30, bis: 46 });
    expect(e.summe).toEqual({ von: 8_400, bis: 12_880 });
    expect(e.tipps).toContainEqual({ art: "klimabonus", mehr: 4_480 });
  });

  it("Höchstens zwei Tipps, die mit dem größten Betrag", () => {
    const e = ergebnis({
      ...heizung(28_000, "weissNicht", "keineAngabe"),
      e3: ["heizung", "fassade"],
      e8: 50_000,
      e9: false,
    });
    expect(e.tipps.map((t) => t.art)).toEqual(["einkommen", "klimabonus"]);
  });

  it("Heizung und Hülle: Zuschüsse addiert, Steuer je Block nie in der Summe", () => {
    const e = ergebnis({
      ...heizung(45_000, "nein", "ueber60", undefined, "alt"),
      e3: ["heizung", "fenster"],
      e8: 50_000,
      e9: true,
    });
    expect(e.summe.bis).toBe(8_400 + 8_500);
    expect(e.steuer?.bloecke.map((b) => b.betrag)).toEqual([9_000, 10_000]);
  });

  it("Steuer-Höchstbetrag 40.000 € je Objekt, im Verhältnis der Kosten aufgeteilt", () => {
    const e = ergebnis({
      ...heizung(100_000, "nein", "ueber60", undefined, "alt"),
      e3: ["heizung", "dach"],
      e8: 150_000,
      e9: true,
      e10: false,
    });
    const [h, d] = e.steuer!.bloecke;
    expect(h.betrag).toBe(16_000);
    expect(d.betrag).toBe(24_000);
    expect(h.betrag + d.betrag).toBe(40_000);
    expect(h.gekappt).toBe(true);
    expect(d.jahre).toEqual([8_400, 8_400, 7_200]);
  });

  it("Kein Steuerweg bei Gebäude 5 bis 10 Jahre", () => {
    expect(ergebnis(huelle(50_000, true, "mittel")).steuer).toBeUndefined();
  });

  it("Datum vor dem 21.07.2026: Warnhinweis", () => {
    expect(rechnen(huelle(20_000, true), "2026-07-20").art).toBe("warnung");
  });

  it("Antworten auf übersprungene Fragen zählen nicht", () => {
    // Erst selbst bewohnt mit Bonus, dann auf vermietet umgestellt.
    const e = ergebnis({ ...heizung(32_000, "ja", "bis30"), e1: "vermietet" });
    expect(e.summe.bis).toBe(8_400);
  });
});

describe("Angekündigte Änderungen ohne Datum: nur Hinweis, keine Rechnung", () => {
  it("Wärmepumpen-Hinweis, sobald eine Heizung gerechnet wurde", () => {
    expect(ergebnis(heizung(32_000, "ja", "bis30", false)).hinweise.waermepumpeAngekuendigt).toBe(true);
    expect(
      ergebnis({ e1: "vermietet", e2: "alt", e3: ["heizung"], e4: 20_000 }).hinweise
        .waermepumpeAngekuendigt
    ).toBe(true);
    expect(ergebnis(huelle(20_000, true)).hinweise.waermepumpeAngekuendigt).toBe(false);
  });

  it("Rechnung bleibt beim heutigen Satz (P1 weiter 22.400 €, P2 weiter 8.400 €)", () => {
    expect(ergebnis(heizung(32_000, "ja", "bis30", false)).summe.bis).toBe(22_400);
    expect(ergebnis(heizung(32_000, "nein", "ueber60")).summe.bis).toBe(8_400);
  });

  it("Dämmbonus-Hinweis nur bei Dämmung mit Sanierungsfahrplan", () => {
    const mit = (e3: Antworten["e3"], isfp: boolean) =>
      ergebnis({ e1: "selbst", e2: "alt", e3, e8: 40_000, e9: isfp, e10: false }).hinweise
        .daemmbonusAngekuendigt;
    expect(mit(["fassade"], true)).toBe(true);
    expect(mit(["dach"], true)).toBe(true);
    expect(mit(["decke"], true)).toBe(true);
    expect(mit(["fenster", "dach"], true)).toBe(true);
    expect(mit(["fenster"], true)).toBe(false);
    expect(mit(["fassade"], false)).toBe(false);
  });

  it("Dämmbonus ändert den Zuschuss nicht (P9 weiter 8.500 €)", () => {
    expect(ergebnis(huelle(50_000, true, "alt")).huelle?.zuschuss).toBe(8_500);
  });
});

describe("Klimabonus aus E5 (Art der alten Heizung) und E5b (funktioniert noch)", () => {
  // Heizung 28.000 €, Einkommen über 60.000 €: ohne Bonus 30 %, mit Bonus 46 %.
  const mit = (e5: Antworten["e5"], e5b?: boolean) =>
    ergebnis({ e1: "selbst", e2: "alt", e3: ["heizung"], e4: 28_000, e5, e5b, e6: "ueber60" })
      .heizung?.satz;

  it("Öl, Kohle, Gas-Etagenheizung oder Nachtspeicher, funktioniert: Bonus", () => {
    expect(mit("fossil", true)).toEqual({ von: 46, bis: 46 });
  });
  it("Gas, Holz oder Pellets, 20 Jahre oder älter, funktioniert: Bonus", () => {
    expect(mit("gasBiomasseAlt", true)).toEqual({ von: 46, bis: 46 });
  });
  it("Passende Art, aber funktioniert nicht mehr: kein Bonus", () => {
    expect(mit("fossil", false)).toEqual({ von: 30, bis: 30 });
    expect(mit("gasBiomasseAlt", false)).toEqual({ von: 30, bis: 30 });
  });
  it("Gas, Holz oder Pellets jünger als 20 Jahre oder andere Heizung: kein Bonus", () => {
    expect(mit("gasBiomasseJung")).toEqual({ von: 30, bis: 30 });
    expect(mit("andere")).toEqual({ von: 30, bis: 30 });
    // Eine alte Antwort auf E5b zählt nicht, wenn E5b nicht gefragt wird.
    expect(mit("gasBiomasseJung", true)).toEqual({ von: 30, bis: 30 });
  });
  it("Weiß nicht: Spanne ohne bis mit Bonus", () => {
    expect(mit("weissNicht")).toEqual({ von: 30, bis: 46 });
  });
});

describe("Hinweis H4 nach Block", () => {
  const h4 = (a: Antworten) => {
    const { h4Heizung, h4Huelle, h4NrwBank } = ergebnis(a).hinweise;
    return { h4Heizung, h4Huelle, h4NrwBank };
  };

  it("Nur Heizung, selbst bewohnt: Teil KfW und NRW.BANK", () => {
    expect(h4(heizung(20_000, "nein", "ueber60"))).toEqual({
      h4Heizung: true,
      h4Huelle: false,
      h4NrwBank: true,
    });
  });

  it("Nur Gebäudehülle, selbst bewohnt: Teil BAFA und NRW.BANK", () => {
    expect(h4(huelle(20_000, true))).toEqual({ h4Heizung: false, h4Huelle: true, h4NrwBank: true });
  });

  it("Heizung und Hülle, vermietet: Teil KfW und BAFA, kein NRW.BANK", () => {
    expect(
      h4({ e1: "vermietet", e2: "alt", e3: ["heizung", "fenster"], e4: 20_000, e8: 20_000, e9: false })
    ).toEqual({ h4Heizung: true, h4Huelle: true, h4NrwBank: false });
  });
});
