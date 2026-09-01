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

// Page servie quand une navigation hors ligne ne trouve rien en cache. Servir
// l'accueil à la place donnerait l'illusion d'une app bloquée sur une page.
const OFFLINE_PAGE = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Hors ligne</title>
<style>
  body{margin:0;min-height:100dvh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:.75rem;padding:2rem;text-align:center;background:#020617;
    color:#f8fafc;font:400 15px/1.5 system-ui,-apple-system,sans-serif}
  h1{font-size:1.1rem;font-weight:600;margin:0}
  p{margin:0;color:#94a3b8;font-size:.875rem;max-width:22rem}
  a{margin-top:.5rem;color:#22c55e;font-weight:600;text-decoration:none;font-size:.875rem}
</style></head>
<body>
  <h1>Hors ligne</h1>
  <p>Cette page n'a pas encore été enregistrée pour la consultation hors ligne. Ouvre-la une fois avec du réseau et elle sera disponible ensuite.</p>
  <a href="/">Retour à l'accueil</a>
</body></html>`;

async function networkFirst(request) {
  const isNavigation = request.mode === "navigate";
  try {
    const response = await fetch(request);
    await putInCache(request, response);
    return response;
  } catch (err) {
    // Sur une navigation, les paramètres d'URL (?tab=recipes) ne doivent pas
    // empêcher de servir le document : la page les relit côté client.
    const cached = await caches.match(request, { ignoreSearch: isNavigation });
    if (cached) return cached;
    if (isNavigation) {
      return new Response(OFFLINE_PAGE, {
        status: 503,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
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
