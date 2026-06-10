import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function SupabaseTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: kategorien, error } = await supabase
    .from("kategorien")
    .select("name, slug");

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase-Test</h1>
      {error ? (
        <p>Fehler: {error.message}</p>
      ) : (
        <>
          <p>Verbindung steht. Gefundene Gewerke: {kategorien?.length ?? 0}</p>
          <ul>
            {kategorien?.map((k) => (
              <li key={k.slug}>{k.name}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
