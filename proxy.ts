import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

// In Next.js 16, Middleware is called Proxy. This runs before each request
// and refreshes the Supabase auth session so cookies stay valid.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
