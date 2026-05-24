"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2, Moon } from "lucide-react";
import {
  getAppSettings,
  updateAppSettings,
  INTERVAL_OPTIONS,
  type AppSettings,
} from "@/lib/settings";

export default function NagSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAppSettings().then(setSettings);
  }, []);

  async function update(patch: Partial<AppSettings>) {
    if (!settings) return;
    setSettings({ ...settings, ...patch });
    setSaving(true);
    try {
      await updateAppSettings(patch);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="border-border bg-card text-muted-foreground flex items-center gap-2 rounded-xl border p-4 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement...
      </div>
    );
  }

  const enabled = settings.nag_interval_minutes > 0;

  return (
    <div className="border-border bg-card space-y-5 rounded-xl border p-4">
      {/* Intervalle */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-primary h-4 w-4" />
            <span className="text-foreground text-sm font-medium">Rappels périodiques</span>
          </div>
          {saving && <Loader2 className="text-muted-foreground/60 h-3 w-3 animate-spin" />}
        </div>
        <p className="text-muted-foreground mb-2 text-xs">
          Reçois une notif si des tâches ou des routines passées restent à faire.
        </p>
        <select
          value={settings.nag_interval_minutes}
          onChange={(e) => update({ nag_interval_minutes: parseInt(e.target.value) })}
          className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm"
        >
          {INTERVAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {enabled && (
        <>
          {/* Inclure */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
              Inclure
            </p>
            <div className="space-y-1">
              <Toggle
                label="Tâches en attente"
                value={settings.nag_tasks_enabled}
                onChange={(v) => update({ nag_tasks_enabled: v })}
              />
              <Toggle
                label="Routines non validées"
                value={settings.nag_routines_enabled}
                onChange={(v) => update({ nag_routines_enabled: v })}
              />
              <Toggle
                label="M'inviter à créer une tâche quand tout est fait"
                value={settings.nag_when_empty_enabled}
                onChange={(v) => update({ nag_when_empty_enabled: v })}
              />
            </div>
          </div>

          {/* Heures actives */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Moon className="text-muted-foreground h-3.5 w-3.5" />
              <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                Heures actives
              </p>
            </div>
            <p className="text-muted-foreground mb-2 text-xs">
              Pas de notif en-dehors de cette plage.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <select
                value={settings.nag_start_hour}
                onChange={(e) => update({ nag_start_hour: parseInt(e.target.value) })}
                className="border-border bg-background text-foreground flex-1 rounded-lg border px-3 py-2 text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}h00
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground">à</span>
              <select
                value={settings.nag_end_hour}
                onChange={(e) => update({ nag_end_hour: parseInt(e.target.value) })}
                className="border-border bg-background text-foreground flex-1 rounded-lg border px-3 py-2 text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}h00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5">
      <span className="text-foreground text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            value ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
