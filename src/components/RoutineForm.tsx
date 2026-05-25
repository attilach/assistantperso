"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  DAYS_SHORT,
  DISPLAY_ORDER,
  MONTHS_LONG,
  type FrequencyType,
  type Routine,
  type RoutineCategory,
} from "@/lib/routines";
import { Trash2, X } from "lucide-react";

type FormPayload = {
  title: string;
  category: RoutineCategory;
  frequency_type: FrequencyType;
  days_of_week: number[];
  day_of_month: number | null;
  month_of_year: number | null;
  time_of_day: string | null;
};

type Props = {
  initial?: Partial<Routine>;
  onSubmit: (data: FormPayload) => Promise<void> | void;
  onCancel: () => void;
  onDelete?: () => Promise<void> | void;
};

const FREQUENCY_OPTIONS: { value: FrequencyType; label: string; hint: string }[] = [
  { value: "weekly", label: "Hebdo", hint: "Certains jours de la semaine" },
  { value: "monthly", label: "Mensuelle", hint: "Un jour du mois" },
  { value: "yearly", label: "Annuelle", hint: "Une date dans l'année" },
];

export default function RoutineForm({ initial, onSubmit, onCancel, onDelete }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<RoutineCategory>(
    (initial?.category as RoutineCategory) ?? "sport"
  );
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(
    initial?.frequency_type ?? "weekly"
  );
  const [days, setDays] = useState<number[]>(initial?.days_of_week ?? [1, 2, 3, 4, 5]);
  const [dayOfMonth, setDayOfMonth] = useState<number>(initial?.day_of_month ?? 1);
  const [monthOfYear, setMonthOfYear] = useState<number>(initial?.month_of_year ?? 1);
  const [time, setTime] = useState<string>(
    initial?.time_of_day ? initial.time_of_day.slice(0, 5) : ""
  );
  const [busy, setBusy] = useState(false);

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()));
  }

  const isValid = (() => {
    if (!title.trim()) return false;
    if (frequencyType === "weekly") return days.length > 0;
    if (frequencyType === "monthly") return dayOfMonth >= 1 && dayOfMonth <= 31;
    if (frequencyType === "yearly")
      return monthOfYear >= 1 && monthOfYear <= 12 && dayOfMonth >= 1 && dayOfMonth <= 31;
    return false;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        frequency_type: frequencyType,
        days_of_week: frequencyType === "weekly" ? days : [],
        day_of_month: frequencyType === "weekly" ? null : dayOfMonth,
        month_of_year: frequencyType === "yearly" ? monthOfYear : null,
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
        className="border-border bg-card max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            {initial?.id ? "Modifier la routine" : "Nouvelle routine"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Titre */}
        <div className="mb-4">
          <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
            Titre
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Musculation 30min, Détartrage"
            autoFocus
            className="border-border bg-background"
          />
        </div>

        {/* Catégorie */}
        <div className="mb-4">
          <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
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

        {/* Fréquence */}
        <div className="mb-4">
          <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
            Fréquence
          </label>
          <div className="flex gap-2">
            {FREQUENCY_OPTIONS.map((opt) => {
              const active = frequencyType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrequencyType(opt.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jours (weekly) */}
        {frequencyType === "weekly" && (
          <div className="mb-4">
            <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
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
        )}

        {/* Jour du mois (monthly + yearly) */}
        {(frequencyType === "monthly" || frequencyType === "yearly") && (
          <div className="mb-4 flex gap-2">
            {frequencyType === "yearly" && (
              <div className="flex-1">
                <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                  Mois
                </label>
                <select
                  value={monthOfYear}
                  onChange={(e) => setMonthOfYear(parseInt(e.target.value))}
                  className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm capitalize"
                >
                  {MONTHS_LONG.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex-1">
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                Jour
              </label>
              <select
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d === 1 ? "1er" : d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(frequencyType === "monthly" || frequencyType === "yearly") && dayOfMonth > 28 && (
          <p className="text-muted-foreground -mt-2 mb-4 text-xs">
            Sur un mois plus court, ça tombera le dernier jour du mois.
          </p>
        )}

        {/* Heure */}
        <div className="mb-6">
          <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-widest uppercase">
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
            disabled={busy || !isValid}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
          >
            {initial?.id ? "Enregistrer" : "Créer"}
          </Button>
        </div>

        {initial?.id && onDelete && (
          <>
            <div className="bg-border my-5 h-px" />
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
              className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
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
