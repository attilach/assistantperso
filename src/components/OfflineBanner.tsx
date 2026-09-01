"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";
import { isOffline, onBlockedWrite } from "@/lib/offline";

function subscribeToNetwork(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** Le serveur ne connaît pas l'état réseau du client : on rend « en ligne ». */
const serverSnapshot = () => false;

export default function OfflineBanner() {
  const offline = useSyncExternalStore(subscribeToNetwork, isOffline, serverSnapshot);
  const [blocked, setBlocked] = useState(false);
  const blockedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return onBlockedWrite(() => {
      setBlocked(true);
      if (blockedTimer.current) clearTimeout(blockedTimer.current);
      blockedTimer.current = setTimeout(() => setBlocked(false), 4000);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (blockedTimer.current) clearTimeout(blockedTimer.current);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className={`flex shrink-0 items-center justify-center gap-2 py-1.5 pr-14 pl-4 text-xs font-medium transition-colors ${
        blocked ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
      }`}
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>
        {blocked
          ? "Hors ligne — modification impossible, elle n'a pas été enregistrée."
          : "Hors ligne — dernier état connu, consultation uniquement."}
      </span>
    </div>
  );
}
