import { Dumbbell, Apple, Heart, Sparkles, Pin, type LucideIcon } from "lucide-react";

export type RoutineCategory = "sport" | "nutrition" | "sante" | "bien-etre" | "autre";

export type Routine = {
  id: string;
  title: string;
  category: RoutineCategory;
  days_of_week: number[]; // 0 = dimanche … 6 = samedi
  time_of_day: string | null; // "HH:MM:SS" or null
  active: boolean;
  created_at: string;
};

export type RoutineCompletion = {
  id: string;
  routine_id: string;
  completed_date: string; // YYYY-MM-DD
  completed_at: string;
};

export const CATEGORIES: Record<
  RoutineCategory,
  { label: string; icon: LucideIcon; color: string }
> = {
  sport: { label: "Sport", icon: Dumbbell, color: "text-orange-400" },
  nutrition: { label: "Nutrition", icon: Apple, color: "text-lime-400" },
  sante: { label: "Santé", icon: Heart, color: "text-rose-400" },
  "bien-etre": { label: "Bien-être", icon: Sparkles, color: "text-violet-400" },
  autre: { label: "Autre", icon: Pin, color: "text-slate-400" },
};

// JS getDay() convention: 0 = dimanche … 6 = samedi (matches DB storage)
export const DAYS_SHORT = ["D", "L", "M", "M", "J", "V", "S"];
export const DAYS_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

// Display order: la semaine commence le lundi (FR)
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function todayDow(): number {
  return new Date().getDay();
}

export function todayDateStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isScheduledToday(routine: Routine): boolean {
  return routine.active && routine.days_of_week.includes(todayDow());
}

/**
 * Compute streak (consecutive completed days ending today or yesterday).
 * `completions` should be the set of completed dates for one routine, ordered desc.
 */
export function computeStreak(completedDates: Set<string>, scheduledDows: number[]): number {
  let streak = 0;
  const cursor = new Date();
  // Allow a "free pass" if today wasn't scheduled but yesterday was completed.
  for (let i = 0; i < 365; i++) {
    const dow = cursor.getDay();
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;

    if (scheduledDows.includes(dow)) {
      if (completedDates.has(key)) {
        streak++;
      } else if (i === 0) {
        // Today not yet completed — don't break, just skip
      } else {
        break;
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
