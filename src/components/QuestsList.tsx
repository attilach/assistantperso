"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { setFocus, type Quest, type QuestStatus, STATUS_LABELS } from "@/lib/quests";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLongPress } from "@/lib/use-long-press";
import { Plus, Loader2, Compass, Target, Star, Check, Pause, Play, X } from "lucide-react";

export default function QuestsList() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [editing, setEditing] = useState<Quest | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchQuests() {
      setLoading(true);
      const { data } = await getSupabase()
        .from("quests")
        .select("*")
        .order("created_at", { ascending: false });
      setQuests(data ?? []);
      setLoading(false);
    }
    fetchQuests();
  }, []);

  async function addQuest(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");

    const optimistic: Quest = {
      id: crypto.randomUUID(),
      title,
      is_focus: false,
      status: "active",
      created_at: new Date().toISOString(),
      done_at: null,
    };
    setQuests((prev) => [optimistic, ...prev]);

    const { data } = await getSupabase().from("quests").insert({ title }).select().single();
    if (data) setQuests((prev) => prev.map((q) => (q.id === optimistic.id ? data : q)));
  }

  async function makeFocus(quest: Quest) {
    // Optimistic: unset all others, set this one
    setQuests((prev) => prev.map((q) => ({ ...q, is_focus: q.id === quest.id ? true : false })));
    await setFocus(quest.id);
    setEditing(null);
  }

  async function unfocus(quest: Quest) {
    setQuests((prev) => prev.map((q) => (q.id === quest.id ? { ...q, is_focus: false } : q)));
    await getSupabase().from("quests").update({ is_focus: false }).eq("id", quest.id);
    setEditing(null);
  }

  async function setStatus(quest: Quest, status: QuestStatus) {
    const done_at = status === "done" ? new Date().toISOString() : null;
    const patch = status === "done" ? { status, done_at, is_focus: false } : { status, done_at };
    setQuests((prev) => prev.map((q) => (q.id === quest.id ? { ...q, ...patch } : q)));
    await getSupabase().from("quests").update(patch).eq("id", quest.id);
    setEditing(null);
  }

  async function deleteQuest(quest: Quest) {
    if (!confirm(`Supprimer "${quest.title}" ?`)) return;
    setQuests((prev) => prev.filter((q) => q.id !== quest.id));
    await getSupabase().from("quests").delete().eq("id", quest.id);
    setEditing(null);
  }

  const focused = quests.find((q) => q.is_focus && q.status === "active") ?? null;
  const active = quests.filter((q) => q.status === "active" && !q.is_focus);
  const paused = quests.filter((q) => q.status === "paused");
  const done = quests.filter((q) => q.status === "done");

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Quêtes
          </p>
          <h1 className="text-foreground text-3xl font-bold">Tes objectifs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Une quête principale + tes side quests en parallèle.
          </p>
        </div>

        {/* Add form */}
        <form onSubmit={addQuest} className="mb-6 flex gap-2">
          <Input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nouvelle quête (ex: MasterPython, Voyage Japon)..."
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {loading && (
          <div className="text-muted-foreground flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {!loading && quests.length === 0 && (
          <div className="border-border bg-card/50 rounded-2xl border border-dashed p-10 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Compass className="text-primary h-6 w-6" />
            </div>
            <p className="text-foreground mb-1 text-sm font-medium">
              Aucune quête pour l&apos;instant
            </p>
            <p className="text-muted-foreground text-xs">
              Crée ta première quête ci-dessus. Tu pourras ensuite en marquer une comme focus
              principal.
            </p>
          </div>
        )}

        {/* Focus hero */}
        {focused && <FocusCard quest={focused} onOpen={() => setEditing(focused)} />}

        {/* Side quests (active, non-focus) */}
        {active.length > 0 && (
          <section className="mt-6">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
              Side quests
            </p>
            <ul className="space-y-2">
              {active.map((q) => (
                <QuestRow key={q.id} quest={q} onOpen={() => setEditing(q)} />
              ))}
            </ul>
          </section>
        )}

        {/* Paused */}
        {paused.length > 0 && (
          <section className="mt-6">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
              En pause
            </p>
            <ul className="space-y-2">
              {paused.map((q) => (
                <QuestRow key={q.id} quest={q} onOpen={() => setEditing(q)} />
              ))}
            </ul>
          </section>
        )}

        {/* Done */}
        {done.length > 0 && (
          <section className="mt-6">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
              Terminées
            </p>
            <ul className="space-y-2">
              {done.map((q) => (
                <QuestRow key={q.id} quest={q} onOpen={() => setEditing(q)} />
              ))}
            </ul>
          </section>
        )}

        {editing && (
          <QuestActions
            quest={editing}
            onClose={() => setEditing(null)}
            onMakeFocus={() => makeFocus(editing)}
            onUnfocus={() => unfocus(editing)}
            onSetStatus={(s) => setStatus(editing, s)}
            onDelete={() => deleteQuest(editing)}
          />
        )}
      </div>
    </div>
  );
}

