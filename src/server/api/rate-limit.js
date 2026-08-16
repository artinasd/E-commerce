const buckets = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.startedAt >= windowMs) {
    const bucket = { startedAt: now, count: 1 };
    buckets.set(key, bucket);
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((windowMs - (now - existing.startedAt)) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

export function resetRateLimit(key) {
  buckets.delete(key);
}

setInterval(() => {
  const cutoff = Date.now() - CLEANUP_INTERVAL_MS;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.startedAt < cutoff) buckets.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref?.();
