"use client";

import { useEffect, useRef, useState } from "react";
import {
  BETRAG_MAX,
  BETRAG_MIN,
  bereinigen,
  gestellteFragen,
  istBeantwortet,
  type Antworten,
  type FrageId,
} from "@/lib/foerderung/fragen";
import { euro, heuteIso } from "@/lib/foerderung/format";
import { HEIZUNG, RICHTWERTE, STAND_DER_REGELN, wertAm } from "@/lib/foerderung/parameter";
import { rechnen, type Ergebnis as ErgebnisDaten } from "@/lib/foerderung/rechnen";
import AuswahlFrage, { type Option } from "./AuswahlFrage";
import BetragFrage, { betragAusText } from "./BetragFrage";
import Ergebnis, { Pflichthinweis, type ZielSeite } from "./Ergebnis";
import { KNOPF_PRIMAER, KNOPF_SEKUNDAER } from "./stil";

// Die Antworten bleiben nur im Arbeitsspeicher dieser Seite: keine Adresse, kein
// Browser-Speicher, kein Versand an Server, Matomo oder andere Dienste.

type Schritt = FrageId | "ergebnis";

const JA_NEIN: Option[] = [
  { wert: "ja", label: "ja" },
  { wert: "nein", label: "nein" },
];

const BETRAG_HINWEIS = `Ganze Euro, zwischen ${euro(BETRAG_MIN)} und ${euro(BETRAG_MAX)}.`;

/** Antwortmöglichkeiten der Einkommensfrage aus den Parametern (Stand der Regeln). */
function einkommensOptionen(): Option[] {
  const stufen = wertAm(HEIZUNG.einkommensbonus, STAND_DER_REGELN) ?? [];
  return [
    ...stufen.map((s) => ({ wert: s.id, label: s.label })),
    { wert: "keineAngabe", label: "keine Angabe" },
  ];
}

const AUSWAHL: Partial<
  Record<FrageId, { frage: string; optionen: Option[]; mehrfach?: boolean; hinweis?: string }>
> = {
  e1: {
    frage: "Wie nutzt du die Immobilie?",
    optionen: [
      { wert: "selbst", label: "selbst bewohnt" },
      { wert: "vermietet", label: "vermietet" },
    ],
  },
  e2: {
    frage: "Wie alt ist das Gebäude?",
    optionen: [
      { wert: "unter5", label: "unter 5 Jahre" },
      { wert: "5bis10", label: "5 bis 10 Jahre" },
      { wert: "ueber10", label: "älter als 10 Jahre" },
    ],
  },
  e3: {
    frage: "Was willst du machen?",
    hinweis: "Mehrfachauswahl möglich.",
    mehrfach: true,
    optionen: [
      { wert: "heizung", label: "Heizung" },
      { wert: "dach", label: "Dach" },
      { wert: "fassade", label: "Fassade" },
      { wert: "decke", label: "Kellerdecke oder oberste Geschossdecke" },
      { wert: "fenster", label: "Fenster und Türen" },
    ],
  },
  e5: {
    frage:
      "Ersetzt du eine funktionierende Öl-, Kohle-, Gasetagen- oder Nachtspeicherheizung oder eine mindestens 20 Jahre alte Gasheizung?",
    optionen: [
      { wert: "ja", label: "ja" },
      { wert: "nein", label: "nein" },
      { wert: "weissNicht", label: "weiß nicht" },
    ],
  },
  e6: {
    frage: "Wie hoch ist das zu versteuernde Haushaltseinkommen im Jahr?",
    optionen: einkommensOptionen(),
  },
  e7: { frage: "Lebt ein Kind unter 18 im Haushalt?", optionen: JA_NEIN },
  e9: {
    frage: "Hast du einen Sanierungsfahrplan (iSFP) oder lässt du einen erstellen?",
    optionen: JA_NEIN,
  },
  e10: { frage: "Wird das Dach komplett neu eingedeckt?", optionen: JA_NEIN },
};

const BETRAG: Partial<Record<FrageId, { frage: string; richtwerte: readonly number[] }>> = {
  e4: { frage: "Was kostet die neue Heizung ungefähr?", richtwerte: RICHTWERTE.heizung },
  e8: {
    frage: "Was kosten Dämmung, Fenster und Türen zusammen ungefähr?",
    richtwerte: RICHTWERTE.huelle,
  },
};

/** Antwortwert als Liste von Strings für die Auswahlflächen. */
function alsAuswahl(id: FrageId, a: Antworten): string[] {
  const wert = a[id];
  if (wert === undefined) return [];
  if (Array.isArray(wert)) return wert;
  if (typeof wert === "boolean") return [wert ? "ja" : "nein"];
  return [String(wert)];
}

/** Auswahl zurück in den Antworttyp. */
function ausAuswahl(id: FrageId, werte: string[]): Partial<Antworten> {
  if (id === "e3") return { e3: werte as Antworten["e3"] };
  if (id === "e7" || id === "e9" || id === "e10") return { [id]: werte[0] === "ja" };
  return { [id]: werte[0] };
}

function fehlerText(id: FrageId): string {
  if (id === "e3") return "Wähl mindestens eine Maßnahme aus.";
  if (id === "e4" || id === "e8") return `Gib einen Betrag zwischen ${euro(BETRAG_MIN)} und ${euro(BETRAG_MAX)} ein.`;
  return "Wähl eine Antwort aus.";
}

