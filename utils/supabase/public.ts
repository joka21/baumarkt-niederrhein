import { createClient } from "@supabase/supabase-js";

// Supabase-Zugang für öffentliche Daten – ohne Cookies und ohne Sitzung,
// damit Seiten statisch erzeugt und per ISR zwischengespeichert werden können.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
