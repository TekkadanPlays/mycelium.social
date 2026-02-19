import { Relay } from '../../nostr/relay';
import type { NostrEvent } from '../../nostr/event';
import type { NostrFilter } from '../../nostr/filter';
import { getPool } from './relay';
import { getIndexerUrls } from './indexers';

// ---------------------------------------------------------------------------
// Relay Crawler
// ---------------------------------------------------------------------------
// Manages ephemeral relay connections for data retrieval. Connects on-demand,
// tracks RTT, reuses connections, disconnects idle relays. Provides a unified
// query API that crawls across popular relays, indexers, and pool relays.

const BASE = '/api/cache';

export interface PopularRelay {
  url: string;
  count: number;
}

export interface CrawlerRelay {
  relay: Relay;
  url: string;
  rtt: number;       // avg RTT in ms (0 = unknown)
  source: 'popular' | 'indexer' | 'pool';
  lastUsed: number;  // unix ms
  connectAttempts: number;
}

export interface CrawlOptions {
  /** Max relays to query simultaneously */
  maxRelays?: number;
  /** Timeout per relay in ms */
  timeout?: number;
  /** Prefer indexers first, then popular */
  preferIndexers?: boolean;
  /** Only use these sources */
  sources?: ('popular' | 'indexer' | 'pool')[];
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

type Listener = () => void;

interface CrawlerState {
  popularRelays: PopularRelay[];
  crawlerRelays: Map<string, CrawlerRelay>;
  isLoadingPopular: boolean;
  lastPopularFetch: number;
}

let state: CrawlerState = {
  popularRelays: [],
  crawlerRelays: new Map(),
  isLoadingPopular: false,
  lastPopularFetch: 0,
};

const listeners: Set<Listener> = new Set();
let idleTimer: ReturnType<typeof setInterval> | null = null;
const IDLE_TIMEOUT = 60_000; // disconnect relays idle > 60s
const POPULAR_REFRESH_MS = 30 * 60 * 1000; // refresh popular list every 30 min
const seenEvents = new Set<string>();
const MAX_SEEN = 20000;

let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    for (const fn of listeners) fn();
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getCrawlerState(): CrawlerState {
  return state;
}

export function subscribeCrawler(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Get combined relay URLs: indexers + popular (deduplicated, sorted by priority) */
export function getDiscoveryRelayUrls(): string[] {
  const pool = getPool();
  const poolUrls = new Set(pool.allRelays.map((r) => r.url));
  const indexerUrls = new Set(getIndexerUrls());
  const popularUrls = state.popularRelays.map((r) => r.url);

  // Priority: indexers first, then popular relays not already in pool/indexers
  const result: string[] = [];
  for (const url of indexerUrls) {
    result.push(url);
  }
  for (const url of popularUrls) {
    if (!indexerUrls.has(url) && !poolUrls.has(url)) {
      result.push(url);
    }
  }
  return result;
}

/** Fetch popular relay rankings from server cache */
export async function loadPopularRelays(limit: number = 25): Promise<void> {
  const now = Date.now();
  if (state.isLoadingPopular) return;
  if (now - state.lastPopularFetch < POPULAR_REFRESH_MS && state.popularRelays.length > 0) return;

  state = { ...state, isLoadingPopular: true };
  notify();

  try {
    const resp = await fetch(`${BASE}/popular-relays?limit=${limit}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json() as { relays: PopularRelay[] };

    state = {
      ...state,
      popularRelays: data.relays || [],
      isLoadingPopular: false,
      lastPopularFetch: now,
    };
    console.log('[crawler] Loaded', state.popularRelays.length, 'popular relays');
    notify();
  } catch (err) {
    state = { ...state, isLoadingPopular: false };
    console.warn('[crawler] Failed to load popular relays:', err);
    notify();
  }
}

/**
 * Crawl across multiple relay sources to satisfy a set of filters.
 * Returns a Promise that resolves when all relays have responded or timed out.
 * Events are delivered via the onEvent callback as they arrive.
 */
export async function crawl(
  filters: NostrFilter[],
  onEvent: (event: NostrEvent) => void,
  options: CrawlOptions = {},
): Promise<void> {
  const {
    maxRelays = 8,
    timeout = 6000,
    preferIndexers = true,
    sources = ['indexer', 'popular', 'pool'],
  } = options;

  // Build relay URL list in priority order
  const urls = buildRelayList(sources, preferIndexers, maxRelays);
  if (urls.length === 0) return;

  // Connect and query in parallel
  const promises: Promise<void>[] = [];

  for (const url of urls) {
    promises.push(crawlRelay(url, filters, onEvent, timeout));
  }

  await Promise.allSettled(promises);
}

// ---------------------------------------------------------------------------
// Internal — relay connection management
// ---------------------------------------------------------------------------

function buildRelayList(
  sources: ('popular' | 'indexer' | 'pool')[],
  preferIndexers: boolean,
  maxRelays: number,
): string[] {
  const pool = getPool();
  const poolUrls = pool.allRelays
    .filter((r) => r.status === 'connected')
    .map((r) => r.url);
  const indexerUrls = getIndexerUrls();
  const popularUrls = state.popularRelays.map((r) => r.url);

  const added = new Set<string>();
  const result: string[] = [];

  function add(url: string) {
    if (added.has(url) || result.length >= maxRelays) return;
    added.add(url);
    result.push(url);
  }

  if (preferIndexers) {
    if (sources.includes('indexer')) indexerUrls.forEach(add);
    if (sources.includes('popular')) popularUrls.forEach(add);
    if (sources.includes('pool')) poolUrls.forEach(add);
  } else {
    if (sources.includes('pool')) poolUrls.forEach(add);
    if (sources.includes('popular')) popularUrls.forEach(add);
    if (sources.includes('indexer')) indexerUrls.forEach(add);
  }

  return result;
}

async function crawlRelay(
  url: string,
  filters: NostrFilter[],
  onEvent: (event: NostrEvent) => void,
  timeout: number,
): Promise<void> {
  let cr = state.crawlerRelays.get(url);

  // Try to reuse pool relay if already connected
  const pool = getPool();
  const poolRelay = pool.getRelay(url);
  if (poolRelay && poolRelay.status === 'connected') {
    return queryRelay(poolRelay, url, 'pool', filters, onEvent, timeout);
  }

  // Reuse existing crawler relay if connected
  if (cr && cr.relay.status === 'connected') {
    cr.lastUsed = Date.now();
    return queryRelay(cr.relay, url, cr.source, filters, onEvent, timeout);
  }

  // Create new ephemeral connection
  const relay = new Relay(url);
  const source = getIndexerUrls().includes(url) ? 'indexer' as const : 'popular' as const;
  cr = {
    relay,
    url,
    rtt: 0,
    source,
    lastUsed: Date.now(),
    connectAttempts: (cr?.connectAttempts || 0) + 1,
  };
  state.crawlerRelays.set(url, cr);

  const connectStart = Date.now();
  try {
    await relay.connect();
    if (relay.status !== 'connected') {
      relay.disconnect();
      return;
    }
    cr.rtt = Date.now() - connectStart;
    cr.lastUsed = Date.now();

    ensureIdleCleanup();
    return queryRelay(relay, url, source, filters, onEvent, timeout);
  } catch {
    relay.disconnect();
  }
}

function queryRelay(
  relay: Relay,
  url: string,
  source: 'popular' | 'indexer' | 'pool',
  filters: NostrFilter[],
  onEvent: (event: NostrEvent) => void,
  timeout: number,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      relay.unsubscribe(subId);
      resolve();
    }, timeout);

    const subId = relay.subscribe(
      filters,
      (event: NostrEvent) => {
        // Crawler-level dedup
        if (seenEvents.has(event.id)) return;
        trackSeen(event.id);
        onEvent(event);
      },
      () => {
        clearTimeout(timer);
        relay.unsubscribe(subId);
        resolve();
      },
    );
  });
}

function trackSeen(id: string) {
  seenEvents.add(id);
  if (seenEvents.size > MAX_SEEN) {
    const toPrune = Math.floor(MAX_SEEN * 0.4);
    const iter = seenEvents.values();
    for (let i = 0; i < toPrune; i++) {
      const val = iter.next().value;
      if (val) seenEvents.delete(val);
    }
  }
}

// ---------------------------------------------------------------------------
// Idle cleanup — disconnect relays that haven't been used recently
// ---------------------------------------------------------------------------

function ensureIdleCleanup() {
  if (idleTimer) return;
  idleTimer = setInterval(() => {
    const now = Date.now();
    for (const [url, cr] of state.crawlerRelays) {
      if (now - cr.lastUsed > IDLE_TIMEOUT && cr.source !== 'pool') {
        cr.relay.disconnect();
        state.crawlerRelays.delete(url);
      }
    }
    // Stop timer if no crawler relays left
    if (state.crawlerRelays.size === 0 && idleTimer) {
      clearInterval(idleTimer);
      idleTimer = null;
    }
  }, 15_000);
}

/** Disconnect all crawler relays and clear state */
export function cleanupCrawler(): void {
  for (const [, cr] of state.crawlerRelays) {
    if (cr.source !== 'pool') cr.relay.disconnect();
  }
  state = { ...state, crawlerRelays: new Map() };
  seenEvents.clear();
  if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
}
