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

// GET /relays — list relays with pagination
relaysRoute.get('/relays', async (c) => {
  const qs = c.req.url.split('?')[1] || '';
  const res = await proxy(`/relays${qs ? '?' + qs : ''}`);
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
