function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export type PushState =
  | "unsupported"
  | "needs-install"
  | "denied"
  | "default"
  | "subscribed";

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari sets navigator.standalone, others use display-mode
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function getPushState(): Promise<PushState> {
  if (!isPushSupported()) return "unsupported";

  // On iOS Safari, push only works when installed to home screen
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS && !isStandalone()) return "needs-install";

  if (Notification.permission === "denied") return "denied";

  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (sub) return "subscribed";

  return "default";
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  return reg;
}

export async function subscribeToPush(publicKey: string): Promise<PushSubscription> {
  const reg = await registerServiceWorker();
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Permission refusée");

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const json = sub.toJSON();
  const res = await fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: json.keys,
    }),
  });

  if (!res.ok) {
    await sub.unsubscribe();
    throw new Error("Échec d'enregistrement côté serveur");
  }
  return sub;
}

export async function unsubscribeFromPush(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  await fetch("/api/notifications/subscribe", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
}

export async function sendTestNotification(): Promise<{ sent: number; failed: number }> {
  const res = await fetch("/api/notifications/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Assistant Perso",
      body: "Test réussi 🎉 Tes notifications fonctionnent !",
    }),
  });
  if (!res.ok) throw new Error("Échec d'envoi");
  return res.json();
}
