"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Send, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPushState,
  subscribeToPush,
  unsubscribeFromPush,
  sendTestNotification,
  type PushState,
} from "@/lib/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

export default function NotificationToggle() {
  const [state, setState] = useState<PushState | "loading">("loading");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getPushState().then(setState);
  }, []);

  async function enable() {
    setBusy(true);
    setMsg(null);
    try {
      await subscribeToPush(VAPID_PUBLIC_KEY);
      setState("subscribed");
      setMsg("Notifications activées");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setMsg(null);
    try {
      await unsubscribeFromPush();
      setState("default");
      setMsg("Notifications désactivées");
    } catch {
      setMsg("Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await sendTestNotification();
      setMsg(`Envoyé : ${res.sent} / ${res.sent + res.failed}`);
    } catch {
      setMsg("Échec d'envoi");
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") return null;

  if (state === "unsupported") {
    return (
      <Banner tone="muted" icon={<BellOff className="h-4 w-4" />}>
        Notifications non supportées sur ce navigateur.
      </Banner>
    );
  }

  if (state === "needs-install") {
    return (
      <Banner tone="muted" icon={<Smartphone className="h-4 w-4" />}>
        Sur iPhone, ajoute d&apos;abord l&apos;app à l&apos;écran d&apos;accueil (bouton Partager → &quot;Sur
        l&apos;écran d&apos;accueil&quot;) puis ouvre-la depuis l&apos;icône.
      </Banner>
    );
  }

  if (state === "denied") {
    return (
      <Banner tone="warn" icon={<BellOff className="h-4 w-4" />}>
        Notifications bloquées. Active-les dans Réglages → Safari → Notifications.
      </Banner>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Bell className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Notifications push</span>
        </div>

        {state === "default" ? (
          <Button
            size="sm"
            onClick={enable}
            disabled={busy}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Activer"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={test}
              disabled={busy}
              className="gap-1.5"
            >
              {busy ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Tester
                </>
              )}
            </Button>
            <Button size="sm" variant="ghost" onClick={disable} disabled={busy}>
              Désactiver
            </Button>
          </div>
        )}
      </div>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}

function Banner({
  tone,
  icon,
  children,
}: {
  tone: "muted" | "warn";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "warn"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-border bg-card text-muted-foreground";
  return (
    <div className={`mb-6 flex items-start gap-2 rounded-xl border px-4 py-3 text-xs ${toneClass}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span className="flex-1 leading-relaxed">{children}</span>
    </div>
  );
}
