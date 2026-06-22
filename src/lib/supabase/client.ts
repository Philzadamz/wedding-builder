import { createBrowserClient } from "@supabase/ssr";

// Supabase client without generic — query results are cast at call sites.
// Run `supabase gen types typescript` to get full generated types in future.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
