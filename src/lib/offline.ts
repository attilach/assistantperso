/**
 * Support hors ligne — lecture seule.
 *
 * L'app garde en cache le dernier état connu de chaque écran pour rester
 * consultable sans réseau. Les écritures, elles, sont bloquées : elles ne
 * peuvent pas être rejouées plus tard, donc les laisser passer ferait mentir
 * l'interface (une tâche cochée qui disparaît au rechargement).
 */

const CACHE_PREFIX = "assistantperso:cache:v1:";

export function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/** Rejetée par le client Supabase dès qu'une requête part sans réseau. */
export class OfflineError extends Error {
  constructor() {
    super("Hors ligne");
    this.name = "OfflineError";
  }
}

/** L'enveloppe permet de distinguer « rien en cache » de « null mis en cache ». */
type Entry<T> = { v: T };

function readEntry<T>(key: string): Entry<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as Entry<T>) : null;
  } catch {
    return null;
  }
}

function writeEntry<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ v: value } satisfies Entry<T>)
    );
  } catch {
    // Quota dépassé ou stockage refusé : le cache est un confort, pas une garantie.
  }
}

/**
 * Exécute une lecture Supabase et mémorise son résultat. Si la requête échoue
 * (réseau coupé, Supabase injoignable), renvoie le dernier état connu.
 * `stale` indique que la donnée vient du cache et peut être périmée.
 */
export async function cachedRead<T>(
  key: string,
  run: () => PromiseLike<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; stale: boolean }> {
  // Sans réseau, on sert le cache immédiatement. Interroger Supabase quand même
  // coûtait plusieurs secondes d'attente avant l'échec, pendant lesquelles
  // l'écran restait vide alors que la donnée était déjà là.
  if (isOffline()) {
    const cached = readEntry<T | null>(key);
    return { data: cached ? cached.v : null, stale: cached !== null };
  }

  try {
    const { data, error } = await run();
    if (error) throw error;
    writeEntry<T | null>(key, data ?? null);
    return { data: data ?? null, stale: false };
  } catch {
    const cached = readEntry<T | null>(key);
    if (!cached) return { data: null, stale: false };
    return { data: cached.v, stale: true };
  }
}

type Listener = () => void;
const blockedListeners = new Set<Listener>();

/** Le bandeau s'abonne pour signaler une modification refusée. */
export function onBlockedWrite(cb: Listener): () => void {
  blockedListeners.add(cb);
  return () => {
    blockedListeners.delete(cb);
  };
}

/**
 * À appeler en tête de chaque mutation : renvoie true quand l'action doit être
 * abandonnée faute de réseau, et prévient l'utilisateur au passage.
 */
export function blockedOffline(): boolean {
  if (!isOffline()) return false;
  for (const cb of blockedListeners) cb();
  return true;
}
