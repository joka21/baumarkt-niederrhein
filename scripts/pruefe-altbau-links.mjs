// Prüft die internen Links des Bereichs "Altbau sanieren":
// sammelt Links aus content/altbau-sanieren/*.md, app/page.tsx und app/team/page.tsx
// und prüft, dass jede Zielroute existiert. Aufruf: node scripts/pruefe-altbau-links.mjs
import fs from "node:fs";
import path from "node:path";

const WURZEL = process.cwd();
const CONTENT = path.join(WURZEL, "content", "altbau-sanieren");
const VERBOTEN = ["/sanierungsanfrage"];

// Routen aus app/**/page.tsx; dynamische Segmente werden zu Platzhaltern.
function routenMuster(ordner, praefix = "") {
  const muster = [];
  for (const eintrag of fs.readdirSync(ordner, { withFileTypes: true })) {
    if (eintrag.isDirectory()) {
      const segment = eintrag.name.startsWith("(") ? "" : `/${eintrag.name}`;
      muster.push(...routenMuster(path.join(ordner, eintrag.name), praefix + segment));
    } else if (eintrag.name === "page.tsx") {
      muster.push(praefix || "/");
    }
  }
  return muster;
}

// Die Altbau-Seiten sind mit dynamicParams = false nur für die Inhaltsdateien gültig.
const slugs = fs.readdirSync(CONTENT).filter((d) => d.endsWith(".md")).map((d) => d.slice(0, -3));
const altbau = new Set(["/altbau-sanieren", "/altbau-sanieren/unser-projekt"]);
for (const s of slugs) {
  if (/^etappe-\d+$/.test(s)) altbau.add(`/altbau-sanieren/unser-projekt/${s}`);
  else if (!["uebersicht", "unser-projekt"].includes(s)) altbau.add(`/altbau-sanieren/${s}`);
}

const muster = routenMuster(path.join(WURZEL, "app"))
  .filter((m) => !m.startsWith("/altbau-sanieren"))
  .map((m) => new RegExp(`^${m.replace(/\[[^\]]+\]/g, "[^/]+")}$`));

function existiert(ziel) {
  return altbau.has(ziel) || muster.some((re) => re.test(ziel));
}

const quellen = [
  ...fs.readdirSync(CONTENT).filter((d) => d.endsWith(".md")).map((d) => path.join(CONTENT, d)),
  path.join(WURZEL, "app", "page.tsx"),
  path.join(WURZEL, "app", "team", "page.tsx"),
];

let fehler = 0;
let anzahl = 0;
for (const datei of quellen) {
  const text = fs.readFileSync(datei, "utf8");
  const links = [
    ...[...text.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]),
    ...[...text.matchAll(/href=["'](\/[^"']*)["']/g)].map((m) => m[1]),
  ];
  for (const link of links) {
    anzahl++;
    const ziel = link.split(/[?#]/)[0] || "/";
    const name = path.relative(WURZEL, datei);
    if (VERBOTEN.some((v) => ziel === v || ziel.startsWith(`${v}/`))) {
      console.error(`VERBOTEN  ${name}: ${link}`);
      fehler++;
    } else if (ziel !== "/" && ziel.endsWith("/")) {
      console.error(`SCHRÄGSTRICH  ${name}: ${link}`);
      fehler++;
    } else if (!existiert(ziel)) {
      console.error(`FEHLT  ${name}: ${link}`);
      fehler++;
    }
  }
}

console.log(`${anzahl} interne Links geprüft, ${fehler} Fehler.`);
process.exit(fehler > 0 ? 1 : 0);
