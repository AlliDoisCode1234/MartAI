/**
 * Frontend Cache Utility
 *
 * Simple in-memory cache for expensive computations and API responses.
 * Useful for caching derived data that doesn't need real-time updates.
 */

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class FrontendCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number = 100;

  /**
   * Get a cached value
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Set a cached value
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Get or compute a value
   * If cached and not expired, returns cached value.
   * Otherwise, calls the factory function and caches the result.
   */
  async getOrCompute<T>(
    key: string,
    factory: () => T | Promise<T>,
    ttlMs: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttlMs);
    return value;
  }

  /**
   * Invalidate a specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all keys matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }
}

// Singleton instance
export const frontendCache = new FrontendCache();

// Cache key helpers
export const cacheKeys = {
  project: (projectId: string) => `project:${projectId}`,
  mrScore: (projectId: string) => `mrScore:${projectId}`,
  insights: (projectId: string) => `insights:${projectId}`,
  clusters: (projectId: string) => `clusters:${projectId}`,
  keywords: (projectId: string) => `keywords:${projectId}`,
};

// Cache TTL constants (in ms)
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  HOUR: 60 * 60 * 1000, // 1 hour
};
