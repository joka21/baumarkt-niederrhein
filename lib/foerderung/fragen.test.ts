import { describe, expect, it } from "vitest";
import { betragGueltig, gestellteFragen, vollstaendig } from "./fragen";

describe("Welche Fragen gestellt werden", () => {
  it("Vermietet: E5, E6 und E7 werden nicht gefragt", () => {
    const fragen = gestellteFragen({ e1: "vermietet", e2: "alt", e3: ["heizung"], e4: 20_000 });
    expect(fragen).toEqual(["e1", "e2", "e3", "e4"]);
  });

  it("Selbst bewohnt mit Heizung: E4 bis E6, E7 nur bei mittlerem Einkommen", () => {
    const basis = { e1: "selbst", e2: "alt", e3: ["heizung"] } as const;
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "bis40" })).toContain("e7");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "bis30" })).not.toContain("e7");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "ueber60" })).not.toContain("e7");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e6: "keineAngabe" })).not.toContain("e7");
  });

  it("Hülle: E8 und E9, E10 nur bei Dach", () => {
    expect(gestellteFragen({ e1: "selbst", e2: "alt", e3: ["fenster"] })).toEqual([
      "e1",
      "e2",
      "e3",
      "e8",
      "e9",
    ]);
    expect(gestellteFragen({ e1: "selbst", e2: "alt", e3: ["dach"] })).toContain("e10");
  });

  it("Gebäude unter fünf Jahren: nach E2 keine weitere Frage", () => {
    expect(gestellteFragen({ e1: "selbst", e2: "jung", e3: ["heizung"] })).toEqual(["e1", "e2"]);
  });

  it("E3 braucht mindestens eine Auswahl", () => {
    expect(vollstaendig({ e1: "selbst", e2: "alt", e3: [] })).toBe(false);
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

describe("Frage E5b (funktioniert die alte Heizung noch?)", () => {
  const basis = { e1: "selbst", e2: "alt", e3: ["heizung"] } as const;
  it("wird nur gefragt, wenn die Art der alten Heizung den Bonus zulässt", () => {
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e5: "fossil" })).toContain("e5b");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e5: "gasBiomasseAlt" })).toContain("e5b");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e5: "gasBiomasseJung" })).not.toContain("e5b");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e5: "andere" })).not.toContain("e5b");
    expect(gestellteFragen({ ...basis, e3: ["heizung"], e5: "weissNicht" })).not.toContain("e5b");
  });
  it("steht direkt nach E5", () => {
    const f = gestellteFragen({ ...basis, e3: ["heizung"], e5: "fossil", e6: "bis40" });
    expect(f.slice(f.indexOf("e5"), f.indexOf("e5") + 3)).toEqual(["e5", "e5b", "e6"]);
  });
  it("vermietet: weder E5 noch E5b", () => {
    const f = gestellteFragen({ e1: "vermietet", e2: "alt", e3: ["heizung"], e5: "fossil" });
    expect(f).not.toContain("e5");
    expect(f).not.toContain("e5b");
  });
});
