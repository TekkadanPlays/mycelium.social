import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader, SectionHeading } from '../_helpers';
import { Separator } from '../../../ui/Separator';

export function MyceliumIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Mycelium',
      description: 'A Nostr social client built with InfernoJS and Hono. Fast, lightweight, and decentralized.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'InfernoJS'),
      createElement(Badge, { variant: 'secondary' }, 'Hono'),
      createElement(Badge, { variant: 'secondary' }, 'Bun'),
      createElement(Badge, { variant: 'secondary' }, 'Tailwind v4'),
      createElement(Badge, { variant: 'outline' }, 'Beta'),
    ),

    // What is Mycelium
    createElement(SectionHeading, { id: 'what' }, 'What is Mycelium?'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Mycelium is a full-featured Nostr social client for the web. It connects to the decentralized Nostr network to let you post notes, follow people, react, reply, browse relay discovery, and manage your identity \u2014 all without a centralized server owning your data.',
    ),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'The client is built for speed. InfernoJS renders the UI, Bun bundles and serves it, and Hono handles the API layer. The entire stack is chosen for minimal overhead and maximum throughput.',
    ),

    // Features
    createElement(SectionHeading, { id: 'features' }, 'Features'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' },
      ...[
        { title: 'Social Feed', icon: '\uD83D\uDCF0', desc: 'Real-time feed of notes from people you follow. Reactions, replies, reposts, and zap counts inline. Progressive loading with cursor-based pagination.' },
        { title: 'User Profiles', icon: '\uD83D\uDC64', desc: 'View any Nostr profile with metadata, notes, and follower info. Cache-first loading with relay fan-out for fast restores.' },
        { title: 'Relay Discovery', icon: '\uD83C\uDF10', desc: 'NIP-66 powered relay browser. Filter by software, country, NIPs, payment/auth requirements. RTT measurements and monitor counts.' },
        { title: 'Notifications', icon: '\uD83D\uDD14', desc: 'Real-time notifications for mentions, replies, reactions, and reposts. Deduplication and subscription management.' },
        { title: 'NIP-07 Auth', icon: '\uD83D\uDD11', desc: 'Sign in with any NIP-07 browser extension (nos2x-frog, Alby, nos2x). No private keys stored on the server.' },
        { title: 'Marketplace', icon: '\uD83D\uDED2', desc: 'Browse Nostr marketplace listings. Filter by currency (BTC/sats, USD, EUR). Category-based navigation.' },
        { title: 'Relay Crawler', icon: '\uD83D\uDD77\uFE0F', desc: 'Ephemeral relay connections for fetching data beyond your relay list. Parallel queries with dedup and cleanup.' },
        { title: 'Blazecn UI', icon: '\uD83C\uDFA8', desc: 'Full component library built on Tailwind CSS v4. 50+ components ported from shadcn/ui to InfernoJS.' },
        { title: 'Dark/Light Theme', icon: '\uD83C\uDF13', desc: 'System-aware theme toggle. All components respect the current theme via CSS custom properties.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('div', { className: 'flex items-center gap-2 mb-2' },
            createElement('span', { className: 'text-lg' }, item.icon),
            createElement('p', { className: 'text-sm font-semibold' }, item.title),
          ),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // Architecture
    createElement(SectionHeading, { id: 'architecture' }, 'Architecture'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Mycelium is a single-page application served by a Hono backend running on Bun.',
    ),
    createElement('div', { className: 'space-y-2' },
      ...[
        { title: 'Client (SPA)', desc: 'InfernoJS class components with inferno-router for navigation. Module-level stores for state management (no Redux/Context). Each store exports subscribe/getState/reset functions.' },
        { title: 'Server (API)', desc: 'Hono routes on Bun. Serves the SPA bundle, handles API endpoints for relay list caching, popular relay aggregation, and server-side event caching. MariaDB for persistent storage.' },
        { title: 'Relay Pool', desc: 'Custom WebSocket relay pool with seen-event deduplication (50K capacity), automatic reconnection, and subscription lifecycle management. Supports both persistent and ephemeral connections.' },
        { title: 'Store System', desc: 'Module-level singleton stores: auth, feed, notifications, contacts, profiles, bootstrap, relay-list, relay-crawler, cache. Each store manages its own subscriptions and cleanup. Full reset system for account switching.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    createElement(Separator, null),

    // Tech Stack
    createElement(SectionHeading, { id: 'stack' }, 'Tech Stack'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...[
        { title: 'Runtime', desc: 'Bun \u2014 fast JavaScript runtime with built-in bundler, test runner, and package manager.' },
        { title: 'Frontend', desc: 'InfernoJS 9 \u2014 fastest virtual DOM library. Class components, no hooks. inferno-router for SPA routing.' },
        { title: 'Backend', desc: 'Hono \u2014 ultrafast web framework. Serves SPA + API routes. Middleware for auth, caching, CORS.' },
        { title: 'Styling', desc: 'Tailwind CSS v4 with PostCSS. Blazecn component library (50+ components). CSS custom properties for theming.' },
        { title: 'Protocol', desc: 'Nostr via kaji library. NIP-01, NIP-07, NIP-10, NIP-25, NIP-29, NIP-42, NIP-55, NIP-66.' },
        { title: 'Database', desc: 'MariaDB 11.8 for server-side caching. Event storage, relay list persistence, popular relay aggregation.' },
        { title: 'Relay', desc: 'strfry 1.0.4 on mycelium.social \u2014 high-performance C++ Nostr relay.' },
        { title: 'Proxy', desc: 'HAProxy with HTTP/2, rate limiting (100 req/10s), HSTS, health checks, and ACME cert renewal.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // NIP Coverage
    createElement(SectionHeading, { id: 'nips' }, 'NIP Coverage'),
    createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2' },
      ...[
        { nip: 'NIP-01', label: 'Basic protocol' },
        { nip: 'NIP-02', label: 'Contact list' },
        { nip: 'NIP-07', label: 'Browser signer' },
        { nip: 'NIP-10', label: 'Reply threading' },
        { nip: 'NIP-11', label: 'Relay info' },
        { nip: 'NIP-18', label: 'Reposts' },
        { nip: 'NIP-19', label: 'bech32 encoding' },
        { nip: 'NIP-25', label: 'Reactions' },
        { nip: 'NIP-29', label: 'Relay groups' },
        { nip: 'NIP-42', label: 'Relay auth' },
        { nip: 'NIP-55', label: 'Android signer' },
        { nip: 'NIP-65', label: 'Relay list' },
        { nip: 'NIP-66', label: 'Relay discovery' },
        { nip: 'NIP-98', label: 'HTTP auth' },
      ].map((n) =>
        createElement('div', { key: n.nip, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, n.nip),
          createElement('p', { className: 'text-[10px] text-muted-foreground' }, n.label),
        ),
      ),
    ),

    // Deployment
    createElement(SectionHeading, { id: 'deployment' }, 'Deployment'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Mycelium runs on mycelium.social. The production stack is containerized with Docker Compose: HAProxy (reverse proxy + TLS), Bun (app server), strfry (Nostr relay), and MariaDB (cache database). Cert renewal is automated via certbot with HTTP-01 challenges on port 8080.',
    ),
  );
}
