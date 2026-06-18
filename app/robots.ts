import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/supabase-test", "/supabase-test/"],
    },
    sitemap: "https://www.baumarkt-niederrhein.de/sitemap.xml",
    host: "https://www.baumarkt-niederrhein.de",
  };
}
