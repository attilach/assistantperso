"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  CATEGORIES,
  DAYS_LONG,
  computeStreak,
  describeSchedule,
  isCompletedForPeriod,
  shouldShowToday,
  todayDateStr,
  todayDow,
  type FrequencyType,
  type Routine,
  type RoutineCategory,
  type RoutineCompletion,
} from "@/lib/routines";
import { Button } from "@/components/ui/button";
import RoutineForm from "@/components/RoutineForm";
import {
  Check,
  ChevronRight,
  Plus,
  Flame,
  Clock,
  Loader2,
  CalendarDays,
  CalendarRange,
  CalendarCheck2,
} from "lucide-react";

type FormPayload = {
  title: string;
  category: RoutineCategory;
  frequency_type: FrequencyType;
  days_of_week: number[];
  day_of_month: number | null;
  month_of_year: number | null;
  time_of_day: string | null;
};

const FREQ_GROUPS: { value: FrequencyType; label: string; icon: typeof CalendarDays }[] = [
  { value: "weekly", label: "Hebdomadaires", icon: CalendarDays },
  { value: "monthly", label: "Mensuelles", icon: CalendarRange },
  { value: "yearly", label: "Annuelles", icon: CalendarCheck2 },
];

export default function RoutineList() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [completions, setCompletions] = useState<RoutineCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"today" | "all">("today");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const sb = getSupabase();
      // Fetch from start of last year so monthly streaks are meaningful
      const since = new Date();
      since.setFullYear(since.getFullYear() - 1);
      since.setMonth(0);
      since.setDate(1);
      const sinceStr = since.toISOString().slice(0, 10);

      const [r, c] = await Promise.all([
        sb.from("routines").select("*").order("created_at", { ascending: false }),
        sb.from("routine_completions").select("*").gte("completed_date", sinceStr),
      ]);
      setRoutines(r.data ?? []);
      setCompletions(c.data ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const today = todayDateStr();
  const todayDowNum = todayDow();

  const completedByRoutine = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!map.has(c.routine_id)) map.set(c.routine_id, new Set());
      map.get(c.routine_id)!.add(c.completed_date);
    }
    return map;
  }, [completions]);

  const todayRoutines = routines.filter((r) =>
    shouldShowToday(r, completedByRoutine.get(r.id) ?? new Set())
  );
  const todayDone = todayRoutines.filter((r) =>
    isCompletedForPeriod(r, completedByRoutine.get(r.id) ?? new Set())
  ).length;

  async function toggleCompletion(routine: Routine) {
    const dates = completedByRoutine.get(routine.id) ?? new Set();
    const isDone = isCompletedForPeriod(routine, dates);
    const sb = getSupabase();

    if (isDone) {
      // For weekly: remove today's completion. For monthly/yearly: remove the
      // single completion of this period (any one).
      let target = today;
      if (routine.frequency_type !== "weekly") {
        const now = new Date();
        const yyyy = now.getFullYear().toString();
        const prefix =
          routine.frequency_type === "monthly"
            ? `${yyyy}-${String(now.getMonth() + 1).padStart(2, "0")}-`
            : `${yyyy}-`;
        const found = Array.from(dates).find((d) => d.startsWith(prefix));
        if (found) target = found;
      }
      setCompletions((prev) =>
        prev.filter((c) => !(c.routine_id === routine.id && c.completed_date === target))
      );
      await sb
        .from("routine_completions")
        .delete()
        .eq("routine_id", routine.id)
        .eq("completed_date", target);
    } else {
      const optimistic: RoutineCompletion = {
        id: crypto.randomUUID(),
        routine_id: routine.id,
        completed_date: today,
        completed_at: new Date().toISOString(),
      };
      setCompletions((prev) => [...prev, optimistic]);
      const { data } = await sb
        .from("routine_completions")
        .insert({ routine_id: routine.id, completed_date: today })
        .select()
        .single();
      if (data) {
        setCompletions((prev) => prev.map((c) => (c.id === optimistic.id ? data : c)));
      }
    }
  }

  async function saveRoutine(payload: FormPayload) {
    const sb = getSupabase();
    if (editing) {
      const { data } = await sb
        .from("routines")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (data) setRoutines((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    } else {
      const { data } = await sb.from("routines").insert(payload).select().single();
      if (data) setRoutines((prev) => [data, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  }

  async function deleteEditingRoutine() {
    if (!editing) return;
    const id = editing.id;
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    setCompletions((prev) => prev.filter((c) => c.routine_id !== id));
    await getSupabase().from("routines").delete().eq("id", id);
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="bg-background flex-1 px-4 pt-8 pb-28">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Routines
          </p>
          <h1 className="text-foreground text-3xl font-bold capitalize">
            {DAYS_LONG[todayDowNum]}
          </h1>
          {!loading && tab === "today" && todayRoutines.length > 0 && (
            <p className="text-muted-foreground mt-1 text-sm">
              {todayDone} / {todayRoutines.length} accompli
              {todayDone > 1 ? "es" : ""}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="border-border bg-card mb-6 flex gap-1 rounded-full border p-1">
          {(["today", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "today" ? "Aujourd'hui" : "Toutes"}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-muted-foreground flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {/* Today view */}
        {!loading && tab === "today" && (
          <>
            {todayRoutines.length === 0 ? (
              <EmptyState
                message="Aucune routine prévue aujourd'hui."
                cta="Crée ta première routine"
                onCta={() => setShowForm(true)}
              />
            ) : (
              <ul className="space-y-2">
                {todayRoutines.map((r) => {
                  const completedSet = completedByRoutine.get(r.id) ?? new Set();
                  return (
                    <RoutineCard
                      key={r.id}
                      routine={r}
                      done={isCompletedForPeriod(r, completedSet)}
                      streak={computeStreak(r, completedSet)}
                      onToggle={() => toggleCompletion(r)}
                    />
                  );
                })}
              </ul>
            )}
          </>
        )}

        {/* All view, grouped by frequency */}
        {!loading && tab === "all" && (
          <>
            {routines.length === 0 ? (
              <EmptyState
                message="Aucune routine pour l'instant."
                cta="Crée ta première routine"
                onCta={() => setShowForm(true)}
              />
            ) : (
              <div className="space-y-6">
                {FREQ_GROUPS.map((group) => {
                  const items = routines.filter((r) => r.frequency_type === group.value);
                  if (items.length === 0) return null;
                  const Icon = group.icon;
                  return (
                    <section key={group.value}>
                      <div className="mb-2 flex items-center gap-2">
                        <Icon className="text-muted-foreground h-3.5 w-3.5" />
                        <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                          {group.label}
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {items.map((r) => (
                          <RoutineRow
                            key={r.id}
                            routine={r}
                            streak={computeStreak(r, completedByRoutine.get(r.id) ?? new Set())}
                            onOpen={() => {
                              setEditing(r);
                              setShowForm(true);
                            }}
                          />
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* FAB */}
        {!loading && (routines.length > 0 || tab === "all") && (
          <button
            onClick={() => setShowForm(true)}
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)" }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 fixed right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}

        {showForm && (
          <RoutineForm
            initial={editing ?? undefined}
            onSubmit={saveRoutine}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onDelete={editing ? deleteEditingRoutine : undefined}
          />
        )}
      </div>
    </div>
  );
}

function RoutineCard({
  routine,
  done,
  streak,
  onToggle,
}: {
  routine: Routine;
  done: boolean;
  streak: number;
  onToggle: () => void;
}) {
  const cat = CATEGORIES[routine.category];
  const Icon = cat.icon;
  const periodHint =
    routine.frequency_type === "monthly"
      ? "ce mois-ci"
      : routine.frequency_type === "yearly"
        ? "cette année"
        : null;

  return (
    <li
      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
        done ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <button
        onClick={onToggle}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          done
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        }`}
        aria-label={done ? "Marquer comme non fait" : "Marquer comme fait"}
      >
        {done ? <Check className="h-5 w-5" /> : <Icon className={`h-5 w-5 ${cat.color}`} />}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            done ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {routine.title}
        </p>
        <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
          <span>{cat.label}</span>
          {periodHint && (
            <>
              <span>·</span>
              <span>{periodHint}</span>
            </>
          )}
          {routine.time_of_day && (
            <>
              <span>·</span>
              <Clock className="h-3 w-3" />
              <span>{routine.time_of_day.slice(0, 5)}</span>
            </>
          )}
        </div>
      </div>

      {streak > 0 && (
        <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-400">
          <Flame className="h-3 w-3" />
          {streak}
        </div>
      )}
    </li>
  );
}

function RoutineRow({
  routine,
  streak,
  onOpen,
}: {
  routine: Routine;
  streak: number;
  onOpen: () => void;
}) {
  const cat = CATEGORIES[routine.category];
  const Icon = cat.icon;

  return (
    <li>
      <button
        onClick={onOpen}
        className="border-border bg-card hover:border-primary/30 active:bg-card/60 flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors"
      >
        <div
          className={`bg-background flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.color}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-medium">{routine.title}</p>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
            <span>{cat.label}</span>
            <span>·</span>
            <span className="truncate">{describeSchedule(routine)}</span>
            {routine.time_of_day && (
              <>
                <span>·</span>
                <span>{routine.time_of_day.slice(0, 5)}</span>
              </>
            )}
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-400">
            <Flame className="h-3 w-3" />
            {streak}
          </div>
        )}

        <ChevronRight className="text-muted-foreground/40 h-4 w-4 shrink-0" />
      </button>
    </li>
  );
}

function EmptyState({ message, cta, onCta }: { message: string; cta: string; onCta: () => void }) {
  return (
    <div className="border-border bg-card/50 rounded-2xl border border-dashed p-10 text-center">
      <p className="text-muted-foreground mb-4 text-sm">{message}</p>
      <Button onClick={onCta} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="mr-1 h-4 w-4" />
        {cta}
      </Button>
    </div>
  );
}
