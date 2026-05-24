"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(currentPin: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: currentPin }),
      });
      if (!res.ok) {
        setError("Code incorrect");
        setPin("");
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError(null);
    if (value.length === 4) {
      submit(value);
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
      <div className="w-full max-w-xs">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <Lock className="text-primary h-7 w-7" />
          </div>
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Assistant Perso
          </p>
          <h1 className="text-foreground text-2xl font-bold">Entre ton code</h1>
          <p className="text-muted-foreground mt-1 text-sm">4 chiffres pour déverrouiller</p>
        </div>

        <div className="mb-3 flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold transition-all ${
                pin.length > i
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground"
              } ${error ? "border-destructive/50" : ""}`}
            >
              {pin.length > i ? "●" : ""}
            </div>
          ))}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoFocus
          value={pin}
          onChange={handleChange}
          disabled={busy}
          aria-label="Code PIN"
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="text-muted-foreground hover:text-foreground mx-auto block text-xs underline-offset-2 hover:underline"
        >
          {busy ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Vérification...
            </span>
          ) : error ? (
            <span className="text-destructive">{error} — touche ici pour réessayer</span>
          ) : (
            "Touche ici si le clavier ne s'ouvre pas"
          )}
        </button>
      </div>
    </div>
  );
}
