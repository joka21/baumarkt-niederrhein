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
import { euro, heuteIso, zahlwort } from "@/lib/foerderung/format";
import {
  GEBAEUDE,
  HEIZUNG,
  RICHTWERTE,
  STAND_DER_REGELN,
  STEUER,
  wertAm,
} from "@/lib/foerderung/parameter";
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

// Altersgrenzen der Frage E2 aus den Parametern (Stand der Regeln).
const BESTAND_JAHRE = wertAm(GEBAEUDE.mindestalterBestandJahre, STAND_DER_REGELN) ?? 0;
const STEUER_JAHRE = wertAm(STEUER.mindestalterJahre, STAND_DER_REGELN) ?? 0;

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
      { wert: "jung", label: `unter ${BESTAND_JAHRE} Jahre` },
      { wert: "mittel", label: `${BESTAND_JAHRE} bis ${STEUER_JAHRE} Jahre` },
      { wert: "alt", label: `älter als ${STEUER_JAHRE} Jahre` },
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

  const rahmen = useRef<HTMLDivElement>(null);
  const ueberschrift = useRef<HTMLHeadingElement>(null);
  const knoepfe = useRef<HTMLDivElement>(null);
  const ersterLauf = useRef(true);

  // Beim Wechsel der Frage (nicht beim Laden): Rechner direkt unter die Kopfzeile scrollen,
  // damit Frage, Antworten und Knöpfe auf dem Handy ohne weiteres Scrollen sichtbar sind,
  // und den Fokus auf die neue Überschrift setzen.
  useEffect(() => {
    if (ersterLauf.current) {
      ersterLauf.current = false;
      return;
    }
    rahmen.current?.scrollIntoView({ block: "start" });
    ueberschrift.current?.focus({ preventScroll: true });
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

  // Erste Frage: Über dem Rechner stehen Überschrift und Einleitung. Wird eine Antwort
  // angetippt und die Knöpfe sind nicht im Bild, Rechner unter die Kopfzeile scrollen –
  // bei "Bewegung reduzieren" ohne Animation.
  function knoepfeZeigen() {
    requestAnimationFrame(() => {
      const unten = knoepfe.current?.getBoundingClientRect().bottom;
      if (unten === undefined || unten <= window.innerHeight) return;
      const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rahmen.current?.scrollIntoView({ block: "start", behavior: ruhig ? "auto" : "smooth" });
    });
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
      <div ref={rahmen} className="mt-8 scroll-mt-20 rounded-2xl border border-stroke p-5 sm:p-8">
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
              Dein Gebäude ist jünger als {zahlwort(BESTAND_JAHRE)} Jahre. Die Bestandsförderung
              greift in der Regel erst ab {zahlwort(BESTAND_JAHRE)} Jahren.
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
        <div className="mt-8 flex justify-between gap-3">
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

  // Mindesthöhe passt bei 360 x 640 unter die feste Kopfzeile. Die Knöpfe stehen direkt unter
  // den Antworten: Bedienbarkeit auf dem Handy geht vor festem Platz für die Knöpfe.
  return (
    <div ref={rahmen} className="mt-8 scroll-mt-20">
    <form
      className="min-h-[35rem] rounded-2xl border border-stroke p-5 sm:p-8"
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
            onChange={(werte) => {
              aendern(ausAuswahl(frageId, werte));
              if (frageId === "e1") knoepfeZeigen();
            }}
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

      <p id="rechner-fehler" aria-live="polite" className="mt-3 min-h-6 font-bold text-text">
        {fehler}
      </p>

      <div ref={knoepfe} className="mt-3 flex justify-between gap-3">
        {index > 0 ? (
          <button type="button" onClick={zurueck} className={KNOPF_SEKUNDAER}>
            Zurück
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={KNOPF_PRIMAER}>
          {index === fragen.length - 1 && istBeantwortet(frageId, antworten)
            ? "Zum Ergebnis"
            : "Weiter"}
        </button>
      </div>
    </form>
    </div>
  );
}
