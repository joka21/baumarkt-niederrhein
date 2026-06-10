import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://baumarkt-niederrhein.de"),
  title: "Baumarkt Niederrhein – Handwerk & Material vom Niederrhein",
  description:
    "Der regionale Marktplatz für Handwerk und Material am Niederrhein. Geprüfte Handwerker und Händler aus Ihrer Region – mit Profil, Leistungen und Shop.",
  openGraph: {
    title: "Baumarkt Niederrhein – Handwerk & Material vom Niederrhein",
    description:
      "Der regionale Marktplatz für Handwerk und Material am Niederrhein. Geprüfte Handwerker und Händler aus Ihrer Region – mit Profil, Leistungen und Shop.",
    locale: "de_DE",
    type: "website",
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
