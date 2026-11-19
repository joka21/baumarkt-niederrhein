"use client";

import Link from "next/link";
import type { Ref } from "react";
import type { Antworten } from "@/lib/foerderung/fragen";
import { datum, euro, euroSpanne, prozent } from "@/lib/foerderung/format";
import {
  NEBENFOERDERUNG,
  NRW_BANK,
  NRW_BANK_CHANCENPRUEFER,
  SOLARPFLICHT,
  wertAm,
} from "@/lib/foerderung/parameter";
import type { Ergebnis as ErgebnisDaten, SteuerBlock, Tipp } from "@/lib/foerderung/rechnen";
import { TEXTLINK } from "./stil";

export type ZielSeite = { slug: string; titel: string; url: string };

type Daten = Extract<ErgebnisDaten, { art: "ergebnis" }>;

const ZAHLWORT: Record<number, string> = {
  2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs", 7: "sieben", 8: "acht", 9: "neun", 10: "zehn",
};

function zahlwort(n: number): string {
  return ZAHLWORT[n] ?? String(n);
}

function langesDatum(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T12:00:00`)
  );
}

/** Pflichthinweis, immer sichtbar und nicht einklappbar. */
export function Pflichthinweis({ stand }: { stand: string }) {
  return (
    <p className="mt-10 rounded-xl border border-stroke p-4 text-body-sm text-text">
      Unverbindliche Schätzung auf Basis deiner Angaben, Stand der Förderregeln: {datum(stand)}. Ob
      und wie viel Förderung du bekommst, entscheiden KfW, BAFA und Finanzamt. Es besteht kein
      Rechtsanspruch, die Mittel können ausgeschöpft sein. Der Rechner ersetzt keine Energie-,
      Steuer- oder Rechtsberatung.
    </p>
  );
}

function Markierung() {
  return (
    <span className="ml-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 align-middle text-body-sm text-text-on-secondary">
      rechnerisch höher
    </span>
  );
}

function Zeile({ name, wert }: { name: string; wert: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-stroke py-2 first:border-t-0">
      <dt className="text-text">{name}</dt>
      <dd className="font-bold text-text">{wert}</dd>
    </div>
  );
}

function steuerFuer(daten: Daten, block: SteuerBlock["block"]) {
  return daten.steuer?.bloecke.find((b) => b.block === block);
}

function Aufschluesselung({ daten }: { daten: Daten }) {
  const { heizung, huelle } = daten;
  return (
    <section aria-labelledby="aufschluesselung" className="mt-8">
      <h3 id="aufschluesselung" className="text-h5">
        So setzt sich das zusammen
      </h3>

      {heizung && (
        <div className="mt-4 rounded-xl border border-stroke p-4">
          <p className="font-bold text-text">
            Heizung · {heizung.stelle}
            {steuerFuer(daten, "heizung")?.hoeher === "zuschuss" && <Markierung />}
          </p>
          <dl className="mt-2">
            <Zeile name="Anrechenbare Kosten" wert={euro(heizung.anrechenbar)} />
            <Zeile
              name="Fördersatz"
              wert={
                heizung.satz.von === heizung.satz.bis
                  ? prozent(heizung.satz.bis)
                  : `${heizung.satz.von} bis ${prozent(heizung.satz.bis)}`
              }
            />
            <Zeile name="Zuschuss" wert={euroSpanne(heizung.zuschuss.von, heizung.zuschuss.bis)} />
          </dl>
          {heizung.gekappt && (
            <p className="mt-2 text-body-sm text-text-muted-strong">
              Von {euro(heizung.kosten)} zählen nur {euro(heizung.obergrenze)}, das ist die
              Kostenobergrenze.
            </p>
          )}
        </div>
      )}

      {huelle && (
        <div className="mt-4 rounded-xl border border-stroke p-4">
          <p className="font-bold text-text">
            Dämmung, Fenster und Türen · {huelle.stelle}
            {steuerFuer(daten, "huelle")?.hoeher === "zuschuss" && <Markierung />}
          </p>
          <dl className="mt-2">
            <Zeile name="Anrechenbare Kosten" wert={euro(huelle.anrechenbar)} />
            <Zeile
              name="Fördersatz"
              wert={
                huelle.bonusBasis > 0
                  ? `${prozent(huelle.foerdersatz)} + ${prozent(huelle.isfpBonus)} auf ${euro(huelle.bonusBasis)}`
                  : prozent(huelle.foerdersatz)
              }
            />
            <Zeile name="Zuschuss" wert={euro(huelle.zuschuss)} />
          </dl>
          {huelle.gekappt && (
            <p className="mt-2 text-body-sm text-text-muted-strong">
              Von {euro(huelle.kosten)} zählen nur {euro(huelle.obergrenze)}, das ist die
              Kostenobergrenze {huelle.mitIsfp ? "mit" : "ohne"} Sanierungsfahrplan.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

const BLOCKNAME: Record<SteuerBlock["block"], string> = {
  heizung: "Heizung",
  huelle: "Dämmung, Fenster und Türen",
};

function SteuerAlternative({ daten }: { daten: Daten }) {
  const steuer = daten.steuer;
  if (!steuer) return null;
  return (
    <section aria-labelledby="steuer" className="mt-8">
      <h3 id="steuer" className="text-h5">
        Alternative: Steuerermäßigung
      </h3>
      <p className="mt-2 text-text">
        Statt des Zuschusses kannst du {prozent(steuer.satz)} der Kosten über drei Jahre von deiner
        Steuerschuld abziehen (§ 35c EStG). Für dieselbe Maßnahme geht nur eins von beiden.
      </p>
      {steuer.bloecke.map((b) => (
        <div key={b.block} className="mt-4 rounded-xl border border-stroke p-4">
          <p className="font-bold text-text">
            {BLOCKNAME[b.block]}: {euro(b.betrag)}
            {b.hoeher === "steuer" && <Markierung />}
          </p>
          <p className="mt-1 text-body-sm text-text">
            {euro(b.jahre[0])} im Jahr des Abschlusses, {euro(b.jahre[1])} im Folgejahr,{" "}
            {euro(b.jahre[2])} im dritten Jahr.
          </p>
          {b.hoeher === "offen" && (
            <p className="mt-1 text-body-sm text-text-muted-strong">
              Ob das mehr ist als der Zuschuss, hängt von deinen offenen Antworten ab.
            </p>
          )}
          {b.gekappt && (
            <p className="mt-1 text-body-sm text-text-muted-strong">
              Begrenzt auf {euro(steuer.hoechstbetrag)} je Objekt, im Verhältnis der Kosten
              aufgeteilt.
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

function TippText({ tipp, isfpSeite }: { tipp: Tipp; isfpSeite?: ZielSeite }) {
  switch (tipp.art) {
    case "isfp":
      return (
        <>
          Mit einem Sanierungsfahrplan (iSFP) steigt dein Zuschuss für die Gebäudehülle auf{" "}
          {euro(tipp.zuschussMitIsfp)}, also {euro(tipp.mehr)} mehr.
          {isfpSeite && (
            <>
              {" "}
              <Link href={isfpSeite.url} className={TEXTLINK}>
                Mehr zum Sanierungsfahrplan
              </Link>
            </>
          )}
        </>
      );
    case "klimabonus":
      return (
        <>
          Prüf, ob deine alte Heizung den Klimageschwindigkeitsbonus auslöst: bis zu{" "}
          {euro(tipp.mehr)} mehr.
        </>
      );
    case "einkommen":
      return <>Mit Angabe deines Einkommens können bis zu {euro(tipp.mehr)} dazukommen.</>;
  }
}

function Hinweise({ daten }: { daten: Daten }) {
  const h = daten.hinweise;
  const eigentum = wertAm(NRW_BANK.eigentumsfoerderung, daten.datum);
  const sanierung = wertAm(NRW_BANK.gebaeudesanierung, daten.datum);
  const solar = wertAm(SOLARPFLICHT.nrw, daten.datum);
  const beratung = wertAm(NEBENFOERDERUNG.energieberatung, daten.datum);
  const begleitung = wertAm(NEBENFOERDERUNG.baubegleitung, daten.datum);

  const punkte: { key: string; inhalt: React.ReactNode }[] = [];

  if (h.h1) {
    const chancen = (
      <a href={NRW_BANK_CHANCENPRUEFER} className={TEXTLINK}>
        Chancenprüfer der NRW.BANK
      </a>
    );
    punkte.push({
      key: "h1",
      inhalt: eigentum ? (
        <>
          <strong>NRW.BANK-Eigentumsförderung Modernisierung:</strong> Darlehen bis{" "}
          {euro(eigentum.darlehenHoechstens)}, {prozent(eigentum.zinsAnfangProzent)} Zins in den
          ersten {zahlwort(eigentum.jahreZinsAnfang)} Jahren, danach{" "}
          {prozent(eigentum.zinsDanachProzent)}. In Einkommensgruppe A werden{" "}
          {prozent(eigentum.erlassGruppeAProzent)} erlassen, mit Zuschlägen bis{" "}
          {prozent(eigentum.erlassMitZuschlaegenProzent)}. Beispiel: Eine Familie mit einem Kind
          kann bis rund {euro(eigentum.beispielGruppeAFamilieEinKindBrutto)} brutto in Gruppe A
          fallen. Antrag bei Stadt oder Kreis, vor Beginn. {chancen}
        </>
      ) : (
        <>
          <strong>NRW.BANK-Eigentumsförderung Modernisierung:</strong> Landesdarlehen für Haushalte
          mit geringerem Einkommen. Die aktuellen Konditionen kennen wir noch nicht. Antrag bei
          Stadt oder Kreis, vor Beginn. {chancen}
        </>
      ),
    });
  }
  if (h.h2 && sanierung) {
    punkte.push({
      key: "h2",
      inhalt: (
        <>
          <strong>NRW.BANK.Gebäudesanierung:</strong> zinsgünstiges Darlehen bis{" "}
          {euro(sanierung.darlehenHoechstens)} über die Hausbank.
        </>
      ),
    });
  }
  if (h.h3 && solar) {
    punkte.push({
      key: "h3",
      inhalt: (
        <>
          <strong>Solarpflicht:</strong> Wer in NRW die Dachhaut komplett erneuert, muss seit{" "}
          {langesDatum(solar.abDatum)} eine Solaranlage einbauen. Verlangt sind{" "}
          {prozent(solar.flaecheProzent)} der geeigneten Dachfläche oder pauschal{" "}
          {String(solar.pauschalKwp).replace(".", ",")}&nbsp;kWp beim Ein- und
          Zweifamilienhaus. Es gibt Ausnahmen. Das ist keine Förderung, sondern zusätzliche
          Kosten.
        </>
      ),
    });
  }
  punkte.push({
    key: "h4",
    inhalt: (
      <>
        <strong>Kein fester Auftrag vor dem Antrag.</strong> Bei KfW und BAFA gehört in den Vertrag
        mit dem Handwerker ein Fördervorbehalt, der sich nicht nachträglich ergänzen lässt. Bei der
        NRW.BANK erst nach der Bewilligung beginnen.
      </>
    ),
  });
  if (h.nebenfoerderung && beratung && begleitung) {
    punkte.push({
      key: "neben",
      inhalt: (
        <>
          <strong>Zusätzlich möglich:</strong> Energieberatung mit {prozent(beratung.satz)} des
          Honorars, höchstens {euro(beratung.hoechstens)} beim Ein- und Zweifamilienhaus.
          Fachplanung und Baubegleitung mit {prozent(begleitung.satz)} von höchstens{" "}
          {euro(begleitung.kostenHoechstens)} Kosten, also bis{" "}
          {euro(Math.floor((begleitung.kostenHoechstens * begleitung.satz) / 100))}.
        </>
      ),
    });
  }

  return (
    <section aria-labelledby="hinweise" className="mt-8">
      <h3 id="hinweise" className="text-h5">
        Gut zu wissen
      </h3>
      <ul className="mt-3 space-y-3">
        {punkte.map((p) => (
          <li key={p.key} className="rounded-xl bg-secondary/40 p-4 text-text">
            {p.inhalt}
          </li>
        ))}
      </ul>
    </section>
  );
}

function NaechsteSchritte({ antworten, seiten }: { antworten: Antworten; seiten: ZielSeite[] }) {
  const m = antworten.e3 ?? [];
  const passend = seiten.filter((s) => {
    if (s.slug === "heizungsfoerderung-kfw-458") return m.includes("heizung");
    if (s.slug === "solarpflicht-nrw") return m.includes("dach");
    if (s.slug === "fenster-lueftung") return m.includes("fenster");
    return true;
  });
  return (
    <section aria-labelledby="schritte" className="mt-8">
      <h3 id="schritte" className="text-h5">
        Deine nächsten Schritte
      </h3>
      <ol className="mt-3 list-decimal space-y-1 pl-6 text-text">
        <li>Energieberater suchen</li>
        <li>Angebote mit Fördervorbehalt einholen</li>
        <li>Antrag stellen</li>
      </ol>
      {passend.length > 0 && (
        <>
          <p className="mt-4 text-text">Mehr dazu bei uns:</p>
          <ul className="mt-2 space-y-2">
            {passend.map((s) => (
              <li key={s.slug}>
                <Link href={s.url} className={TEXTLINK}>
                  {s.titel}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

type Props = {
  daten: Daten;
  antworten: Antworten;
  seiten: ZielSeite[];
  ueberschriftRef?: Ref<HTMLHeadingElement>;
};

export default function Ergebnis({ daten, antworten, seiten, ueberschriftRef }: Props) {
  const spanne = daten.summe.von !== daten.summe.bis;
  return (
    <div>
      <h2 ref={ueberschriftRef} tabIndex={-1} className="text-h3 text-text outline-none">
        Voraussichtlich {spanne ? "" : "bis zu "}
        <span className="text-primary-strong">{euroSpanne(daten.summe.von, daten.summe.bis)}</span>{" "}
        Zuschuss
      </h2>
      <p className="mt-3 text-body-sm text-text-muted-strong">
        Die Schätzung gilt für ein Ein- oder Zweifamilienhaus mit einer Wohneinheit.
      </p>

      <Aufschluesselung daten={daten} />
      <SteuerAlternative daten={daten} />

      {daten.tipps.length > 0 && (
        <section aria-labelledby="tipps" className="mt-8">
          <h3 id="tipps" className="text-h5">
            Was dein Ergebnis verbessert
          </h3>
          <ul className="mt-3 space-y-3">
            {daten.tipps.map((t) => (
              <li key={t.art} className="rounded-xl border border-primary-strong p-4 text-text">
                <TippText tipp={t} isfpSeite={seiten.find((s) => s.slug === "energieberatung-isfp")} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Hinweise daten={daten} />
      <NaechsteSchritte antworten={antworten} seiten={seiten} />

      <p className="mt-8 text-body-sm text-text-muted-strong">
        Du führst einen Betrieb am Niederrhein?{" "}
        <Link href="/fuer-anbieter" className={TEXTLINK}>
          Mehr für Betriebe
        </Link>
      </p>

      <Pflichthinweis stand={daten.stand} />
    </div>
  );
}
