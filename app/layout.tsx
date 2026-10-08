import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Source_Sans_3 } from "next/font/google";
import "./globals.css";

// Schriften nach Figma, selbst gehostet über next/font. Nur benötigte Schnitte:
// Libre Franklin 800 (Überschriften), Source Sans 3 400/500/700 (Text) + 600 (Figma-Stil "Button").
const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Kein Canonical im Layout: jede Seite setzt ihren eigenen, 404-Seiten keinen.
export const viewport: Viewport = {
  themeColor: "#047857",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.baumarkt-niederrhein.de"),
  title: {
    default: "Baumarkt Niederrhein: Ratgeber für Bauen und Renovieren",
    template: "%s | Baumarkt Niederrhein",
  },
  description:
    "Sechs Tiere vom Niederrhein schreiben über Bauen, Renovieren und Handwerk. Mit Ratgebern, Kostenübersichten und den Baumärkten in deiner Stadt.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Baumarkt Niederrhein",
    title: "Baumarkt Niederrhein: Ratgeber für Bauen und Renovieren",
    description:
      "Sechs Tiere vom Niederrhein schreiben über Bauen, Renovieren und Handwerk. Mit Ratgebern, Kostenübersichten und den Baumärkten in deiner Stadt.",
    // TODO Block D: Standard-OG-Bild (opengraph-image) ergänzen
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${libreFranklin.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
