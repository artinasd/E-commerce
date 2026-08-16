const buckets = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function now() {
  return Date.now();
}

export function checkAuthRateLimit(key) {
  const current = now();
  const bucket = buckets.get(key);

  if (!bucket || current - bucket.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: current, attempts: 1 });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  if (bucket.attempts >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((WINDOW_MS - (current - bucket.startedAt)) / 1000),
    };
  }

  bucket.attempts += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - bucket.attempts, retryAfterSeconds: 0 };
}

export function resetAuthRateLimit(key) {
  buckets.delete(key);
}

setInterval(() => {
  const cutoff = now() - WINDOW_MS;
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.startedAt < cutoff) buckets.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref?.();
