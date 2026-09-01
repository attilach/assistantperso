"use client";

import { useEffect } from "react";
import { precacheRoutes } from "@/lib/offline";

/** Les écrans principaux, à garder consultables sans réseau. */
const CORE_ROUTES = ["/", "/tasks", "/routines", "/quetes", "/cuisine", "/messages", "/settings"];

/**
 * Enregistre le service worker au démarrage. Il était jusqu'ici enregistré
 * uniquement à l'activation des notifications, donc le cache hors ligne
 * n'existait pas tant qu'on n'y avait pas touché.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        // Différé : le préchargement ne doit pas concurrencer le premier rendu.
        setTimeout(() => {
          if (!cancelled) precacheRoutes(CORE_ROUTES);
        }, 2000);
      })
      .catch(() => {
        // Pas de service worker (navigation privée, réglage bloquant) :
        // l'app fonctionne normalement, sans le mode hors ligne.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