export default function Foerderrechner({ seiten }: { seiten: ZielSeite[] }) {
  const [antworten, setAntworten] = useState<Antworten>({});
  const [betragText, setBetragText] = useState<{ e4: string; e8: string }>({ e4: "", e8: "" });
  const [schritt, setSchritt] = useState<Schritt>("e1");
  const [ergebnis, setErgebnis] = useState<ErgebnisDaten | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const ueberschrift = useRef<HTMLHeadingElement>(null);
  const ersterLauf = useRef(true);

  // Beim Wechsel der Frage den Fokus auf die neue Überschrift setzen (nicht beim Laden).
  useEffect(() => {
    if (ersterLauf.current) {
      ersterLauf.current = false;
      return;
    }
    ueberschrift.current?.focus();
  }, [schritt]);

  const fragen = gestellteFragen(antworten);
  const index = schritt === "ergebnis" ? fragen.length : fragen.indexOf(schritt);

  function gehe(ziel: Schritt) {
    setFehler(null);
    setSchritt(ziel);
  }

  function aendern(teil: Partial<Antworten>) {
    setFehler(null);
    setAntworten((a) => ({ ...a, ...teil }));
  }

  function weiter() {
    if (schritt === "ergebnis") return;
    if (!istBeantwortet(schritt, antworten)) {
      setFehler(fehlerText(schritt));
      return;
    }
    const naechste = fragen[fragen.indexOf(schritt) + 1];
    if (naechste) return gehe(naechste);
    // Datum erst jetzt im Browser ermitteln – die Seite selbst ist statisch erzeugt.
    setErgebnis(rechnen(antworten, heuteIso()));
    gehe("ergebnis");
  }

  function zurueck() {
    if (schritt === "ergebnis") return gehe(fragen[fragen.length - 1]);
    const vorige = fragen[fragen.indexOf(schritt) - 1];
    if (vorige) gehe(vorige);
  }

  function neuRechnen() {
    setAntworten({});
    setBetragText({ e4: "", e8: "" });
    setErgebnis(null);
    gehe("e1");
  }

  const fehlerId = fehler ? "rechner-fehler" : undefined;

  if (schritt === "ergebnis" && ergebnis) {
    return (
      <div className="mt-8 rounded-2xl border border-stroke p-5 sm:p-8">
        {ergebnis.art === "ergebnis" && (
          <Ergebnis
            daten={ergebnis}
            antworten={bereinigen(antworten)}
            seiten={seiten}
            ueberschriftRef={ueberschrift}
          />
        )}
        {ergebnis.art === "abbruch" && (
          <div>
            <h2 ref={ueberschrift} tabIndex={-1} className="text-h4 text-text outline-none">
              Für dein Gebäude rechnen wir nicht weiter
            </h2>
            <p className="mt-3 text-text">
              Dein Gebäude ist jünger als fünf Jahre. Die Bestandsförderung greift in der Regel erst
              ab fünf Jahren.
            </p>
            <Pflichthinweis stand={ergebnis.stand} />
          </div>
        )}
        {ergebnis.art === "warnung" && (
          <div>
            <h2 ref={ueberschrift} tabIndex={-1} className="text-h4 text-text outline-none">
              Unsere Förderregeln sind nicht mehr aktuell
            </h2>
            <p className="mt-3 text-text">
              Für das heutige Datum haben wir keine gültigen Förderwerte. Deshalb zeigen wir dir
              keinen Betrag, statt dir einen falschen zu nennen. Wir aktualisieren den Rechner,
              sobald die neuen Regeln feststehen.
            </p>
            <Pflichthinweis stand={ergebnis.stand} />
          </div>
        )}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={zurueck} className={KNOPF_SEKUNDAER}>
            Zurück
          </button>
          <button type="button" onClick={neuRechnen} className={KNOPF_PRIMAER}>
            Neu rechnen
          </button>
        </div>
      </div>
    );
  }

  const frageId = schritt as FrageId;
  const auswahl = AUSWAHL[frageId];
  const betrag = BETRAG[frageId];

  return (
    <form
      className="mt-8 flex min-h-[50rem] flex-col rounded-2xl border border-stroke p-5 sm:min-h-[45rem] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        weiter();
      }}
      noValidate
    >
      <div>
        <p className="text-body-sm text-text-muted-strong">
          Frage {index + 1} von {fragen.length}
        </p>
        <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-stroke">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((index + 1) / fragen.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6">
        {auswahl && (
          <AuswahlFrage
            key={frageId}
            id={frageId}
            frage={auswahl.frage}
            hinweis={auswahl.hinweis}
            optionen={auswahl.optionen}
            mehrfach={auswahl.mehrfach}
            ausgewaehlt={alsAuswahl(frageId, antworten)}
            onChange={(werte) => aendern(ausAuswahl(frageId, werte))}
            fehlerId={fehlerId}
            ueberschriftRef={ueberschrift}
          />
        )}
        {betrag && (frageId === "e4" || frageId === "e8") && (
          <BetragFrage
            key={frageId}
            id={frageId}
            frage={betrag.frage}
            text={betragText[frageId]}
            onChange={(text) => {
              setBetragText((t) => ({ ...t, [frageId]: text }));
              aendern({ [frageId]: betragAusText(text) });
            }}
            richtwerte={betrag.richtwerte}
            hinweis={BETRAG_HINWEIS}
            fehlerId={fehlerId}
            ueberschriftRef={ueberschrift}
          />
        )}
      </div>

      <p id="rechner-fehler" aria-live="polite" className="mt-4 min-h-6 font-bold text-text">
        {fehler}
      </p>

      <div className="mt-auto flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-between">
        {index > 0 ? (
          <button type="button" onClick={zurueck} className={KNOPF_SEKUNDAER}>
            Zurück
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}
        <button type="submit" className={KNOPF_PRIMAER}>
          {index === fragen.length - 1 && istBeantwortet(frageId, antworten)
            ? "Ergebnis anzeigen"
            : "Weiter"}
        </button>
      </div>
    </form>
  );
}
