/**
 * Ratenbegrenzung im Arbeitsspeicher.
 *
 * BEWUSSTE GRENZE: Der Zähler lebt im Prozess. Läuft die Anwendung in mehreren
 * Containern, hat jeder seinen eigenen — die effektive Grenze ist dann
 * `limit × Anzahl Instanzen`. Für ein Kontaktformular auf einer Portfolioseite
 * mit genau einer Instanz ist das die richtige Größe: Redis dafür zu betreiben
 * wäre mehr Betriebsaufwand als Nutzen.
 *
 * Steht hier, damit die Entscheidung nachlesbar ist und nicht später jemand
 * (auch ich) annimmt, das sei verteilt.
 */

interface Bucket {
  /** Zeitstempel der Anfragen innerhalb des Fensters. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/**
 * Aufräumen: Ohne das wüchse die Map bei jedem neuen Absender weiter, bis der
 * Prozess neu startet. Wird bei jedem Aufruf mitgemacht statt per Intervall —
 * ein Timer würde den Node-Prozess unnötig wachhalten.
 */
function sweep(now: number, windowMs: number): void {
  for (const [key, bucket] of buckets) {
    const alive = bucket.hits.filter((time) => now - time < windowMs);
    if (alive.length === 0) buckets.delete(key);
    else bucket.hits = alive;
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Sekunden bis zum nächsten erlaubten Versuch. Nur bei `allowed === false`. */
  retryAfter: number;
}

/**
 * Gleitendes Fenster. Anders als ein festes Fenster erlaubt es nicht, an der
 * Stundengrenze die doppelte Menge durchzuschieben.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  sweep(now, windowMs);

  const bucket = buckets.get(key) ?? { hits: [] };
  const recent = bucket.hits.filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  recent.push(now);
  buckets.set(key, { hits: recent });
  return { allowed: true, retryAfter: 0 };
}

/** Nur für Tests: setzt den Zustand zurück. */
export function resetRateLimit(): void {
  buckets.clear();
}
