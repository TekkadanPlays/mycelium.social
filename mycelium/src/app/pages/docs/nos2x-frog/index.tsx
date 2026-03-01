import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader, SectionHeading } from '../_helpers';
import { Separator } from '../../../ui/Separator';

export function Nos2xFrogIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nos2x-frog',
      description: 'A hardened Nostr signer browser extension. Forked from nos2x-fox, rebuilt from the ground up with InfernoJS.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'NIP-07'),
      createElement(Badge, { variant: 'secondary' }, 'NIP-04'),
      createElement(Badge, { variant: 'secondary' }, 'NIP-44'),
      createElement(Badge, { variant: 'secondary' }, 'InfernoJS'),
      createElement(Badge, { variant: 'secondary' }, 'Browser Extension'),
      createElement(Badge, { variant: 'outline' }, 'Stable'),
    ),

    // What is nos2x-frog
    createElement(SectionHeading, { id: 'what' }, 'What is nos2x-frog?'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'nos2x-frog is a NIP-07 compatible browser extension that manages your Nostr private keys and signs events on behalf of web applications. It started as a fork of nos2x-fox but has been substantially rewritten \u2014 the UI was migrated from React 19 to InfernoJS, the permission system was replaced entirely, and dozens of critical bugs were fixed.',
    ),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'The goal is a signer that is lightweight, secure, and transparent. Every signing request is analyzed for risk, every permission grant has a duration, and every action is logged.',
    ),

    // Capabilities
    createElement(SectionHeading, { id: 'capabilities' }, 'Capabilities'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' },
      ...[
        { title: 'NIP-07 Signing', icon: '\u270D\uFE0F', desc: 'Full NIP-07 implementation. getPublicKey, signEvent, getRelays \u2014 compatible with every Nostr web client.' },
        { title: 'NIP-04 & NIP-44 Encryption', icon: '\uD83D\uDD10', desc: 'Encrypt and decrypt direct messages using both the legacy NIP-04 scheme and the modern NIP-44 versioned encryption.' },
        { title: 'Multi-Profile Key Management', icon: '\uD83D\uDC64', desc: 'Store multiple Nostr identities. Switch between profiles instantly. Import hex or nsec keys, or generate new ones.' },
        { title: 'Per-Capability Permissions', icon: '\uD83D\uDEE1\uFE0F', desc: 'Grant individual capabilities per site: getPublicKey, signEvent, encrypt, decrypt. Each grant has a configurable duration and optional kind filter.' },
        { title: 'Risk Assessment Engine', icon: '\u26A0\uFE0F', desc: '4-tier risk classification (low/medium/high/critical) based on event kind. Zaps, wallet ops, and NIP-46 remote signing always prompt.' },
        { title: 'Flood Protection', icon: '\uD83D\uDEAB', desc: 'Rate limiting (10 requests per 30s per host). Flood detection with batch reject/approve. Prevents popup spam from malicious sites.' },
        { title: 'NIP-42 Relay Auth', icon: '\uD83D\uDD11', desc: 'Auto-sign relay authentication challenges. Batch authorize button for legitimate multi-relay auth floods.' },
        { title: 'Activity Logging', icon: '\uD83D\uDCCB', desc: 'Full audit trail of every signing request, approval, and denial. Searchable, filterable, with automatic quota management.' },
        { title: 'Lightweight Runtime', icon: '\u26A1', desc: 'InfernoJS instead of React 19. Dramatically smaller bundle. Faster popup load. Lower memory footprint.' },
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
      'nos2x-frog is a standard WebExtension with three execution contexts:',
    ),
    createElement('div', { className: 'space-y-2' },
      ...[
        { title: 'Background Service Worker', desc: 'Handles all NIP-07 message passing from content scripts. Manages the permission database, rate limiting, popup window lifecycle, and signing queue. This is the security boundary \u2014 private keys never leave this context.' },
        { title: 'Popup / Options UI', desc: 'Built with InfernoJS class components. The popup shows the active profile and quick actions. The options page manages profiles, permissions, security preferences, and the audit log.' },
        { title: 'Prompt Window', desc: 'A dedicated popup window for signing requests. Shows risk assessment, event details, content preview, and tag breakdown. Supports paginated queuing when multiple requests arrive simultaneously.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // History
    createElement(SectionHeading, { id: 'history' }, 'History'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'nos2x-frog\'s development is documented across three sequential pages that trace the project from its origins to the present:',
    ),
    createElement('div', { className: 'space-y-2' },
      ...[
        { title: '1. Fixing nos2x-fox', path: '/docs/nos2x-frog/fixing-nos2x-fox', desc: 'Critical bugs inherited from the upstream nos2x-fox codebase that we identified and fixed \u2014 race conditions, storage quota failures, invisible icons, and React bloat.' },
        { title: '2. Upgrading nos2x-fox', path: '/docs/nos2x-frog/upgrading-nos2x-fox', desc: 'Architectural improvements and redesigns \u2014 the new per-capability permission system, risk assessment engine, flood protection, and profile management overhaul.' },
        { title: '3. Breaking nos2x-frog', path: '/docs/nos2x-frog/breaking-nos2x-frog', desc: 'A running log of bugs introduced by our own modifications. Transparency about what we\'ve broken and how we\'ve fixed it.' },
      ].map((item) =>
        createElement('a', { key: item.title, href: item.path, className: 'block rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    createElement(Separator, null),

    // Tech stack
    createElement(SectionHeading, { id: 'stack' }, 'Tech Stack'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...[
        { title: 'UI Framework', desc: 'InfernoJS 9.0.11 \u2014 migrated from React 19. Class components throughout.' },
        { title: 'Bundler', desc: 'esbuild via esbuild-plugin-svgr for SVG-to-component transforms.' },
        { title: 'Styling', desc: 'SCSS with CSS custom properties. Dark theme. Prompt monospace font.' },
        { title: 'Crypto', desc: 'nostr-tools for NIP-19 encoding, event signing, NIP-04/NIP-44 encryption.' },
        { title: 'Storage', desc: 'browser.storage.local with quota-aware writes and surgical clear recovery.' },
        { title: 'Extension APIs', desc: 'WebExtension Manifest V2. browser.windows, browser.runtime message passing.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),
  );
}
