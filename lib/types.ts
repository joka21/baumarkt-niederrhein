// Geteilte Typen für die Supabase-Daten der Anbieter-Plattform.

export type Kategorie = {
  name: string;
  slug: string;
  icon?: string | null;
};

// Verknüpfungstabelle anbieter_kategorien liefert pro Eintrag genau ein Gewerk.
export type AnbieterKategorie = {
  kategorien: Kategorie | null;
};

export type Anbieter = {
  id: string;
  slug: string;
  name: string;
  beschreibung: string | null;
  ort: string | null;
  plz?: string | null;
  einzugsgebiet?: string | null;
  kontakt_email?: string | null;
  kontakt_telefon?: string | null;
  logo_url: string | null;
  status?: string;
  anbieter_kategorien: AnbieterKategorie[];
};

// Extrahiert die verknüpften Gewerke eines Anbieters als saubere Kategorie-Liste.
export function getGewerke(anbieter: Pick<Anbieter, "anbieter_kategorien">): Kategorie[] {
  return (anbieter.anbieter_kategorien ?? [])
    .map((eintrag) => eintrag.kategorien)
    .filter((kategorie): kategorie is Kategorie => Boolean(kategorie));
}
