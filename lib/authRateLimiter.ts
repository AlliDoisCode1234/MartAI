const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

type AccountLockEntry = {
  attempts: number;
  lockedUntil: number | null;
};

const ipLimits: Map<string, RateLimitEntry> = new Map();
const accountLocks: Map<string, AccountLockEntry> = new Map();

export function checkRateLimit(ip: string | null | undefined) {
  if (!ip) return { allowed: true };
  const now = Date.now();
  const entry = ipLimits.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    ipLimits.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count += 1;
  return { allowed: true };
}

export function getAccountLock(email: string) {
  const entry = accountLocks.get(email);
  if (!entry) {
    return { locked: false, attempts: 0, lockedUntil: null };
  }

  if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
    return {
      locked: true,
      attempts: entry.attempts,
      lockedUntil: entry.lockedUntil,
    };
  }

  if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    accountLocks.set(email, { attempts: 0, lockedUntil: null });
    return { locked: false, attempts: 0, lockedUntil: null };
  }

  return {
    locked: false,
    attempts: entry.attempts,
    lockedUntil: entry.lockedUntil,
  };
}

export function recordFailedAttempt(email: string) {
  const entry = accountLocks.get(email) || { attempts: 0, lockedUntil: null };
  const attempts = entry.attempts + 1;
  let lockedUntil = entry.lockedUntil;

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    lockedUntil = Date.now() + LOCKOUT_DURATION;
  }

  accountLocks.set(email, { attempts, lockedUntil });

  return {
    attempts,
    locked: !!lockedUntil && lockedUntil > Date.now(),
    lockedUntil,
  };
}

export function clearFailedAttempts(email: string) {
  accountLocks.set(email, { attempts: 0, lockedUntil: null });
}

