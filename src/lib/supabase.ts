import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isOffline, OfflineError } from "@/lib/offline";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars not configured");
    _supabase = createClient(url, key, {
      global: {
        // Sans réseau, on échoue tout de suite plutôt que d'attendre le timeout :
        // les lectures basculent aussitôt sur le cache local.
        fetch: (input, init) =>
          isOffline() ? Promise.reject(new OfflineError()) : fetch(input, init),
      },
    });
  }
  return _supabase;
}

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  is_focus: boolean;
  focus_at: string | null;
  created_at: string;
};
