import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KONTAKT_EMAIL } from "@/lib/kontakt";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von Baumarkt Niederrhein.",
  alternates: { canonical: "/datenschutz" },
};

// Quelle: Datenschutz-Generator.de (Dr. Thomas Schwenke), Stand 2. Oktober 2026.
// Übernommen wurden nur die Abschnitte, die auf diese Website zutreffen.
// OFFEN: Konkrete Angaben zu Vercel (Hosting) und Supabase (Datenbank) fehlen
// noch und sollten über den Generator ergänzt werden.

const LINK = "text-primary underline underline-offset-2 hover:opacity-80";

function Liste({ punkte }: { punkte: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1 pl-6">
      {punkte.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

function Angaben({ eintraege }: { eintraege: [string, string][] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-6">
      {eintraege.map(([titel, text]) => (
        <li key={titel}>
          <strong className="font-bold">{titel}:</strong> {text}
        </li>
      ))}
    </ul>
  );
}

const NUTZUNGSDATEN =
  "Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen)";
const METADATEN =
  "Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen)";
const KONTAKTDATEN = "Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern)";
const INHALTSDATEN =
  "Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung)";
const LOESCHUNG =
  "Löschung entsprechend Angaben im Abschnitt „Allgemeine Informationen zur Datenspeicherung und Löschung“.";

const abschnitte: { id: string; titel: string; inhalt: React.ReactNode }[] = [
  {
    id: "verantwortlicher",
    titel: "Verantwortlicher",
    inhalt: (
      <>
        <p className="mt-3">
          Josef Kalenberg
          <br />
          Am Königshof 47
          <br />
          47807 Krefeld
        </p>
        <p className="mt-3">Vertretungsberechtigte Personen: Josef Kalenberg</p>
        <p className="mt-3">
          E-Mail-Adresse:{" "}
          <a href={`mailto:${KONTAKT_EMAIL}`} className={LINK}>
            {KONTAKT_EMAIL}
          </a>
        </p>
        <p className="mt-3">
          Impressum:{" "}
          <Link href="/impressum" className={LINK}>
            www.baumarkt-niederrhein.de/impressum
          </Link>
        </p>
      </>
    ),
  },
  {
    id: "uebersicht",
    titel: "Übersicht der Verarbeitungen",
    inhalt: (
      <>
        <p className="mt-3">
          Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer
          Verarbeitung zusammen und verweist auf die betroffenen Personen.
        </p>
        <h3 className="mt-6 text-h5">Arten der verarbeiteten Daten</h3>
        <Liste
          punkte={[
            "Bestandsdaten.",
            "Kontaktdaten.",
            "Inhaltsdaten.",
            "Nutzungsdaten.",
            "Meta-, Kommunikations- und Verfahrensdaten.",
            "Protokolldaten.",
          ]}
        />
        <h3 className="mt-6 text-h5">Kategorien betroffener Personen</h3>
        <Liste punkte={["Interessenten.", "Kommunikationspartner.", "Nutzer."]} />
        <h3 className="mt-6 text-h5">Zwecke der Verarbeitung</h3>
        <Liste
          punkte={[
            "Kommunikation.",
            "Sicherheitsmaßnahmen.",
            "Organisations- und Verwaltungsverfahren.",
            "Feedback.",
            "Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.",
            "Informationstechnische Infrastruktur.",
          ]}
        />
      </>
    ),
  },
  {
    id: "rechtsgrundlagen",
    titel: "Maßgebliche Rechtsgrundlagen",
    inhalt: (
      <>
        <p className="mt-3">
          <strong className="font-bold">Maßgebliche Rechtsgrundlagen nach der DSGVO:</strong> Im
          Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir
          personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den
          Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder
          Sitzland gelten können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen
          maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.
        </p>
        <Angaben
          eintraege={[
            [
              "Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO)",
              "Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.",
            ],
            [
              "Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO)",
              "Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.",
            ],
            [
              "Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO)",
              "Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.",
            ],
            [
              "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)",
              "die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten notwendig, vorausgesetzt, dass die Interessen, Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten verlangen, nicht überwiegen.",
            ],
          ]}
        />
        <p className="mt-4">
          <strong className="font-bold">Nationale Datenschutzregelungen in Deutschland:</strong>{" "}
          Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum
          Datenschutz in Deutschland. Hierzu gehört insbesondere das Bundesdatenschutzgesetz
          (BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht
          auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien
          personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie
          automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling. Ferner
          können Landesdatenschutzgesetze der einzelnen Bundesländer zur Anwendung gelangen.
        </p>
        <p className="mt-4">
          <strong className="font-bold">Hinweis auf Geltung DSGVO und Schweizer DSG:</strong> Diese
          Datenschutzhinweise dienen sowohl der Informationserteilung nach dem Schweizer DSG als
          auch nach der Datenschutzgrundverordnung (DSGVO). Aus diesem Grund bitten wir Sie zu
          beachten, dass aufgrund der breiteren räumlichen Anwendung und Verständlichkeit die
          Begriffe der DSGVO verwendet werden. Insbesondere statt der im Schweizer DSG verwendeten
          Begriffe „Bearbeitung“ von „Personendaten“, „überwiegendes Interesse“ und „besonders
          schützenswerte Personendaten“ werden die in der DSGVO verwendeten Begriffe „Verarbeitung“
          von „personenbezogenen Daten“ sowie „berechtigtes Interesse“ und „besondere Kategorien
          von Daten“ verwendet. Die gesetzliche Bedeutung der Begriffe wird jedoch im Rahmen der
          Geltung des Schweizer DSG weiterhin nach dem Schweizer DSG bestimmt.
        </p>
        <p className="mt-4">
          <strong className="font-bold">Geltung der Datenschutzvorgaben im Sitzland:</strong> In dem
          Land, in dem der Verantwortliche seinen Sitz hat, gelten neben der
          Datenschutz-Grundverordnung (DSGVO) auch nationale Datenschutzvorschriften.
        </p>
      </>
    ),
  },
  {
    id: "sicherheit",
    titel: "Sicherheitsmaßnahmen",
    inhalt: (
      <>
        <p className="mt-3">
          Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der
          Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke
          der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des
          Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische
          und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu
          gewährleisten.
        </p>
        <p className="mt-4">
          Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und
          Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den
          Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung
          der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die
          eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die
          Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz
          personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software
          sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und
          durch datenschutzfreundliche Voreinstellungen.
        </p>
        <p className="mt-4">
          <strong className="font-bold">
            Sicherung von Online-Verbindungen durch TLS-/SSL-Verschlüsselungstechnologie (HTTPS):
          </strong>{" "}
          Um die Daten der Nutzer, die über unsere Online-Dienste übertragen werden, vor
          unerlaubten Zugriffen zu schützen, setzen wir auf die TLS-/SSL-Verschlüsselungstechnologie.
          Secure Sockets Layer (SSL) und Transport Layer Security (TLS) sind die Eckpfeiler der
          sicheren Datenübertragung im Internet. Diese Technologien verschlüsseln die Informationen,
          die zwischen der Website oder App und dem Browser des Nutzers (oder zwischen zwei Servern)
          übertragen werden, wodurch die Daten vor unbefugtem Zugriff geschützt sind. TLS, als die
          weiterentwickelte und sicherere Version von SSL, gewährleistet, dass alle
          Datenübertragungen den höchsten Sicherheitsstandards entsprechen. Wenn eine Website durch
          ein SSL-/TLS-Zertifikat gesichert ist, wird dies durch die Anzeige von HTTPS in der URL
          signalisiert. Dies dient als ein Indikator für die Nutzer, dass ihre Daten sicher und
          verschlüsselt übertragen werden.
        </p>
      </>
    ),
  },
  {
    id: "uebermittlung",
    titel: "Übermittlung von personenbezogenen Daten",
    inhalt: (
      <p className="mt-3">
        Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass diese an
        andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen
        übermittelt beziehungsweise ihnen gegenüber offengelegt werden. Zu den Empfängern dieser
        Daten können z. B. mit IT-Aufgaben beauftragte Dienstleister gehören oder Anbieter von
        Diensten und Inhalten, die in eine Website eingebunden sind. In solchen Fällen beachten wir
        die gesetzlichen Vorgaben und schließen insbesondere entsprechende Verträge bzw.
        Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.
      </p>
    ),
  },
  {
    id: "drittlaender",
    titel: "Internationale Datentransfers",
    inhalt: (
      <>
        <p className="mt-3">
          <strong className="font-bold">Datenverarbeitung in Drittländern:</strong> Sofern wir Daten
          in ein Drittland (d. h. außerhalb der Europäischen Union (EU) oder des Europäischen
          Wirtschaftsraums (EWR)) übermitteln oder dies im Rahmen der Nutzung von Diensten Dritter
          oder der Offenlegung bzw. Übermittlung von Daten an andere Personen, Stellen oder
          Unternehmen geschieht (was erkennbar wird anhand der Postadresse des jeweiligen Anbieters
          oder wenn in der Datenschutzerklärung ausdrücklich auf den Datentransfer in Drittländer
          hingewiesen wird), erfolgt dies stets im Einklang mit den gesetzlichen Vorgaben.
        </p>
        <p className="mt-4">
          Für Datenübermittlungen in die USA stützen wir uns vorrangig auf das Data Privacy
          Framework (DPF), welches durch einen Angemessenheitsbeschluss der EU-Kommission vom
          10.07.2023 als sicherer Rechtsrahmen anerkannt wurde. Zusätzlich haben wir mit den
          jeweiligen Anbietern Standardvertragsklauseln abgeschlossen, die den Vorgaben der
          EU-Kommission entsprechen und vertragliche Verpflichtungen zum Schutz Ihrer Daten
          festlegen.
        </p>
        <p className="mt-4">
          Diese zweifache Absicherung gewährleistet einen umfassenden Schutz Ihrer Daten: Das DPF
          bildet die primäre Schutzebene, während die Standardvertragsklauseln als zusätzliche
          Sicherheit dienen. Sollten sich Änderungen im Rahmen des DPF ergeben, greifen die
          Standardvertragsklauseln als zuverlässige Rückfalloption ein. So stellen wir sicher, dass
          Ihre Daten auch bei etwaigen politischen oder rechtlichen Veränderungen stets angemessen
          geschützt bleiben.
        </p>
        <p className="mt-4">
          Bei den einzelnen Diensteanbietern informieren wir Sie darüber, ob sie nach dem DPF
          zertifiziert sind und ob Standardvertragsklauseln vorliegen. Weitere Informationen zum DPF
          und eine Liste der zertifizierten Unternehmen finden Sie auf der Website des
          US-Handelsministeriums unter{" "}
          <a href="https://www.dataprivacyframework.gov/" className={LINK}>
            https://www.dataprivacyframework.gov/
          </a>{" "}
          (in englischer Sprache).
        </p>
        <p className="mt-4">
          Für Datenübermittlungen in andere Drittländer gelten entsprechende Sicherheitsmaßnahmen,
          insbesondere Standardvertragsklauseln, ausdrückliche Einwilligungen oder gesetzlich
          erforderliche Übermittlungen. Informationen zu Drittlandtransfers und geltenden
          Angemessenheitsbeschlüssen können Sie dem Informationsangebot der EU-Kommission
          entnehmen:{" "}
          <a
            href="https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de"
            className={`${LINK} break-all`}
          >
            https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection_en?prefLang=de
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "speicherung",
    titel: "Allgemeine Informationen zur Datenspeicherung und Löschung",
    inhalt: (
      <>
        <p className="mt-3">
          Wir löschen personenbezogene Daten, die wir verarbeiten, gemäß den gesetzlichen
          Bestimmungen, sobald die zugrundeliegenden Einwilligungen widerrufen werden oder keine
          weiteren rechtlichen Grundlagen für die Verarbeitung bestehen. Dies betrifft Fälle, in
          denen der ursprüngliche Verarbeitungszweck entfällt oder die Daten nicht mehr benötigt
          werden. Ausnahmen von dieser Regelung bestehen, wenn gesetzliche Pflichten oder besondere
          Interessen eine längere Aufbewahrung oder Archivierung der Daten erfordern.
        </p>
        <p className="mt-4">
          Insbesondere müssen Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt
          werden müssen oder deren Speicherung notwendig ist zur Rechtsverfolgung oder zum Schutz
          der Rechte anderer natürlicher oder juristischer Personen, entsprechend archiviert werden.
        </p>
        <p className="mt-4">
          Unsere Datenschutzhinweise enthalten zusätzliche Informationen zur Aufbewahrung und
          Löschung von Daten, die speziell für bestimmte Verarbeitungsprozesse gelten.
        </p>
        <p className="mt-4">
          Bei mehreren Angaben zur Aufbewahrungsdauer oder Löschungsfristen eines Datums, ist stets
          die längste Frist maßgeblich. Daten, die nicht mehr für den ursprünglich vorgesehenen
          Zweck, sondern aufgrund gesetzlicher Vorgaben oder anderer Gründe aufbewahrt werden,
          verarbeiten wir ausschließlich zu den Gründen, die ihre Aufbewahrung rechtfertigen.
        </p>
        <p className="mt-4">
          <strong className="font-bold">Fristbeginn mit Ablauf des Jahres:</strong> Beginnt eine
          Frist nicht ausdrücklich zu einem bestimmten Datum und beträgt sie mindestens ein Jahr, so
          startet sie automatisch am Ende des Kalenderjahres, in dem das fristauslösende Ereignis
          eingetreten ist. Im Fall laufender Vertragsverhältnisse, in deren Rahmen Daten gespeichert
          werden, ist das fristauslösende Ereignis der Zeitpunkt des Wirksamwerdens der Kündigung
          oder sonstige Beendigung des Rechtsverhältnisses.
        </p>
      </>
    ),
  },
  {
    id: "rechte",
    titel: "Rechte der betroffenen Personen",
    inhalt: (
      <>
        <p className="mt-3">
          <strong className="font-bold">Rechte der betroffenen Personen aus der DSGVO:</strong>{" "}
          Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere
          aus Art. 15 bis 21 DSGVO ergeben:
        </p>
        <Angaben
          eintraege={[
            [
              "Widerspruchsrecht",
              "Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Werden die Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.",
            ],
            [
              "Widerrufsrecht bei Einwilligungen",
              "Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.",
            ],
            [
              "Auskunftsrecht",
              "Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.",
            ],
            [
              "Recht auf Berichtigung",
              "Sie haben entsprechend den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.",
            ],
            [
              "Recht auf Löschung und Einschränkung der Verarbeitung",
              "Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu verlangen, dass Sie betreffende Daten unverzüglich gelöscht werden, bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.",
            ],
            [
              "Recht auf Datenübertragbarkeit",
              "Sie haben das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.",
            ],
            [
              "Beschwerde bei Aufsichtsbehörde",
              "Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs haben Sie das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt. Die Beschwerde kann insbesondere bei einer Aufsichtsbehörde in dem Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes eingelegt werden.",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "hosting",
    titel: "Bereitstellung des Onlineangebots und Webhosting",
    inhalt: (
      <>
        <p className="mt-3">
          Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen
          zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist,
          um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der
          Nutzer zu übermitteln.
        </p>
        <Angaben
          eintraege={[
            [
              "Verarbeitete Datenarten",
              `${NUTZUNGSDATEN}; ${METADATEN}. Protokolldaten (z. B. Logfiles betreffend Logins oder den Abruf von Daten oder Zugriffszeiten.).`,
            ],
            ["Betroffene Personen", "Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten)."],
            [
              "Zwecke der Verarbeitung und berechtigte Interessen",
              "Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Informationstechnische Infrastruktur (Betrieb und Bereitstellung von Informationssystemen und technischen Geräten (Computer, Server etc.)). Sicherheitsmaßnahmen.",
            ],
            ["Aufbewahrung und Löschung", LOESCHUNG],
            ["Rechtsgrundlagen", "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)."],
          ]}
        />
        <p className="mt-4 font-bold">Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</p>
        <Angaben
          eintraege={[
            [
              "Bereitstellung Onlineangebot auf gemietetem Speicherplatz",
              "Für die Bereitstellung unseres Onlineangebotes nutzen wir Speicherplatz, Rechenkapazität und Software, die wir von einem entsprechenden Serveranbieter (auch „Webhoster“ genannt) mieten oder anderweitig beziehen; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).",
            ],
            [
              "Erhebung von Zugriffsdaten und Logfiles",
              "Der Zugriff auf unser Onlineangebot wird in Form von sogenannten „Server-Logfiles“ protokolliert. Zu den Serverlogfiles können die Adresse und der Name der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende Provider gehören. Die Serverlogfiles können zum einen zu Sicherheitszwecken eingesetzt werden, z. B. um eine Überlastung der Server zu vermeiden (insbesondere im Fall von missbräuchlichen Angriffen, sogenannten DDoS-Attacken), und zum anderen, um die Auslastung der Server und ihre Stabilität sicherzustellen; Rechtsgrundlagen: Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Löschung von Daten: Logfile-Informationen werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert. Daten, deren weitere Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen Vorfalls von der Löschung ausgenommen.",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "blog",
    titel: "Blogs und Publikationsmedien",
    inhalt: (
      <>
        <p className="mt-3">
          Wir nutzen Blogs oder vergleichbare Mittel der Onlinekommunikation und Publikation
          (nachfolgend „Publikationsmedium“). Die Daten der Leser werden für die Zwecke des
          Publikationsmediums nur insoweit verarbeitet, als es für dessen Darstellung und die
          Kommunikation zwischen Autoren und Lesern oder aus Gründen der Sicherheit erforderlich
          ist. Im Übrigen verweisen wir auf die Informationen zur Verarbeitung der Besucher unseres
          Publikationsmediums im Rahmen dieser Datenschutzhinweise.
        </p>
        <Angaben
          eintraege={[
            [
              "Verarbeitete Datenarten",
              `Bestandsdaten (z. B. der vollständige Name, Wohnadresse, Kontaktinformationen, Kundennummer, etc.); ${KONTAKTDATEN}; ${INHALTSDATEN}; ${NUTZUNGSDATEN}. ${METADATEN}.`,
            ],
            ["Betroffene Personen", "Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten)."],
            [
              "Zwecke der Verarbeitung und berechtigte Interessen",
              "Feedback (z. B. Sammeln von Feedback via Online-Formular); Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Sicherheitsmaßnahmen. Organisations- und Verwaltungsverfahren.",
            ],
            ["Aufbewahrung und Löschung", LOESCHUNG],
            ["Rechtsgrundlagen", "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO)."],
          ]}
        />
      </>
    ),
  },
  {
    id: "kontakt",
    titel: "Kontakt- und Anfrageverwaltung",
    inhalt: (
      <>
        <p className="mt-3">
          Bei der Kontaktaufnahme mit uns (z. B. per Post, Kontaktformular, E-Mail, Telefon oder via
          soziale Medien) sowie im Rahmen bestehender Nutzer- und Geschäftsbeziehungen werden die
          Angaben der anfragenden Personen verarbeitet, soweit dies zur Beantwortung der
          Kontaktanfragen und etwaiger angefragter Maßnahmen erforderlich ist.
        </p>
        <Angaben
          eintraege={[
            ["Verarbeitete Datenarten", `${KONTAKTDATEN}; ${INHALTSDATEN}. ${METADATEN}.`],
            ["Betroffene Personen", "Kommunikationspartner."],
            [
              "Zwecke der Verarbeitung und berechtigte Interessen",
              "Kommunikation; Organisations- und Verwaltungsverfahren; Feedback (z. B. Sammeln von Feedback via Online-Formular). Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.",
            ],
            ["Aufbewahrung und Löschung", LOESCHUNG],
            [
              "Rechtsgrundlagen",
              "Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).",
            ],
          ]}
        />
        <p className="mt-4 font-bold">Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</p>
        <Angaben
          eintraege={[
            [
              "Kontaktformular",
              "Bei Kontaktaufnahme über unser Kontaktformular, per E-Mail oder anderen Kommunikationswegen, verarbeiten wir die uns übermittelten personenbezogenen Daten zur Beantwortung und Bearbeitung des jeweiligen Anliegens. Dies umfasst in der Regel Angaben wie Name, Kontaktinformationen und gegebenenfalls weitere Informationen, die uns mitgeteilt werden und zur angemessenen Bearbeitung erforderlich sind. Wir nutzen diese Daten ausschließlich für den angegebenen Zweck der Kontaktaufnahme und Kommunikation; Rechtsgrundlagen: Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO), Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).",
            ],
          ]}
        />
      </>
    ),
  },
  {
    id: "aenderung",
    titel: "Änderung und Aktualisierung",
    inhalt: (
      <>
        <p className="mt-3">
          Wir bitten Sie, sich regelmäßig über den Inhalt unserer Datenschutzerklärung zu
          informieren. Wir passen die Datenschutzerklärung an, sobald die Änderungen der von uns
          durchgeführten Datenverarbeitungen dies erforderlich machen. Wir informieren Sie, sobald
          durch die Änderungen eine Mitwirkungshandlung Ihrerseits (z. B. Einwilligung) oder eine
          sonstige individuelle Benachrichtigung erforderlich wird.
        </p>
        <p className="mt-4">
          Sofern wir in dieser Datenschutzerklärung Adressen und Kontaktinformationen von
          Unternehmen und Organisationen angeben, bitten wir zu beachten, dass die Adressen sich über
          die Zeit ändern können und bitten die Angaben vor Kontaktaufnahme zu prüfen.
        </p>
      </>
    ),
  },
  {
    id: "begriffe",
    titel: "Begriffsdefinitionen",
    inhalt: (
      <>
        <p className="mt-3">
          In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser Datenschutzerklärung
          verwendeten Begrifflichkeiten. Soweit die Begrifflichkeiten gesetzlich definiert sind,
          gelten deren gesetzliche Definitionen. Die nachfolgenden Erläuterungen sollen dagegen vor
          allem dem Verständnis dienen.
        </p>
        <Angaben
          eintraege={[
            [
              "Bestandsdaten",
              "Bestandsdaten umfassen wesentliche Informationen, die für die Identifikation und Verwaltung von Vertragspartnern, Benutzerkonten, Profilen und ähnlichen Zuordnungen notwendig sind. Diese Daten können u.a. persönliche und demografische Angaben wie Namen, Kontaktinformationen (Adressen, Telefonnummern, E-Mail-Adressen), Geburtsdaten und spezifische Identifikatoren (Benutzer-IDs) beinhalten. Bestandsdaten bilden die Grundlage für jegliche formelle Interaktion zwischen Personen und Diensten, Einrichtungen oder Systemen, indem sie eine eindeutige Zuordnung und Kommunikation ermöglichen.",
            ],
            [
              "Inhaltsdaten",
              "Inhaltsdaten umfassen Informationen, die im Zuge der Erstellung, Bearbeitung und Veröffentlichung von Inhalten aller Art generiert werden. Diese Kategorie von Daten kann Texte, Bilder, Videos, Audiodateien und andere multimediale Inhalte einschließen, die auf verschiedenen Plattformen und Medien veröffentlicht werden. Inhaltsdaten sind nicht nur auf den eigentlichen Inhalt beschränkt, sondern beinhalten auch Metadaten, die Informationen über den Inhalt selbst liefern, wie Tags, Beschreibungen, Autoreninformationen und Veröffentlichungsdaten",
            ],
            [
              "Kontaktdaten",
              "Kontaktdaten sind essentielle Informationen, die die Kommunikation mit Personen oder Organisationen ermöglichen. Sie umfassen u.a. Telefonnummern, postalische Adressen und E-Mail-Adressen, sowie Kommunikationsmittel wie soziale Medien-Handles und Instant-Messaging-Identifikatoren.",
            ],
            [
              "Meta-, Kommunikations- und Verfahrensdaten",
              "Meta-, Kommunikations- und Verfahrensdaten sind Kategorien, die Informationen über die Art und Weise enthalten, wie Daten verarbeitet, übermittelt und verwaltet werden. Meta-Daten, auch bekannt als Daten über Daten, umfassen Informationen, die den Kontext, die Herkunft und die Struktur anderer Daten beschreiben. Sie können Angaben zur Dateigröße, dem Erstellungsdatum, dem Autor eines Dokuments und den Änderungshistorien beinhalten. Kommunikationsdaten erfassen den Austausch von Informationen zwischen Nutzern über verschiedene Kanäle, wie E-Mail-Verkehr, Anrufprotokolle, Nachrichten in sozialen Netzwerken und Chat-Verläufe, inklusive der beteiligten Personen, Zeitstempel und Übertragungswege. Verfahrensdaten beschreiben die Prozesse und Abläufe innerhalb von Systemen oder Organisationen, einschließlich Workflow-Dokumentationen, Protokolle von Transaktionen und Aktivitäten, sowie Audit-Logs, die zur Nachverfolgung und Überprüfung von Vorgängen verwendet werden.",
            ],
            [
              "Nutzungsdaten",
              "Nutzungsdaten beziehen sich auf Informationen, die erfassen, wie Nutzer mit digitalen Produkten, Dienstleistungen oder Plattformen interagieren. Diese Daten umfassen eine breite Palette von Informationen, die aufzeigen, wie Nutzer Anwendungen nutzen, welche Funktionen sie bevorzugen, wie lange sie auf bestimmten Seiten verweilen und über welche Pfade sie durch eine Anwendung navigieren. Nutzungsdaten können auch die Häufigkeit der Nutzung, Zeitstempel von Aktivitäten, IP-Adressen, Geräteinformationen und Standortdaten einschließen. Sie sind besonders wertvoll für die Analyse des Nutzerverhaltens, die Optimierung von Benutzererfahrungen, das Personalisieren von Inhalten und das Verbessern von Produkten oder Dienstleistungen. Darüber hinaus spielen Nutzungsdaten eine entscheidende Rolle beim Erkennen von Trends, Vorlieben und möglichen Problembereichen innerhalb digitaler Angebote",
            ],
            [
              "Personenbezogene Daten",
              "„Personenbezogene Daten“ sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (im Folgenden „betroffene Person“) beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z. B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind.",
            ],
            [
              "Protokolldaten",
              "Protokolldaten sind Informationen über Ereignisse oder Aktivitäten, die in einem System oder Netzwerk protokolliert wurden. Diese Daten enthalten typischerweise Informationen wie Zeitstempel, IP-Adressen, Benutzeraktionen, Fehlermeldungen und andere Details über die Nutzung oder den Betrieb eines Systems. Protokolldaten werden oft zur Analyse von Systemproblemen, zur Sicherheitsüberwachung oder zur Erstellung von Leistungsberichten verwendet.",
            ],
            [
              "Verantwortlicher",
              "Als „Verantwortlicher“ wird die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet, bezeichnet.",
            ],
            [
              "Verarbeitung",
              "„Verarbeitung“ ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch jeden Umgang mit Daten, sei es das Erheben, das Auswerten, das Speichern, das Übermitteln oder das Löschen.",
            ],
          ]}
        />
      </>
    ),
  },
];

export default function Datenschutz() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <h1>Datenschutzerklärung</h1>

        <h2 className="mt-10 text-h4">Präambel</h2>
        <p className="mt-3">
          Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten
          Ihrer personenbezogenen Daten (nachfolgend auch kurz als „Daten“ bezeichnet) wir zu
          welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle
          von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der
          Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen
          Applikationen sowie innerhalb externer Onlinepräsenzen, wie z. B. unserer
          Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als „Onlineangebot“).
        </p>
        <p className="mt-4">Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>
        <p className="mt-4">Stand: 2. Oktober 2026</p>

        <nav aria-labelledby="inhalt-titel" className="mt-10">
          <h2 id="inhalt-titel" className="text-h4">
            Inhaltsübersicht
          </h2>
          <ul className="mt-3 space-y-1">
            {abschnitte.map((a) => (
              <li key={a.id}>
                <a href={`#${a.id}`} className={LINK}>
                  {a.titel}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {abschnitte.map((a) => (
          <section key={a.id} id={a.id} aria-labelledby={`${a.id}-titel`} className="mt-12 scroll-mt-24">
            <h2 id={`${a.id}-titel`} className="text-h4">
              {a.titel}
            </h2>
            {a.inhalt}
          </section>
        ))}

        <p className="mt-12 text-body-sm text-text-muted">
          <a href="https://datenschutz-generator.de/" className={LINK} rel="noopener noreferrer nofollow">
            Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke
          </a>
        </p>
      </main>
      <Footer />
    </>
  );
}
