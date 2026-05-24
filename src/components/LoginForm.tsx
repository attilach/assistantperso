"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code }),
      });
      if (!res.ok) {
        setError("Code incorrect");
        setCode("");
        inputRef.current?.focus();
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center justify-center px-4"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <form onSubmit={submit} className="w-full max-w-xs">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <Lock className="text-primary h-7 w-7" />
          </div>
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Assistant Perso
          </p>
          <h1 className="text-foreground text-2xl font-bold">Entre ton code</h1>
        </div>

        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type={showCode ? "text" : "password"}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              disabled={busy}
              autoComplete="current-password"
              autoFocus
              aria-label="Code d'accès"
              placeholder="••••••••"
              className={`bg-card text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary w-full rounded-xl border px-4 py-3 text-center font-mono text-lg tracking-widest outline-none focus-visible:ring-2 ${
                error ? "border-destructive/50" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="text-muted-foreground/60 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              tabIndex={-1}
              aria-label={showCode ? "Masquer" : "Afficher"}
            >
              {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!code.trim() || busy}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Déverrouiller"}
        </button>

        {error && <p className="text-destructive mt-3 text-center text-xs">{error}</p>}
      </form>
    </div>
  );
}
