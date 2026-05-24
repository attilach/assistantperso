import { getSupabase } from "@/lib/supabase";

export type QuestStatus = "active" | "paused" | "done";

export type Quest = {
  id: string;
  title: string;
  is_focus: boolean;
  status: QuestStatus;
  created_at: string;
  done_at: string | null;
};

export const STATUS_LABELS: Record<QuestStatus, string> = {
  active: "Active",
  paused: "En pause",
  done: "Terminée",
};

/** Atomically set a single quest as the focus, unmarking all others. */
export async function setFocus(questId: string): Promise<void> {
  const sb = getSupabase();
  // 1) Clear focus from all others (unique partial index would otherwise reject)
  await sb.from("quests").update({ is_focus: false }).eq("is_focus", true).neq("id", questId);
  // 2) Set focus on the target
  await sb.from("quests").update({ is_focus: true }).eq("id", questId);
}

export async function clearFocus(questId: string): Promise<void> {
  await getSupabase().from("quests").update({ is_focus: false }).eq("id", questId);
}

export async function getCurrentFocus(): Promise<Quest | null> {
  const { data } = await getSupabase()
    .from("quests")
    .select("*")
    .eq("is_focus", true)
    .eq("status", "active")
    .maybeSingle();
  return data ?? null;
}
