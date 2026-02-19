import { Relay } from '../../nostr/relay';
import type { NostrEvent } from '../../nostr/event';

// ---------------------------------------------------------------------------
// Indexer Discovery Store
// ---------------------------------------------------------------------------
// Discovers the best indexer relays (by RTT + uptime) for bootstrapping
// user profile and NIP-65 lookups.
//
// Strategy:
//   1. Try rstate API (production) — POST /relays/search for relays with
//      low latency and high uptime, sorted by latency.
//   2. Fallback — well-known indexer relays (instant, always works).
//
// After initial bootstrap, a background NIP-66 upgrade can replace the
// fallback list with dynamically discovered relays.
//
// Uses a shared promise so concurrent callers (App init + bootstrapUser)
// wait for the same result instead of racing.

type Listener = () => void;

export interface IndexerState {
  urls: string[];
  source: 'rstate' | 'nip66' | 'fallback' | 'none';
  isLoading: boolean;
  error: string | null;
}

let state: IndexerState = {
  urls: [],
  source: 'none',
  isLoading: false,
  error: null,
};

const listeners: Set<Listener> = new Set();
let activeDiscovery: Promise<void> | null = null;

let notifyScheduled = false;
function notify() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    for (const fn of listeners) fn();
  });
}

export function getIndexerState(): IndexerState {
  return state;
}

export function getIndexerUrls(): string[] {
  return state.urls;
}

export function subscribeIndexers(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Well-known relays that are reliable indexers
const FALLBACK_INDEXERS: string[] = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://purplepag.es',
  'wss://relay.primal.net',
];

// NIP-66 monitor relays for background upgrade
const MONITOR_RELAYS: string[] = [
  'wss://relay.nostr.watch',
  'wss://history.nostr.watch',
];

// ---------------------------------------------------------------------------
// Discovery — shared promise prevents race conditions
// ---------------------------------------------------------------------------

export function discoverIndexers(count: number = 10): Promise<void> {
  // Already have results
  if (state.urls.length > 0 && !state.isLoading) {
    return Promise.resolve();
  }
  // Already in progress — return the same promise
  if (activeDiscovery) {
    return activeDiscovery;
  }

  activeDiscovery = doDiscover(count).finally(() => {
    activeDiscovery = null;
  });
  return activeDiscovery;
}

async function doDiscover(count: number): Promise<void> {
  state = { ...state, isLoading: true, error: null };
  notify();

  // 1. Try rstate API (fast, production only)
  try {
    const urls = await fetchFromRstate(count);
    if (urls.length > 0) {
      console.log('[indexers] Discovered', urls.length, 'relays via rstate');
      state = { urls, source: 'rstate', isLoading: false, error: null };
      notify();
      return;
    }
  } catch (err) {
    console.warn('[indexers] rstate unavailable:', err);
  }

  // 2. Instant fallback — use well-known relays immediately
  // This ensures bootstrap never stalls waiting for NIP-66 WebSocket
  console.log('[indexers] Using fallback indexers');
  state = {
    urls: FALLBACK_INDEXERS.slice(0, count),
    source: 'fallback',
    isLoading: false,
    error: null,
  };
  notify();

  // 3. Background: try NIP-66 to upgrade the list (non-blocking)
  upgradeViaNip66(count);
}

// ---------------------------------------------------------------------------
// rstate API
// ---------------------------------------------------------------------------

async function fetchFromRstate(count: number): Promise<string[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    // GET /relays with lastSeen sort — gives us recently-active relays with RTT data
    const params = new URLSearchParams({
      limit: String(count * 3),
      offset: '0',
      sortBy: 'lastSeen',
      sortOrder: 'desc',
      format: 'detailed',
    });
    const res = await fetch(`/relays?${params}`, {
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`rstate ${res.status}`);

    const data = await res.json();
    // rstate response: { relays: [...], total, limit, offset }
    // Each relay has: relayUrl, rtt?.open?.value, network?.value, etc.
    const relays: any[] = data.relays || [];

    const scored = relays
      .filter((r: any) => {
        if (!r.relayUrl || !r.relayUrl.startsWith('wss://')) return false;
        // Only clearnet relays
        if (r.network?.value && r.network.value !== 'clearnet') return false;
        return true;
      })
      .map((r: any) => ({
        url: r.relayUrl.replace(/\/+$/, ''),
        rtt: r.rtt?.open?.value ?? 9999,
        lastSeen: r.lastSeenAt ?? 0,
      }))
      // Sort by RTT (lower is better), break ties by recency
      .sort((a, b) => {
        if (a.rtt !== b.rtt) return a.rtt - b.rtt;
        return b.lastSeen - a.lastSeen;
      });

    const seen = new Set<string>();
    const result: string[] = [];
    for (const r of scored) {
      if (seen.has(r.url)) continue;
      seen.add(r.url);
      result.push(r.url);
      if (result.length >= count) break;
    }

    return result;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// NIP-66 background upgrade (non-blocking)
// ---------------------------------------------------------------------------
// After fallback indexers are used, this tries to discover better relays
// via NIP-66 and upgrades the list if successful.

function upgradeViaNip66(count: number) {
  const relayUrls: Map<string, { rtt: number }> = new Map();
  let completed = 0;
  const timeout = setTimeout(() => finish(), 8000);

  function finish() {
    clearTimeout(timeout);
    if (relayUrls.size === 0) return; // no upgrade available

    const sorted = Array.from(relayUrls.entries())
      .sort((a, b) => a[1].rtt - b[1].rtt)
      .map(([url]) => url)
      .slice(0, count);

    if (sorted.length > 0) {
      console.log('[indexers] Upgraded to', sorted.length, 'relays via NIP-66');
      state = { urls: sorted, source: 'nip66', isLoading: false, error: null };
      notify();
    }
  }

  for (const monitorUrl of MONITOR_RELAYS) {
    const relay = new Relay(monitorUrl);
    relay.connect()
      .then(() => {
        const subId = relay.subscribe(
          [{ kinds: [30166], limit: count * 3 }],
          (event: NostrEvent) => {
            const dTag = event.tags.find((t) => t[0] === 'd');
            if (!dTag || !dTag[1]) return;
            const url = dTag[1].replace(/\/+$/, '');
            if (!url.startsWith('wss://')) return;

            let rtt = 9999;
            const rttTag = event.tags.find((t) => t[0] === 'rtt' && t[1] === 'open');
            if (rttTag && rttTag[2]) rtt = parseInt(rttTag[2], 10) || 9999;

            const existing = relayUrls.get(url);
            if (!existing || rtt < existing.rtt) {
              relayUrls.set(url, { rtt });
            }
          },
          () => {
            relay.unsubscribe(subId);
            relay.disconnect();
            completed++;
            if (completed >= MONITOR_RELAYS.length) finish();
          },
        );
      })
      .catch(() => {
        completed++;
        if (completed >= MONITOR_RELAYS.length) finish();
      });
  }
}
