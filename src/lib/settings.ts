import { getSupabase } from "@/lib/supabase";

export type AppSettings = {
  id: number;
  nag_interval_minutes: number;
  nag_tasks_enabled: boolean;
  nag_routines_enabled: boolean;
  nag_start_hour: number;
  nag_end_hour: number;
  last_nag_at: string | null;
};

export const INTERVAL_OPTIONS = [
  { value: 0, label: "Désactivé" },
  { value: 15, label: "Toutes les 15 minutes" },
  { value: 30, label: "Toutes les 30 minutes" },
  { value: 60, label: "Toutes les heures" },
  { value: 120, label: "Toutes les 2 heures" },
  { value: 240, label: "Toutes les 4 heures" },
];

export async function getAppSettings(): Promise<AppSettings> {
  const { data } = await getSupabase().from("app_settings").select("*").eq("id", 1).single();
  return data as AppSettings;
}

export async function updateAppSettings(patch: Partial<AppSettings>): Promise<void> {
  await getSupabase().from("app_settings").update(patch).eq("id", 1);
}
