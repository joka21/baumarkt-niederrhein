import { NextResponse, type NextRequest } from "next/server";

// Altlasten aus der Google Search Console (siehe Commit-Nachricht).

// Testanbieter, im Oktober 2026 gelöscht. Diese Adressen antworten mit 410 (Gone),
// damit Google sie aus dem Index nimmt. Andere Slugs unter /anbieter/ laufen in die 404.
const GELOESCHTE_ANBIETER = new Set([
  "heizung-und-sanitaer-gerads-neuss",
  "landschaftsbau-cremers-viersen",
  "bad-und-heizung-beckers-moenchengladbach",
  "gruenwerk-wenders-moers",
  "fliesen-pesch-dinslaken",
  "bodenstudio-koesters-neuss",
  "malermeister-lenssen-kleve",
  "elektrotechnik-viehausen-geldern",
  "fliesenleger-heussen-goch",
  "maler-tenbrink-geldern",
  "lichttechnik-wienen-kamp-lintfort",
  "trockenbau-straeter-willich",
  "elektroservice-kannenberg-wesel",
  "malerwerkstatt-coenen-wesel",
]);

const GONE_HTML = `<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Seite entfernt | Baumarkt Niederrhein</title></head>
<body><h1>Diese Seite gibt es nicht mehr</h1><p><a href="/">Zur Startseite von Baumarkt Niederrhein</a></p></body>
</html>`;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Alte Filter-Adressen der Startseite (?kategorie=…): 301 auf denselben Pfad ohne den
  // Parameter, andere Parameter bleiben.
  if (searchParams.has("kategorie")) {
    const ziel = request.nextUrl.clone();
    ziel.searchParams.delete("kategorie");
    return NextResponse.redirect(ziel, 301);
  }

  const slug = pathname.match(/^\/anbieter\/([^/]+)$/)?.[1];
  if (slug && GELOESCHTE_ANBIETER.has(slug)) {
    return new Response(GONE_HTML, {
      status: 410,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

export const config = {
  matcher: [
    "/anbieter/:slug",
    { source: "/:path*", has: [{ type: "query", key: "kategorie" }] },
  ],
};
