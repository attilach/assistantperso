// Service worker : notifications Web Push + cache hors ligne (lecture seule)

const CACHE = "assistantperso-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Purge les caches des versions précédentes.
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

async function putInCache(request, response) {
  // Une réponse issue d'une redirection ne peut pas être rejouée sur une
  // navigation : le navigateur la refuse. On ne garde que les 200 directs.
  if (!response.ok || response.redirected) return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response.clone());
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await putInCache(request, response);
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    await putInCache(request, response);
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Page jamais visitée : on ouvre sur le tableau de bord s'il est en cache.
    if (request.mode === "navigate") {
      const home = await caches.match("/");
      if (home) return home;
    }
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Supabase et tout autre domaine : jamais interceptés.
  if (url.origin !== self.location.origin) return;
  // Routes serveur (auth, cron, push) : jamais mises en cache.
  if (url.pathname.startsWith("/api/")) return;
  // Charges utiles RSC des navigations <Link> : les laisser échouer hors ligne
  // fait basculer Next sur une navigation complète, que l'on sait servir.
  if (url.searchParams.has("_rsc") || request.headers.get("RSC") === "1") return;

  // Bundles hashés par le build : immuables, donc cache d'abord.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

self.addEventListener("push", (event) => {
  let data = { title: "Assistant Perso", body: "Tu as une notification" };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon",
      badge: "/icon",
      tag: data.tag || "default",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
