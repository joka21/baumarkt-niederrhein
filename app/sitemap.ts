import type { MetadataRoute } from "next";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { AUTOREN } from "@/lib/autoren";

const BASE_URL = "https://www.baumarkt-niederrhein.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,              lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${BASE_URL}/fuer-anbieter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/impressum`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE_URL}/datenschutz`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  // Anbieterseiten (/anbieter/[slug]) stehen bewusst nicht in der Sitemap –
  // sie sind noindex, follow (siehe app/anbieter/[slug]/page.tsx).

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

  const teamRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...AUTOREN.map((a) => ({
      url: `${BASE_URL}/team/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];

  return [...staticRoutes, ...ratgeberRoutes, ...teamRoutes];
}
