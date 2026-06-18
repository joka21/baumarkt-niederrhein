import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const BASE_URL = "https://www.baumarkt-niederrhein.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,              lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${BASE_URL}/fuer-anbieter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/impressum`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE_URL}/datenschutz`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE_URL}/agb`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from("anbieter")
    .select("slug")
    .eq("status", "aktiv");

  if (error || !data) return staticRoutes; // bei Fehler nur statische Routen

  const anbieterRoutes: MetadataRoute.Sitemap = data.map((a) => ({
    url: `${BASE_URL}/anbieter/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const { data: artikelData } = await supabase
    .from("artikel")
    .select("slug, aktualisiert_am")
    .eq("status", "veroeffentlicht");

  const ratgeberRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ratgeber`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...(artikelData ?? []).map((a) => ({
      url: `${BASE_URL}/ratgeber/${a.slug}`,
      lastModified: a.aktualisiert_am ? new Date(a.aktualisiert_am) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...anbieterRoutes, ...ratgeberRoutes];
}
