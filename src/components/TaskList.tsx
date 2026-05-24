"use client";

import { useEffect, useState, useTransition } from "react";
import { getSupabase, type Task } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Plus, Trash2, Loader2 } from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data } = await getSupabase()
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    setTasks(data ?? []);
    setLoading(false);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle("");

    const { data } = await getSupabase()
      .from("tasks")
      .insert({ title })
      .select()
      .single();

    if (data) setTasks((prev) => [data, ...prev]);
  }

  async function toggleTask(task: Task) {
    const updated = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: updated } : t))
    );
    await getSupabase()
      .from("tasks")
      .update({ completed: updated })
      .eq("id", task.id);
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await getSupabase().from("tasks").delete().eq("id", id);
  }

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            Assistant Perso
          </p>
          <h1 className="text-3xl font-bold text-foreground">Mes tâches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pending.length} tâche{pending.length !== 1 ? "s" : ""} à faire
          </p>
        </div>

        {/* Add task form */}
        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={!newTitle.trim() || isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span className="text-sm">Chargement...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Aucune tâche pour l&apos;instant.<br />Ajoute ta première tâche ci-dessus.
            </p>
          </div>
        )}

        {/* Pending tasks */}
        {!loading && pending.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
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
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs font-medium">
                {completed.length}
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Terminées
              </span>
            </div>
            <ul className="space-y-2">
              {completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
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
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="group flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 transition-all hover:border-primary/30 hover:bg-card/80">
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

      <span
        className={`flex-1 text-sm transition-all ${
          task.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
