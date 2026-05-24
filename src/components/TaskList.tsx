"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase, type Task } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TaskSkeleton from "@/components/TaskSkeleton";
import { Check, Plus, Trash2, AlertCircle, X, Star } from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await getSupabase()
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setTasks(data ?? []);
      } catch {
        setError("Impossible de charger les tâches. Vérifie ta connexion Supabase.");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");

    const optimistic: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      is_focus: false,
      focus_at: null,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [optimistic, ...prev]);

    const { data, error } = await getSupabase().from("tasks").insert({ title }).select().single();

    if (error) {
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      setError("Erreur lors de l'ajout de la tâche.");
    } else if (data) {
      setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? data : t)));
    }
  }

  async function toggleTask(task: Task) {
    const updated = !task.completed;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: updated } : t)));
    await getSupabase().from("tasks").update({ completed: updated }).eq("id", task.id);
  }

  async function updateTitle(task: Task, title: string) {
    const trimmed = title.trim();
    if (!trimmed || trimmed === task.title) return;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, title: trimmed } : t)));
    await getSupabase().from("tasks").update({ title: trimmed }).eq("id", task.id);
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await getSupabase().from("tasks").delete().eq("id", id);
  }

  async function toggleFocus(task: Task) {
    const next = !task.is_focus;
    const focusAt = next ? new Date().toISOString() : null;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_focus: next, focus_at: focusAt } : t))
    );
    await getSupabase()
      .from("tasks")
      .update({ is_focus: next, focus_at: focusAt })
      .eq("id", task.id);
  }

  async function clearCompleted() {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (!completedIds.length) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    await getSupabase().from("tasks").delete().in("id", completedIds);
  }

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Tâches
          </p>
          <h1 className="text-foreground text-3xl font-bold">À faire</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {loading
              ? "Chargement..."
              : `${pending.length} tâche${pending.length !== 1 ? "s" : ""} en attente`}
          </p>
        </div>

        {/* Add task form */}
        <form onSubmit={addTask} className="mb-8 flex gap-2">
          <Input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nouvelle tâche..."
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

        {/* Error state */}
        {error && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}>
              <X className="h-4 w-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        )}

        {/* Skeleton */}
        {loading && <TaskSkeleton />}

        {/* Empty state */}
        {!loading && tasks.length === 0 && !error && (
          <div className="py-16 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Check className="text-primary h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-sm">
              Aucune tâche pour l&apos;instant.
              <br />
              Ajoute ta première tâche ci-dessus.
            </p>
          </div>
        )}

        {/* Pending tasks */}
        {!loading && pending.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {pending.length}
              </Badge>
              <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                À faire
              </span>
            </div>
            <ul className="space-y-2">
              {pending.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onUpdateTitle={updateTitle}
                  onToggleFocus={toggleFocus}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Separator */}
        {!loading && pending.length > 0 && completed.length > 0 && (
          <Separator className="bg-border my-6" />
        )}

        {/* Completed tasks */}
        {!loading && completed.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  {completed.length}
                </Badge>
                <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                  Terminées
                </span>
              </div>
              <button
                onClick={clearCompleted}
                className="text-muted-foreground/60 hover:text-destructive text-xs transition-colors"
              >
                Tout effacer
              </button>
            </div>
            <ul className="space-y-2">
              {completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onUpdateTitle={updateTitle}
                  onToggleFocus={toggleFocus}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdateTitle,
  onToggleFocus,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (task: Task, title: string) => void;
  onToggleFocus: (task: Task) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const editRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(task.title);
    setEditing(true);
    setTimeout(() => editRef.current?.select(), 0);
  }

  function commitEdit() {
    setEditing(false);
    onUpdateTitle(task, draft);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") {
      setDraft(task.title);
      setEditing(false);
    }
  }

  return (
    <li
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
        task.is_focus && !task.completed
          ? "border-yellow-400/40 bg-yellow-400/5"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <button
        onClick={() => onToggle(task)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          task.completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
      >
        {task.completed && <Check className="h-3 w-3" />}
      </button>

      {editing ? (
        <input
          ref={editRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="text-foreground flex-1 bg-transparent text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          title="Double-clic pour modifier"
          className={`flex-1 cursor-text text-sm transition-all select-none ${
            task.completed ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {task.title}
        </span>
      )}

      {!task.completed && (
        <button
          onClick={() => onToggleFocus(task)}
          aria-label={task.is_focus ? "Retirer du focus" : "Marquer comme prioritaire"}
          className={`transition-colors ${
            task.is_focus ? "text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400"
          }`}
        >
          <Star className={`h-4 w-4 ${task.is_focus ? "fill-yellow-400" : ""}`} />
        </button>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground/50 hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
