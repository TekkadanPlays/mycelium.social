// ---------------------------------------------------------------------------
// TTL Cache — In-memory LRU-ish cache with time-to-live expiration
// ---------------------------------------------------------------------------
// Sits in front of SQLite for hot data (profiles, relay lists).
// Prevents repeated disk reads for the same pubkey within a short window.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TTLCache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private cleanupInterval: ReturnType<typeof setInterval>;
  private maxSize: number;

  constructor(
    private defaultTTL: number = 60_000,
    maxSize = 10_000,
  ) {
    this.maxSize = maxSize;
    // Periodic cleanup of expired entries
    this.cleanupInterval = setInterval(() => this.cleanup(), defaultTTL);
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V, ttl?: number): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl ?? this.defaultTTL),
    });
  }

  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  get size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}
