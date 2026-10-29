export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window ends. */
  resetSeconds: number;
};

export type RateLimiter = {
  hit(key: string, now?: number): RateLimitResult;
};

/**
 * Fixed-window limiter kept in process memory. It resets on restart and is not shared between
 * replicas, which matches the single-container deployment (see README).
 */
export function createRateLimiter({ windowMs, limit }: { windowMs: number; limit: number }): RateLimiter {
  const windows = new Map<string, { count: number; resetAt: number }>();

  return {
    hit(key, now = Date.now()) {
      if (windows.size >= 1000) {
        for (const [storedKey, entry] of windows) if (entry.resetAt <= now) windows.delete(storedKey);
      }
      let entry = windows.get(key);
      if (!entry || entry.resetAt <= now) {
        entry = { count: 0, resetAt: now + windowMs };
        windows.set(key, entry);
      }
      entry.count += 1;
      return {
        allowed: entry.count <= limit,
        limit,
        remaining: Math.max(0, limit - entry.count),
        resetSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      };
    },
  };
}
