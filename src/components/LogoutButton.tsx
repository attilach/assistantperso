"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={busy}
      className="border-border bg-card hover:border-destructive/30 flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors"
    >
      <div>
        <p className="text-foreground text-sm font-medium">Se déconnecter</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Re-demandera le code sur cet appareil
        </p>
      </div>
      {busy ? (
        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="text-destructive/70 h-4 w-4" />
      )}
    </button>
  );
}
