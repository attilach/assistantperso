"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase, type Task } from "@/lib/supabase";
import { DAYS_LONG, isScheduledToday, todayDateStr, todayDow, type Routine } from "@/lib/routines";
import { stripMarkdown, type AgentMessage } from "@/lib/messages";
import { CheckSquare, Repeat, Inbox, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [todayRoutines, setTodayRoutines] = useState<Routine[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [unreadMessages, setUnreadMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const sb = getSupabase();
      const today = todayDateStr();
      const [tasksRes, routinesRes, completionsRes, messagesRes] = await Promise.all([
        sb
          .from("tasks")
          .select("*")
          .eq("completed", false)
          .order("created_at", { ascending: false }),
        sb.from("routines").select("*").eq("active", true),
        sb.from("routine_completions").select("routine_id").eq("completed_date", today),
        sb
          .from("agent_messages")
          .select("*")
          .eq("read", false)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);
      setPendingTasks(tasksRes.data ?? []);
      setTodayRoutines((routinesRes.data ?? []).filter(isScheduledToday));
      setCompletedToday(new Set((completionsRes.data ?? []).map((c) => c.routine_id)));
      setUnreadMessages(messagesRes.data ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const dateLabel = DAYS_LONG[todayDow()];
  const todayDoneCount = todayRoutines.filter((r) => completedToday.has(r.id)).length;
  const remainingRoutines = todayRoutines.filter((r) => !completedToday.has(r.id));
  const allDone =
    !loading &&
    pendingTasks.length === 0 &&
    remainingRoutines.length === 0 &&
    unreadMessages.length === 0;

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Aujourd&apos;hui
          </p>
          <h1 className="text-foreground text-3xl font-bold capitalize">{dateLabel}</h1>
          {!loading && (
            <p className="text-muted-foreground mt-1 text-sm">
              {allDone ? "Tout est sous contrôle ✨" : "Voici ton aperçu du jour"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-muted-foreground flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : allDone ? (
          <div className="border-border bg-card/50 rounded-2xl border border-dashed p-10 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
              <Sparkles className="text-primary h-7 w-7" />
            </div>
            <p className="text-foreground mb-1 text-sm font-medium">Rien à faire</p>
            <p className="text-muted-foreground text-xs">
              Aucune tâche, routine ou message en attente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Routines */}
            <DashCard
              href="/routines"
              icon={Repeat}
              iconColor="text-orange-400"
              iconBg="bg-orange-400/10"
              title="Routines"
              stat={`${todayDoneCount} / ${todayRoutines.length}`}
              statHint={todayRoutines.length === 0 ? "rien aujourd'hui" : "accomplies"}
            >
              {todayRoutines.length === 0 ? (
                <p className="text-muted-foreground text-xs">
                  Pas de routine prévue pour {dateLabel}.
                </p>
              ) : remainingRoutines.length === 0 ? (
                <p className="text-primary text-xs font-medium">
                  Tout est fait pour aujourd&apos;hui 🎉
                </p>
              ) : (
                <ul className="space-y-1">
                  {remainingRoutines.slice(0, 3).map((r) => (
                    <li key={r.id} className="text-muted-foreground truncate text-xs">
                      • {r.title}
                      {r.time_of_day && (
                        <span className="text-muted-foreground/60 ml-1">
                          {r.time_of_day.slice(0, 5)}
                        </span>
                      )}
                    </li>
                  ))}
                  {remainingRoutines.length > 3 && (
                    <li className="text-muted-foreground/60 text-xs">
                      +{remainingRoutines.length - 3} autre{remainingRoutines.length > 4 ? "s" : ""}
                    </li>
                  )}
                </ul>
              )}
            </DashCard>

            {/* Tâches */}
            <DashCard
              href="/tasks"
              icon={CheckSquare}
              iconColor="text-sky-400"
              iconBg="bg-sky-400/10"
              title="Tâches"
              stat={`${pendingTasks.length}`}
              statHint={
                pendingTasks.length === 0
                  ? "rien"
                  : pendingTasks.length > 1
                    ? "en attente"
                    : "en attente"
              }
            >
              {pendingTasks.length === 0 ? (
                <p className="text-primary text-xs font-medium">Tu es à jour 🎉</p>
              ) : (
                <ul className="space-y-1">
                  {pendingTasks.slice(0, 3).map((t) => (
                    <li key={t.id} className="text-muted-foreground truncate text-xs">
                      • {t.title}
                    </li>
                  ))}
                  {pendingTasks.length > 3 && (
                    <li className="text-muted-foreground/60 text-xs">
                      +{pendingTasks.length - 3} autre{pendingTasks.length > 4 ? "s" : ""}
                    </li>
                  )}
                </ul>
              )}
            </DashCard>

            {/* Messages */}
            <DashCard
              href="/messages"
              icon={Inbox}
              iconColor="text-violet-400"
              iconBg="bg-violet-400/10"
              title="Messages"
              stat={`${unreadMessages.length}`}
              statHint={
                unreadMessages.length === 0
                  ? "lus"
                  : "non lu" + (unreadMessages.length > 1 ? "s" : "")
              }
            >
              {unreadMessages.length === 0 ? (
                <p className="text-muted-foreground text-xs">Aucun message non lu.</p>
              ) : (
                <ul className="space-y-1.5">
                  {unreadMessages.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-xs">
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[9px] tracking-wider uppercase"
                      >
                        {m.source}
                      </Badge>
                      <span className="text-muted-foreground truncate">
                        {m.title ?? stripMarkdown(m.body).slice(0, 60)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </DashCard>
          </div>
        )}
      </div>
    </div>
  );
}

function DashCard({
  href,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  stat,
  statHint,
  children,
}: {
  href: string;
  icon: typeof CheckSquare;
  iconColor: string;
  iconBg: string;
  title: string;
  stat: string;
  statHint: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="border-border bg-card hover:border-primary/30 block rounded-2xl border p-4 transition-colors"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold">{title}</p>
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground font-medium">{stat}</span> {statHint}
          </p>
        </div>
        <ChevronRight className="text-muted-foreground/40 h-4 w-4" />
      </div>
      <div className="pl-12">{children}</div>
    </Link>
  );
}
