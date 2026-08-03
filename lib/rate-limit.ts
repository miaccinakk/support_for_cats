/**
 * =============================================================================
 *  SIMPLE IN-MEMORY DAILY RATE LIMITER
 * =============================================================================
 *
 *  Pure-code protection (no external services). Tracks how many generations a
 *  given client (identified by IP) has made "today" and blocks after `LIMIT`.
 *  The counter automatically resets at the start of the next calendar day.
 *
 *  Note: state lives in memory, so it resets on server restart / cold start.
 *  For a hobby/demo project this is exactly the lightweight guard we want.
 * =============================================================================
 */

export const DAILY_LIMIT = 5

type Entry = {
  count: number
  /** The day (YYYY-MM-DD) this counter belongs to. */
  day: string
}

// Persist the map across hot reloads in dev by stashing it on globalThis.
const store: Map<string, Entry> =
  (globalThis as any).__catopsRateLimit ?? new Map<string, Entry>()
;(globalThis as any).__catopsRateLimit = store

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export type RateLimitResult = {
  allowed: boolean
  /** Attempts still available AFTER this request (0 when blocked/last). */
  remaining: number
  limit: number
}

/**
 * Registers one attempt for `key`. Returns whether it is allowed and how many
 * attempts remain for the rest of the day.
 */
export function consumeRateLimit(key: string): RateLimitResult {
  const day = today()
  const entry = store.get(key)

  // First request of the day (or a brand new client) — reset the counter.
  if (!entry || entry.day !== day) {
    store.set(key, { count: 1, day })
    return { allowed: true, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT }
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, limit: DAILY_LIMIT }
  }

  entry.count += 1
  store.set(key, entry)
  return { allowed: true, remaining: DAILY_LIMIT - entry.count, limit: DAILY_LIMIT }
}

/** Best-effort client identifier from proxy headers. */
export function getClientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "anonymous"
  )
}