function FocusCard({ quest, onOpen }: { quest: Quest; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="from-primary/15 via-card to-card border-primary/30 relative w-full overflow-hidden rounded-3xl border bg-gradient-to-br p-6 text-left"
    >
      <div className="bg-primary/10 absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <Target className="text-primary h-4 w-4" />
          <p className="text-primary text-[10px] font-semibold tracking-[0.2em] uppercase">
            Focus principal
          </p>
        </div>
        <h2 className="text-foreground text-2xl leading-tight font-bold">{quest.title}</h2>
        <p className="text-muted-foreground mt-2 text-xs">Tape pour gérer cette quête</p>
      </div>
    </button>
  );
}

function QuestRow({ quest, onOpen }: { quest: Quest; onOpen: () => void }) {
  const [pressing, setPressing] = useState(false);
  const longPress = useLongPress(() => {
    setPressing(false);
    onOpen();
  }, 400);

  const isDone = quest.status === "done";
  const isPaused = quest.status === "paused";

  return (
    <li>
      <button
        onClick={onOpen}
        onTouchStart={(e) => {
          setPressing(true);
          longPress.onTouchStart(e);
        }}
        onTouchEnd={() => {
          setPressing(false);
          longPress.onTouchEnd();
        }}
        onTouchMove={() => {
          setPressing(false);
          longPress.onTouchMove();
        }}
        onTouchCancel={() => {
          setPressing(false);
          longPress.onTouchCancel();
        }}
        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
          pressing
            ? "border-primary/40 bg-primary/5 scale-[0.98]"
            : "border-border bg-card hover:border-primary/30"
        } ${isDone ? "opacity-60" : ""}`}
      >
        {isDone ? (
          <Check className="text-primary h-4 w-4 shrink-0" />
        ) : isPaused ? (
          <Pause className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <Compass className="text-primary/70 h-4 w-4 shrink-0" />
        )}
        <span
          className={`flex-1 text-sm ${
            isDone ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {quest.title}
        </span>
        {!isDone && (
          <span className="text-muted-foreground/60 text-[10px] tracking-wider uppercase">
            {STATUS_LABELS[quest.status]}
          </span>
        )}
      </button>
    </li>
  );
}

function QuestActions({
  quest,
  onClose,
  onMakeFocus,
  onUnfocus,
  onSetStatus,
  onDelete,
}: {
  quest: Quest;
  onClose: () => void;
  onMakeFocus: () => void;
  onUnfocus: () => void;
  onSetStatus: (s: QuestStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-border bg-card w-full max-w-md rounded-t-2xl border p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-0.5 text-[10px] font-semibold tracking-widest uppercase">
              {quest.is_focus ? "Focus principal" : STATUS_LABELS[quest.status]}
            </p>
            <h2 className="text-foreground text-lg leading-tight font-bold">{quest.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Focus toggle */}
          {quest.status === "active" &&
            (quest.is_focus ? (
              <ActionButton
                onClick={onUnfocus}
                icon={<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                label="Retirer du focus principal"
              />
            ) : (
              <ActionButton
                onClick={onMakeFocus}
                icon={<Target className="text-primary h-4 w-4" />}
                label="Définir comme focus principal"
                hint="Remplacera automatiquement la précédente"
              />
            ))}

          {/* Status changes */}
          {quest.status !== "active" && (
            <ActionButton
              onClick={() => onSetStatus("active")}
              icon={<Play className="text-primary h-4 w-4" />}
              label="Réactiver"
            />
          )}
          {quest.status === "active" && (
            <ActionButton
              onClick={() => onSetStatus("paused")}
              icon={<Pause className="text-muted-foreground h-4 w-4" />}
              label="Mettre en pause"
            />
          )}
          {quest.status !== "done" && (
            <ActionButton
              onClick={() => onSetStatus("done")}
              icon={<Check className="text-primary h-4 w-4" />}
              label="Marquer comme terminée"
            />
          )}

          {/* Delete */}
          <div className="bg-border my-2 h-px" />
          <ActionButton
            onClick={onDelete}
            icon={<X className="text-destructive h-4 w-4" />}
            label="Supprimer"
            danger
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  hint,
  danger,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
        danger
          ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive"
          : "border-border bg-background hover:bg-card text-foreground"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-muted-foreground mt-0.5 text-xs">{hint}</p>}
      </div>
    </button>
  );
}
