import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.baumarkt-niederrhein.de"),
  title: {
    default: "Baumarkt Niederrhein – Handwerker & Material am Niederrhein",
    template: "%s | Baumarkt Niederrhein",
  },
  description:
    "Baumarkt Niederrhein – geprüfte Handwerker und Händler aus der Region. Finden Sie Anbieter für Bodenleger, Maler, Fliesenleger, Sanitär, Elektro und mehr am Niederrhein.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Baumarkt Niederrhein",
    title: "Baumarkt Niederrhein – Handwerker & Material am Niederrhein",
    description:
      "Geprüfte Handwerker und Händler aus der Region Niederrhein – mit Profil, Leistungen und Kontakt.",
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
