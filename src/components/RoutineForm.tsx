"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  DAYS_SHORT,
  DISPLAY_ORDER,
  type Routine,
  type RoutineCategory,
} from "@/lib/routines";
import { Trash2, X } from "lucide-react";

type Props = {
  initial?: Partial<Routine>;
  onSubmit: (data: {
    title: string;
    category: RoutineCategory;
    days_of_week: number[];
    time_of_day: string | null;
  }) => Promise<void> | void;
  onCancel: () => void;
  onDelete?: () => Promise<void> | void;
};

export default function RoutineForm({ initial, onSubmit, onCancel, onDelete }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<RoutineCategory>(
    (initial?.category as RoutineCategory) ?? "sport"
  );
  const [days, setDays] = useState<number[]>(
    initial?.days_of_week ?? [1, 2, 3, 4, 5] // lun-ven par défaut
  );
  const [time, setTime] = useState<string>(
    initial?.time_of_day ? initial.time_of_day.slice(0, 5) : ""
  );
  const [busy, setBusy] = useState(false);

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || days.length === 0) return;
    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        days_of_week: days,
        time_of_day: time ? `${time}:00` : null,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-t-2xl border border-border bg-card p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {initial?.id ? "Modifier la routine" : "Nouvelle routine"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Titre */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Titre
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Musculation 30min"
            autoFocus
            className="border-border bg-background"
          />
        </div>

        {/* Catégorie */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Catégorie
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORIES) as RoutineCategory[]).map((key) => {
              const cat = CATEGORIES[key];
              const Icon = cat.icon;
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? "" : cat.color}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jours */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Jours
          </label>
          <div className="flex gap-1.5">
            {DISPLAY_ORDER.map((dayIndex) => {
              const active = days.includes(dayIndex);
              return (
                <button
                  key={dayIndex}
                  type="button"
                  onClick={() => toggleDay(dayIndex)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {DAYS_SHORT[dayIndex]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Heure */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Heure (optionnel)
          </label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border-border bg-background"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={busy}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={busy || !title.trim() || days.length === 0}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {initial?.id ? "Enregistrer" : "Créer"}
          </Button>
        </div>

        {/* Danger zone — uniquement en mode édition */}
        {initial?.id && onDelete && (
          <>
            <div className="my-5 h-px bg-border" />
            <button
              type="button"
              onClick={async () => {
                if (!confirm(`Supprimer "${initial.title}" et tout son historique ?`)) return;
                setBusy(true);
                try {
                  await onDelete();
                } finally {
                  setBusy(false);
                }
              }}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer cette routine
            </button>
          </>
        )}
      </form>
    </div>
  );
}
