"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { blockedOffline, cachedRead, isOffline } from "@/lib/offline";
import { type AgentMessage, stripMarkdown } from "@/lib/messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MessageBody from "@/components/MessageBody";
import { Inbox, Trash2, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function MessageList() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const { data } = await cachedRead<AgentMessage[]>("messages", () =>
        getSupabase()
          .from("agent_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200)
      );
      setMessages(data ?? []);
      setLoading(false);
    }
    fetchMessages();
  }, []);

  const unread = messages.filter((m) => !m.read);

  async function toggleExpanded(id: string, message: AgentMessage) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    if (!message.read && !isOffline()) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      await getSupabase().from("agent_messages").update({ read: true }).eq("id", id);
    }
  }

  async function deleteMessage(id: string) {
    if (blockedOffline()) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await getSupabase().from("agent_messages").delete().eq("id", id);
  }

  async function markAllRead() {
    if (unread.length === 0) return;
    if (blockedOffline()) return;
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    await getSupabase()
      .from("agent_messages")
      .update({ read: true })
      .in(
        "id",
        unread.map((m) => m.id)
      );
  }

  async function clearAll() {
    if (blockedOffline()) return;
    if (!confirm("Supprimer tous les messages ?")) return;
    setMessages([]);
    await getSupabase()
      .from("agent_messages")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
  }

  return (
    <div className="bg-background flex-1 px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
              Messages
            </p>
            <h1 className="text-foreground text-3xl font-bold">Boîte de réception</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {loading
                ? "Chargement..."
                : unread.length > 0
                  ? `${unread.length} non lu${unread.length > 1 ? "s" : ""}`
                  : "Tout est à jour"}
            </p>
          </div>
          {messages.length > 0 && (
            <div className="flex shrink-0 gap-1">
              {unread.length > 0 && (
                <Button size="sm" variant="ghost" onClick={markAllRead}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={clearAll}>
                <Trash2 className="text-muted-foreground/60 hover:text-destructive h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-muted-foreground flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && messages.length === 0 && (
          <div className="py-16 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Inbox className="text-primary h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-sm">
              Aucun message pour l&apos;instant.
              <br />
              Tes agents peuvent poster ici via l&apos;API.
            </p>
          </div>
        )}

        {/* Messages */}
        {!loading && messages.length > 0 && (
          <ul className="space-y-2">
            {messages.map((m) => (
              <MessageItem
                key={m.id}
                message={m}
                expanded={expanded.has(m.id)}
                onToggle={() => toggleExpanded(m.id, m)}
                onDelete={() => deleteMessage(m.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MessageItem({
  message,
  expanded,
  onToggle,
  onDelete,
}: {
  message: AgentMessage;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const date = new Date(message.created_at);
  const dateLabel = formatRelative(date);

  return (
    <li
      className={`rounded-xl border transition-colors ${
        message.read ? "border-border bg-card" : "border-primary/30 bg-primary/5"
      }`}
    >
      <button onClick={onToggle} className="flex w-full items-start gap-3 p-4 text-left">
        {!message.read && (
          <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" aria-label="non lu" />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] tracking-wider uppercase">
              {message.source}
            </Badge>
            <span className="text-muted-foreground text-xs">{dateLabel}</span>
          </div>
          {message.title && (
            <p
              className={`mb-0.5 truncate text-sm ${
                message.read ? "text-foreground/80" : "text-foreground font-semibold"
              }`}
            >
              {message.title}
            </p>
          )}
          {expanded ? (
            <MessageBody>{message.body}</MessageBody>
          ) : (
            <p
              className={`line-clamp-2 text-sm ${
                message.read ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {stripMarkdown(message.body)}
            </p>
          )}
        </div>

        <span className="text-muted-foreground/40 mt-1 shrink-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {expanded && (
        <div className="border-border/50 flex items-center justify-end gap-2 border-t px-4 py-2">
          {message.metadata && Object.keys(message.metadata).length > 0 && (
            <pre className="text-muted-foreground/70 bg-background/50 mr-auto overflow-x-auto rounded p-2 text-[10px]">
              {JSON.stringify(message.metadata, null, 2)}
            </pre>
          )}
          <button
            onClick={onDelete}
            className="text-muted-foreground/60 hover:text-destructive flex items-center gap-1 text-xs"
          >
            <Trash2 className="h-3 w-3" />
            Supprimer
          </button>
        </div>
      )}
    </li>
  );
}

function formatRelative(d: Date): string {
  const now = Date.now();
  const diffSec = Math.floor((now - d.getTime()) / 1000);
  if (diffSec < 60) return "à l'instant";
  if (diffSec < 3600) return `il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `il y a ${Math.floor(diffSec / 3600)} h`;
  if (diffSec < 7 * 86400) return `il y a ${Math.floor(diffSec / 86400)} j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
