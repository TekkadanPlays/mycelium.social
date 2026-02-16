// NIP-66: Relay Discovery and Monitoring
// Client module for querying relay state from an rstate REST API instance.
// This is the Kaji protocol-layer interface — no UI, no framework coupling.

// ---------------------------------------------------------------------------
// Types — mirrors rstate's RelayState and search interfaces
// ---------------------------------------------------------------------------

export interface AggregatedValue<T> {
  value: T;
  support: number;
  sampleSize: number;
  contributingAuthors: string[];
  lastUpdated: number;
}

export interface RelayState {
  relayUrl: string;
  network?: AggregatedValue<'clearnet' | 'tor' | 'i2p' | 'hybrid'>;
  software?: {
    family?: AggregatedValue<string>;
    version?: AggregatedValue<string>;
  };
  rtt?: {
    open?: AggregatedValue<number> & { mad?: number };
    read?: AggregatedValue<number> & { mad?: number };
    write?: AggregatedValue<number> & { mad?: number };
  };
  nips?: {
    list: number[];
    support: Record<number, number>;
  };
  labels?: Record<string, string[]>;
  geo?: {
    lat: number;
    lon: number;
    precision: number;
    geohash: string;
    support: number;
  };
  country?: AggregatedValue<string>;
  updated_at: number;
  contributingAuthors: string[];
  observationCount: number;
  lastSeenAt?: number;
  lastOpenAt?: number;
}

export interface RelaySearchFilter {
  nips?: number[];
  network?: string[];
  software?: string;
  maxLatency?: number;
  minSupport?: number;
}

export interface RelayListResponse {
  relays: RelayState[];
  total: number;
  limit: number;
  offset: number;
}

export interface RelayHealthResponse {
  status: string;
  version?: string;
  uptime?: number;
  observationCount?: number;
  cache?: {
    size: number;
    maxSize: number;
    hitRate: number;
    hitRatePercent: number;
  };
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class Nip66Client {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeout = timeout;
  }

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      });
      if (!res.ok) {
        throw new Error(`NIP-66 API error: ${res.status} ${res.statusText}`);
      }
      return await res.json() as T;
    } finally {
      clearTimeout(timer);
    }
  }

  // Health check
  async ping(): Promise<RelayHealthResponse> {
    return this.fetch<RelayHealthResponse>('/health/ping');
  }

  // List relays with pagination and sorting
  async listRelays(opts?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<RelayListResponse> {
    const params = new URLSearchParams();
    if (opts?.limit) params.set('limit', String(opts.limit));
    if (opts?.offset) params.set('offset', String(opts.offset));
    if (opts?.sortBy) params.set('sortBy', opts.sortBy);
    if (opts?.sortOrder) params.set('sortOrder', opts.sortOrder);
    const qs = params.toString();
    return this.fetch<RelayListResponse>(`/relays${qs ? '?' + qs : ''}`);
  }

  // Get a single relay's state
  async getRelayState(relayUrl: string): Promise<RelayState | null> {
    try {
      return await this.fetch<RelayState>(`/relays/state?relayUrl=${encodeURIComponent(relayUrl)}`);
    } catch {
      return null;
    }
  }

  // Search relays by filter criteria
  async searchRelays(filter: RelaySearchFilter, limit: number = 100, offset: number = 0): Promise<RelayListResponse> {
    return this.fetch<RelayListResponse>('/relays/search', {
      method: 'POST',
      body: JSON.stringify({ filter, limit, offset }),
    });
  }

  // Find online relays
  async onlineRelays(opts?: {
    onlineWindowSeconds?: number;
    filters?: { network?: string };
  }): Promise<{ relays: string[] }> {
    return this.fetch<{ relays: string[] }>('/relays/online', {
      method: 'POST',
      body: JSON.stringify(opts || {}),
    });
  }

  // Find relays near coordinates
  async nearbyRelays(lat: number, lon: number, radiusKm: number): Promise<RelayListResponse> {
    return this.fetch<RelayListResponse>('/relays/nearby', {
      method: 'POST',
      body: JSON.stringify({ lat, lon, radiusKm }),
    });
  }

  // Group by software
  async bySoftware(): Promise<Record<string, string[]>> {
    return this.fetch<Record<string, string[]>>('/relays/by/software');
  }

  // Group by NIP support
  async byNip(): Promise<Record<number, { relays: string[]; supportRatio: number }>> {
    return this.fetch<Record<number, { relays: string[]; supportRatio: number }>>('/relays/by/nip');
  }

  // Group by country
  async byCountry(): Promise<Record<string, string[]>> {
    return this.fetch<Record<string, string[]>>('/relays/by/country');
  }

  // Compare multiple relays
  async compareRelays(urls: string[]): Promise<{ relays: Array<RelayState | null> }> {
    return this.fetch<{ relays: Array<RelayState | null> }>('/relays/compare', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });
  }
}

// ---------------------------------------------------------------------------
// Convenience: find indexer relays (NIP-50 search capability)
// ---------------------------------------------------------------------------

export async function discoverIndexerRelays(
  client: Nip66Client,
  limit: number = 20,
): Promise<RelayState[]> {
  const result = await client.searchRelays(
    { nips: [50], network: ['clearnet'], minSupport: 0.5 },
    limit,
  );
  // Sort by open RTT (lowest latency first)
  return result.relays.sort((a, b) => {
    const aRtt = a.rtt?.open?.value ?? Infinity;
    const bRtt = b.rtt?.open?.value ?? Infinity;
    return aRtt - bRtt;
  });
}

// ---------------------------------------------------------------------------
// Convenience: find general-purpose relays
// ---------------------------------------------------------------------------

export async function discoverRelays(
  client: Nip66Client,
  opts?: {
    nips?: number[];
    maxLatency?: number;
    limit?: number;
  },
): Promise<RelayState[]> {
  const result = await client.searchRelays(
    {
      nips: opts?.nips || [1, 9, 11],
      network: ['clearnet'],
      maxLatency: opts?.maxLatency,
      minSupport: 0.5,
    },
    opts?.limit || 50,
  );
  return result.relays.sort((a, b) => {
    const aRtt = a.rtt?.open?.value ?? Infinity;
    const bRtt = b.rtt?.open?.value ?? Infinity;
    return aRtt - bRtt;
  });
}
