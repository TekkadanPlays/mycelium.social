import { Hono } from 'hono';

// Relay discovery API — proxies to local rstate instance
// rstate runs on a separate port (default 3100) and is not exposed publicly.
// This route provides a clean /api/relays/* interface through ribbit's Hono server.

const RSTATE_URL = process.env.RSTATE_URL || 'http://127.0.0.1:3100';
const RSTATE_TIMEOUT = 10000;

export const relaysRoute = new Hono();

// Proxy helper — forwards request to rstate and returns the response
async function proxy(
  rstatePath: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RSTATE_TIMEOUT);
  try {
    const res = await fetch(`${RSTATE_URL}${rstatePath}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    return res;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return new Response(JSON.stringify({ error: 'rstate timeout' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'rstate unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    clearTimeout(timer);
  }
}

// GET /relays/health — rstate health check
relaysRoute.get('/relays/health', async (c) => {
  const res = await proxy('/health/ping');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays — list relays with pagination and sorting
relaysRoute.get('/relays', async (c) => {
  // Forward all query params to rstate
  const url = new URL(c.req.url, 'http://localhost');
  const qs = url.search; // includes leading '?'
  const res = await proxy(`/relays${qs}`);
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/state — get single relay state
relaysRoute.get('/relays/state', async (c) => {
  const relayUrl = c.req.query('relayUrl');
  if (!relayUrl) {
    return c.json({ error: 'relayUrl query parameter required' }, 400);
  }
  const res = await proxy(`/relays/state?relayUrl=${encodeURIComponent(relayUrl)}`);
  const data = await res.json();
  return c.json(data, res.status as any);
});

// POST /relays/search — search relays by filter
relaysRoute.post('/relays/search', async (c) => {
  const body = await c.req.text();
  const res = await proxy('/relays/search', { method: 'POST', body });
  const data = await res.json();
  return c.json(data, res.status as any);
});

// POST /relays/online — find online relays
relaysRoute.post('/relays/online', async (c) => {
  const body = await c.req.text();
  const res = await proxy('/relays/online', { method: 'POST', body });
  const data = await res.json();
  return c.json(data, res.status as any);
});

// POST /relays/nearby — geospatial relay search
relaysRoute.post('/relays/nearby', async (c) => {
  const body = await c.req.text();
  const res = await proxy('/relays/nearby', { method: 'POST', body });
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/by/software — group by software
relaysRoute.get('/relays/by/software', async (c) => {
  const res = await proxy('/relays/by/software');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/by/nip — group by NIP support
relaysRoute.get('/relays/by/nip', async (c) => {
  const res = await proxy('/relays/by/nip');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/by/country — group by country
relaysRoute.get('/relays/by/country', async (c) => {
  const res = await proxy('/relays/by/country');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// POST /relays/compare — compare multiple relays
relaysRoute.post('/relays/compare', async (c) => {
  const body = await c.req.text();
  const res = await proxy('/relays/compare', { method: 'POST', body });
  const data = await res.json();
  return c.json(data, res.status as any);
});

// POST /relays/offline — find offline relays
relaysRoute.post('/relays/offline', async (c) => {
  const body = await c.req.text();
  const res = await proxy('/relays/offline', { method: 'POST', body });
  const data = await res.json();
  return c.json(data, res.status as any);
});

// POST /relays/dead — find dead relays
relaysRoute.post('/relays/dead', async (c) => {
  const body = await c.req.text();
  const res = await proxy('/relays/dead', { method: 'POST', body });
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/nearby — geospatial relay search
relaysRoute.get('/relays/nearby', async (c) => {
  const url = new URL(c.req.url, 'http://localhost');
  const res = await proxy(`/relays/nearby${url.search}`);
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/labels — get labels for a specific relay
relaysRoute.get('/relays/labels', async (c) => {
  const url = new URL(c.req.url, 'http://localhost');
  const res = await proxy(`/relays/labels${url.search}`);
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/labels/list — list all available labels
relaysRoute.get('/relays/labels/list', async (c) => {
  const res = await proxy('/relays/labels/list');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/by/label — find relays with a specific label
relaysRoute.get('/relays/by/label', async (c) => {
  const url = new URL(c.req.url, 'http://localhost');
  const res = await proxy(`/relays/by/label${url.search}`);
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /relays/by/network — group by network type
relaysRoute.get('/relays/by/network', async (c) => {
  const res = await proxy('/relays/by/network');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /monitors — list monitors
relaysRoute.get('/monitors', async (c) => {
  const res = await proxy('/monitors');
  const data = await res.json();
  return c.json(data, res.status as any);
});

// GET /monitors/:pubkey — get monitor info
relaysRoute.get('/monitors/:pubkey', async (c) => {
  const pubkey = c.req.param('pubkey');
  const res = await proxy(`/monitors/${pubkey}`);
  const data = await res.json();
  return c.json(data, res.status as any);
});
