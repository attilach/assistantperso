"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker au démarrage. Il était jusqu'ici enregistré
 * uniquement à l'activation des notifications, donc le cache hors ligne
 * n'existait pas tant qu'on n'y avait pas touché.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Pas de service worker (navigation privée, réglage bloquant) :
      // l'app fonctionne normalement, sans le mode hors ligne.
    });
  }, []);

  return null;
}
