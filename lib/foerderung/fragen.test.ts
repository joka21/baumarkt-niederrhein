import { describe, expect, it } from "vitest";
import { betragGueltig, gestellteFragen, vollstaendig } from "./fragen";

describe("Welche Fragen gestellt werden", () => {
  it("Vermietet: E5, E6 und E7 werden nicht gefragt", () => {
    const fragen = gestellteFragen({ e1: "vermietet", e2: "ueber10", e3: ["heizung"], e4: 20_000 });
    expect(fragen).toEqual(["e1", "e2", "e3", "e4"]);
  });

  it("Selbst bewohnt mit Heizung: E4 bis E6, E7 nur bei mittlerem Einkommen", () => {
    const basis = { e1: "selbst", e2: "ueber10", e3: ["heizung"] } as const;
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "bis40" })).toContain("e7");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "bis30" })).not.toContain("e7");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "ueber60" })).not.toContain("e7");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "keineAngabe" })).not.toContain("e7");
  });

  it("Hülle: E8 und E9, E10 nur bei Dach", () => {
    expect(gestellteFragen({ e1: "selbst", e2: "ueber10", e3: ["fenster"] })).toEqual([
      "e1",
      "e2",
      "e3",
      "e8",
      "e9",
    ]);
    expect(gestellteFragen({ e1: "selbst", e2: "ueber10", e3: ["dach"] })).toContain("e10");
  });

  it("Gebäude unter fünf Jahren: nach E2 keine weitere Frage", () => {
    expect(gestellteFragen({ e1: "selbst", e2: "unter5", e3: ["heizung"] })).toEqual(["e1", "e2"]);
  });

  it("E3 braucht mindestens eine Auswahl", () => {
    expect(vollstaendig({ e1: "selbst", e2: "ueber10", e3: [] })).toBe(false);
  });
});

describe("Kostenfelder", () => {
  it("nehmen ganze Eurobeträge von 300 bis 500.000 an", () => {
    expect(betragGueltig(300)).toBe(true);
    expect(betragGueltig(500_000)).toBe(true);
    expect(betragGueltig(299)).toBe(false);
    expect(betragGueltig(500_001)).toBe(false);
    expect(betragGueltig(1_000.5)).toBe(false);
  });
});
