import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { nip05Route } from './routes/nip05';
import { healthRoute } from './routes/health';

const app = new Hono();

app.use('*', logger());

// API routes
app.route('/api', healthRoute);
app.route('/.well-known', nip05Route);

// Serve static assets from dist/public
app.use('/assets/*', serveStatic({ root: './dist/public' }));
app.use('/favicon.ico', serveStatic({ root: './dist/public' }));
app.use('/tink.gif', serveStatic({ root: './dist/public' }));

// SPA fallback: serve index.html for all non-API routes
app.get('*', serveStatic({ root: './dist/public', path: '/index.html' }));

const port = Number(process.env.PORT) || 3000;

console.log(`🐸 ribbit.network starting on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
