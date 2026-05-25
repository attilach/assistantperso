import { Dumbbell, Apple, Heart, Sparkles, Pin, type LucideIcon } from "lucide-react";

export type RoutineCategory = "sport" | "nutrition" | "sante" | "bien-etre" | "autre";
export type FrequencyType = "weekly" | "monthly" | "yearly";

export type Routine = {
  id: string;
  title: string;
  category: RoutineCategory;
  frequency_type: FrequencyType;
  days_of_week: number[]; // 0 = dimanche … 6 = samedi (weekly only)
  day_of_month: number | null; // 1-31 (monthly / yearly)
  month_of_year: number | null; // 1-12 (yearly only)
  time_of_day: string | null;
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

export const MONTHS_LONG = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

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

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function clipDayOfMonth(target: number, date: Date): number {
  return Math.min(target, daysInMonth(date));
}

/**
 * Has the scheduled trigger for the current period already arrived?
 * (i.e. should we still expect it to be done today or earlier in the period)
 *
 * - weekly: today's dow is in days_of_week
 * - monthly: today's day >= target day (clipped to month end)
 * - yearly: today's month > target month, or same month and day >= target day
 */
export function isDueByNow(routine: Routine, now: Date = new Date()): boolean {
  if (!routine.active) return false;
  if (routine.frequency_type === "weekly") {
    return routine.days_of_week.includes(now.getDay());
  }
  if (routine.frequency_type === "monthly") {
    if (!routine.day_of_month) return false;
    const target = clipDayOfMonth(routine.day_of_month, now);
    return now.getDate() >= target;
  }
  if (routine.frequency_type === "yearly") {
    if (!routine.month_of_year || !routine.day_of_month) return false;
    const m = now.getMonth() + 1;
    if (m > routine.month_of_year) return true;
    if (m < routine.month_of_year) return false;
    const target = clipDayOfMonth(routine.day_of_month, now);
    return now.getDate() >= target;
  }
  return false;
}

/**
 * Was this routine already completed for the current period?
 * (period = day for weekly, month for monthly, year for yearly)
 */
export function isCompletedForPeriod(
  routine: Routine,
  completedDates: Set<string>,
  now: Date = new Date()
): boolean {
  const yyyy = now.getFullYear().toString();
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  if (routine.frequency_type === "weekly") {
    const dd = String(now.getDate()).padStart(2, "0");
    return completedDates.has(`${yyyy}-${mm}-${dd}`);
  }
  if (routine.frequency_type === "monthly") {
    const prefix = `${yyyy}-${mm}-`;
    for (const d of completedDates) if (d.startsWith(prefix)) return true;
    return false;
  }
  if (routine.frequency_type === "yearly") {
    const prefix = `${yyyy}-`;
    for (const d of completedDates) if (d.startsWith(prefix)) return true;
    return false;
  }
  return false;
}

/**
 * Should this routine appear in the "Aujourd'hui" view?
 *
 * - weekly: scheduled today (whether completed or not — we show ticked)
 * - monthly: due (today or earlier this month) AND not completed this month
 * - yearly: due (today or earlier this year) AND not completed this year
 */
export function shouldShowToday(
  routine: Routine,
  completedDates: Set<string>,
  now: Date = new Date()
): boolean {
  if (!routine.active) return false;
  if (routine.frequency_type === "weekly") {
    return routine.days_of_week.includes(now.getDay());
  }
  return isDueByNow(routine, now) && !isCompletedForPeriod(routine, completedDates, now);
}

/**
 * Streak: how many consecutive periods have been completed up to now?
 * - weekly: consecutive scheduled days completed (today free pass)
 * - monthly: consecutive months with at least one completion (current month free pass)
 * - yearly: not meaningful, returns 0
 */
export function computeStreak(routine: Routine, completedDates: Set<string>): number {
  if (routine.frequency_type === "weekly") {
    return computeWeeklyStreak(completedDates, routine.days_of_week);
  }
  if (routine.frequency_type === "monthly") {
    return computeMonthlyStreak(completedDates);
  }
  return 0;
}

function computeWeeklyStreak(completedDates: Set<string>, scheduledDows: number[]): number {
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const dow = cursor.getDay();
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;
    if (scheduledDows.includes(dow)) {
      if (completedDates.has(key)) streak++;
      else if (i === 0) {
        // today not yet done — don't break, free pass
      } else break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function computeMonthlyStreak(completedDates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 24; i++) {
    const yyyy = cursor.getFullYear().toString();
    const mm = String(cursor.getMonth() + 1).padStart(2, "0");
    const prefix = `${yyyy}-${mm}-`;
    const hasCompletion = Array.from(completedDates).some((d) => d.startsWith(prefix));
    if (hasCompletion) streak++;
    else if (i === 0) {
      // current month not yet done — free pass
    } else break;
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return streak;
}

/** Human-readable summary of the schedule, used in the routine list. */
export function describeSchedule(routine: Routine): string {
  if (routine.frequency_type === "weekly") {
    if (routine.days_of_week.length === 7) return "tous les jours";
    if (routine.days_of_week.length === 0) return "—";
    return DISPLAY_ORDER.filter((d) => routine.days_of_week.includes(d))
      .map((d) => DAYS_LONG[d].slice(0, 3))
      .join(" · ");
  }
  if (routine.frequency_type === "monthly") {
    if (!routine.day_of_month) return "mensuelle";
    if (routine.day_of_month === 1) return "le 1er de chaque mois";
    return `le ${routine.day_of_month} de chaque mois`;
  }
  if (routine.frequency_type === "yearly") {
    if (!routine.day_of_month || !routine.month_of_year) return "annuelle";
    const monthLabel = MONTHS_LONG[routine.month_of_year - 1];
    const dayLabel = routine.day_of_month === 1 ? "1er" : routine.day_of_month.toString();
    return `le ${dayLabel} ${monthLabel}`;
  }
  return "—";
}
