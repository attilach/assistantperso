"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  CATEGORIES,
  DAYS_LONG,
  DAYS_SHORT,
  computeStreak,
  isScheduledToday,
  todayDateStr,
  todayDow,
  type Routine,
  type RoutineCategory,
  type RoutineCompletion,
} from "@/lib/routines";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RoutineForm from "@/components/RoutineForm";
import { Check, Plus, Flame, Pencil, Trash2, Clock, Loader2 } from "lucide-react";

export default function RoutineList() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [completions, setCompletions] = useState<RoutineCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"today" | "all">("today");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Routine | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const sb = getSupabase();
    const since = new Date();
    since.setDate(since.getDate() - 60);
    const sinceStr = since.toISOString().slice(0, 10);

    const [r, c] = await Promise.all([
      sb.from("routines").select("*").order("created_at", { ascending: false }),
      sb.from("routine_completions").select("*").gte("completed_date", sinceStr),
    ]);
    setRoutines(r.data ?? []);
    setCompletions(c.data ?? []);
    setLoading(false);
  }

  const today = todayDateStr();
  const todayDowNum = todayDow();

  // Build a map: routine_id → Set<date>
  const completedByRoutine = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!map.has(c.routine_id)) map.set(c.routine_id, new Set());
      map.get(c.routine_id)!.add(c.completed_date);
    }
    return map;
  }, [completions]);

  const todayRoutines = routines.filter(isScheduledToday);
  const todayDone = todayRoutines.filter((r) =>
    completedByRoutine.get(r.id)?.has(today)
  ).length;

  async function toggleCompletion(routine: Routine) {
    const dates = completedByRoutine.get(routine.id);
    const isDone = dates?.has(today);
    const sb = getSupabase();

    if (isDone) {
      // remove completion
      setCompletions((prev) =>
        prev.filter((c) => !(c.routine_id === routine.id && c.completed_date === today))
      );
      await sb
        .from("routine_completions")
        .delete()
        .eq("routine_id", routine.id)
        .eq("completed_date", today);
    } else {
      // add completion (optimistic)
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

  async function saveRoutine(payload: {
    title: string;
    category: RoutineCategory;
    days_of_week: number[];
    time_of_day: string | null;
  }) {
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

  async function deleteRoutine(routine: Routine) {
    if (!confirm(`Supprimer "${routine.title}" et tout son historique ?`)) return;
    setRoutines((prev) => prev.filter((r) => r.id !== routine.id));
    setCompletions((prev) => prev.filter((c) => c.routine_id !== routine.id));
    await getSupabase().from("routines").delete().eq("id", routine.id);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Routines
          </p>
          <h1 className="text-3xl font-bold capitalize text-foreground">
            {DAYS_LONG[todayDowNum]}
          </h1>
          {!loading && tab === "today" && todayRoutines.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {todayDone} / {todayRoutines.length} accompli
              {todayDone > 1 ? "es" : ""}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-full border border-border bg-card p-1">
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
          <div className="flex justify-center py-16 text-muted-foreground">
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
                {todayRoutines.map((r) => (
                  <RoutineCard
                    key={r.id}
                    routine={r}
                    done={completedByRoutine.get(r.id)?.has(today) ?? false}
                    streak={computeStreak(
                      completedByRoutine.get(r.id) ?? new Set(),
                      r.days_of_week
                    )}
                    onToggle={() => toggleCompletion(r)}
                    onEdit={() => {
                      setEditing(r);
                      setShowForm(true);
                    }}
                  />
                ))}
              </ul>
            )}
          </>
        )}

        {/* All view */}
        {!loading && tab === "all" && (
          <>
            {routines.length === 0 ? (
              <EmptyState
                message="Aucune routine pour l'instant."
                cta="Crée ta première routine"
                onCta={() => setShowForm(true)}
              />
            ) : (
              <ul className="space-y-2">
                {routines.map((r) => (
                  <RoutineRow
                    key={r.id}
                    routine={r}
                    streak={computeStreak(
                      completedByRoutine.get(r.id) ?? new Set(),
                      r.days_of_week
                    )}
                    onEdit={() => {
                      setEditing(r);
                      setShowForm(true);
                    }}
                    onDelete={() => deleteRoutine(r)}
                  />
                ))}
              </ul>
            )}
          </>
        )}

        {/* FAB */}
        {!loading && (routines.length > 0 || tab === "all") && (
          <button
            onClick={() => setShowForm(true)}
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
            className="fixed right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90"
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
  onEdit,
}: {
  routine: Routine;
  done: boolean;
  streak: number;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const cat = CATEGORIES[routine.category];
  const Icon = cat.icon;

  return (
    <li
      className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all ${
        done
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card hover:border-primary/30"
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
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{cat.label}</span>
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

      <button
        onClick={onEdit}
        className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground/60 hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </li>
  );
}

function RoutineRow({
  routine,
  streak,
  onEdit,
  onDelete,
}: {
  routine: Routine;
  streak: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cat = CATEGORIES[routine.category];
  const Icon = cat.icon;

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background ${cat.color}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{routine.title}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{cat.label}</span>
          <span>·</span>
          <span>
            {DAYS_SHORT.map((label, i) => (
              <span
                key={i}
                className={routine.days_of_week.includes(i) ? "text-foreground" : "opacity-30"}
              >
                {label}
              </span>
            ))}
          </span>
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

      <button onClick={onEdit} className="text-muted-foreground/60 hover:text-foreground">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={onDelete} className="text-muted-foreground/60 hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

function EmptyState({
  message,
  cta,
  onCta,
}: {
  message: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      <Button
        onClick={onCta}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="mr-1 h-4 w-4" />
        {cta}
      </Button>
    </div>
  );
}
