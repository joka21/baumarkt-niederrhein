// Server-seitige Erkennung der Gewerk-Bilder in public/gewerke/.
// Liegt dort z. B. maler.jpg, wird es flächenfüllend genutzt; sonst greift die
// farbige Platzhalterfläche. ACHTUNG: nutzt fs – nur in Server Components importieren.

import fs from "node:fs";
import path from "node:path";

let cache: Map<string, string> | null = null;

function ladeBilder(): Map<string, string> {
  // Im Produktionsbuild cachen; in der Entwicklung neu einlesen, damit neu
  // abgelegte Bilder ohne Server-Neustart erscheinen.
  if (cache && process.env.NODE_ENV === "production") return cache;

  const map = new Map<string, string>();
  try {
    const dir = path.join(process.cwd(), "public", "gewerke");
    for (const datei of fs.readdirSync(dir)) {
      const treffer = datei.match(/^(.+)\.(jpg|jpeg|png|webp|avif)$/i);
      if (treffer) {
        map.set(treffer[1].toLowerCase(), `/gewerke/${datei}`);
      }
    }
  } catch {
    // Ordner fehlt o. Ä. -> keine Bilder, Fallback greift.
  }

  cache = map;
  return map;
}

export function getGewerkeBild(slug?: string | null): string | null {
  if (!slug) return null;
  return ladeBilder().get(slug.toLowerCase()) ?? null;
}
