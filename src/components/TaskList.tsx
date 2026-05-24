"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase, type Task } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TaskSkeleton from "@/components/TaskSkeleton";
import NotificationToggle from "@/components/NotificationToggle";
import { Check, Plus, Trash2, AlertCircle, X } from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

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

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");

    const optimistic: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [optimistic, ...prev]);

    const { data, error } = await getSupabase()
      .from("tasks")
      .insert({ title })
      .select()
      .single();

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

  async function clearCompleted() {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (!completedIds.length) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    await getSupabase().from("tasks").delete().in("id", completedIds);
  }

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Assistant Perso
          </p>
          <h1 className="text-3xl font-bold text-foreground">Mes tâches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Chargement..." : `${pending.length} tâche${pending.length !== 1 ? "s" : ""} à faire`}
          </p>
        </div>

        {/* Notifications */}
        <NotificationToggle />

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
            className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Error state */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
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
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
                />
              ))}
            </ul>
          </div>
        )}

        {/* Separator */}
        {!loading && pending.length > 0 && completed.length > 0 && (
          <Separator className="my-6 bg-border" />
        )}

        {/* Completed tasks */}
        {!loading && completed.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  {completed.length}
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Terminées
                </span>
              </div>
              <button
                onClick={clearCompleted}
                className="text-xs text-muted-foreground/60 transition-colors hover:text-destructive"
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
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (task: Task, title: string) => void;
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
    <li className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/30">
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
          className="flex-1 bg-transparent text-sm text-foreground outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          title="Double-clic pour modifier"
          className={`flex-1 cursor-text select-none text-sm transition-all ${
            task.completed ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {task.title}
        </span>
      )}

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground/50 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
