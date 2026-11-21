/**
 * Límite de intentos en memoria (ventana deslizante). Suficiente para un único proceso Node
 * (Hostinger); si se escala a varias instancias habría que moverlo a una BD/Redis.
 */
const buckets = new Map<string, number[]>();
let lastSweep = 0;

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (now - lastSweep > 60_000) {
    lastSweep = now;
    for (const [k, hits] of buckets) if (!hits.some((t) => now - t < windowMs * 4)) buckets.delete(k);
  }
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000)) };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfterSec: 0 };
}

/** IP del cliente tras el proxy de Hostinger. */
export function clientIp(headers: { get(name: string): string | null }): string {
  return (headers.get("x-forwarded-for")?.split(",")[0] || headers.get("x-real-ip") || "unknown").trim();
}

/**
 * Variante para login: solo cuentan los intentos FALLIDOS (un acierto limpia el contador),
 * y consultar el estado no consume intentos.
 */
const failures = new Map<string, number[]>();

export function failuresLocked(key: string, max: number, windowMs: number): { locked: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hits = (failures.get(key) ?? []).filter((t) => now - t < windowMs);
  failures.set(key, hits);
  if (hits.length >= max) return { locked: true, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000)) };
  return { locked: false, retryAfterSec: 0 };
}

export function recordFailure(key: string): void {
  const hits = failures.get(key) ?? [];
  hits.push(Date.now());
  failures.set(key, hits);
}

export function clearFailures(key: string): void {
  failures.delete(key);
}
