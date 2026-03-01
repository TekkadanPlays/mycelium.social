import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';
import { Separator } from '../../../ui/Separator';

export function RelaySystemPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Relay System',
      description: 'How Mycelium for Android manages relay connections, subscriptions, health tracking, and discovery.',
    }),

    // Connection State Machine
    createElement(SectionHeading, { id: 'state-machine' }, 'Connection State Machine'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'The RelayConnectionStateMachine is the core of Mycelium\'s relay infrastructure. It uses the Tinder StateMachine library to manage a finite state machine that avoids full disconnect/reconnect cycles when only the subscription changes.',
    ),
    createElement(CodeBlock, {
      code: `// State transitions
Disconnected \u2192 Connecting \u2192 Connected \u2192 Subscribed
                                  \u2193
                            ConnectFailed (retry with backoff)`,
    }),
    createElement('div', { className: 'space-y-2 mt-3' },
      ...[
        { title: 'Disconnected', desc: 'No relay connections. Initial state and state after explicit disconnect.' },
        { title: 'Connecting', desc: 'WebSocket connections being established to configured relay URLs. Per-relay status tracked individually.' },
        { title: 'Connected', desc: 'At least one relay connected. Ready to accept subscription requests.' },
        { title: 'Subscribed', desc: 'Active subscription filters applied. Events flowing from relays to repositories.' },
        { title: 'ConnectFailed', desc: 'Connection or subscription failed. Automatic retry with exponential backoff or user-triggered retry.' },
      ].map((s) =>
        createElement('div', { key: s.title, className: 'flex gap-3 rounded-lg border border-border p-3' },
          createElement('div', null,
            createElement('p', { className: 'text-sm font-semibold' }, s.title),
            createElement('p', { className: 'text-xs text-muted-foreground' }, s.desc),
          ),
        ),
      ),
    ),

    // Subscription Types
    createElement(SectionHeading, { id: 'subscriptions' }, 'Subscription Types'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...[
        { title: 'Persistent Subscription', desc: 'The main feed subscription. Stays active as long as the user is logged in. Managed by DashboardViewModel. Includes kind-1 notes, reactions, reposts, and notification filters. Automatically re-applied on resume.' },
        { title: 'Temporary Subscription', desc: 'One-off subscriptions for specific data needs \u2014 thread replies, profile notes, topic events. Returns a TemporarySubscriptionHandle that must be cancelled when the screen closes to avoid connection leaks.' },
        { title: 'Anchor Subscription', desc: 'Kind-30073 anchor events for persistent relay-specific content. Managed by AnchorSubscriptionRepository. Collected from app start.' },
        { title: 'Topic Subscription', desc: 'Kind-11 and kind-1111 events for NIP-29 relay groups. TopicsRepository registers handlers from app start so topics are collected before the user opens the Topics screen.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    createElement(Separator, null),

    // Health Tracking
    createElement(SectionHeading, { id: 'health' }, 'Health Tracking'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'RelayHealthTracker monitors connection success/failure rates per relay and automatically blocklists persistently failing relays to prevent wasted connection attempts and battery drain.',
    ),
    createElement('div', { className: 'space-y-2' },
      ...[
        { title: 'Per-relay scoring', desc: 'Each relay maintains a health score based on connection success rate, response time, and failure count. Scores decay over time to allow recovery.' },
        { title: 'Automatic blocklisting', desc: 'Relays that fail consistently are temporarily blocklisted. The blocklist persists across app restarts via SharedPreferences. Blocklisted relays are skipped during connection attempts.' },
        { title: 'Keepalive health check', desc: 'Started on app resume, stopped on destroy. Detects stale WebSocket connections that appear connected but aren\'t receiving data. Triggers reconnection when detected.' },
        { title: 'Relay Log Buffer', desc: 'Debug logging for relay connections, subscriptions, and events. Viewable in the Relay Log screen for troubleshooting connection issues.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // Network Connectivity
    createElement(SectionHeading, { id: 'connectivity' }, 'Network Connectivity'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'NetworkConnectivityMonitor uses Android\'s ConnectivityManager to detect network changes (WiFi \u2192 cellular, airplane mode, etc.) and triggers relay reconnection when connectivity is restored. This ensures the app recovers gracefully from network interruptions without user intervention.',
    ),

    createElement(Separator, null),

    // Relay Manager
    createElement(SectionHeading, { id: 'manager' }, 'Relay Manager'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'The Relay Manager provides a comprehensive UI for managing relay connections, organized into profiles and categories.',
    ),
    createElement('div', { className: 'space-y-2' },
      ...[
        { title: 'Relay Profiles', desc: 'Users can create multiple relay profiles (e.g. "Home", "Work", "Privacy"). Each profile has its own set of relay categories. Profiles can be renamed and deleted. The active profile determines which relays are connected.' },
        { title: 'Outbox Category', desc: 'Relays where your events are published. Write-enabled. These are the relays other clients should query to find your content.' },
        { title: 'Inbox Category', desc: 'Relays where you receive events from others. Read-enabled. Other clients should publish events mentioning you to these relays.' },
        { title: 'Cache Category', desc: 'Backup relays for redundancy. Both read and write enabled. Used for archival and ensuring content availability.' },
        { title: 'NIP-65 Publishing', desc: 'Relay lists are published as NIP-65 events (kind 10002) so other clients can discover your preferred relays for outbox/inbox routing.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // NIP-11 Cache
    createElement(SectionHeading, { id: 'nip11' }, 'NIP-11 Cache System'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'The Nip11CacheManager provides a two-tier caching strategy for relay information documents:',
    ),
    createElement('div', { className: 'space-y-1' },
      ...[
        'In-memory LRU cache for instant access during the session',
        'Background refresh of stale entries (>5 minutes old)',
        'Preloading of NIP-11 data for all configured relays on startup',
        'Cache-first strategy: new relays get cached info immediately, fresh data fetched in background',
        'Cached retriever with retry logic and timeout handling',
      ].map((text, i) =>
        createElement('div', { key: String(i), className: 'flex gap-2 text-sm text-muted-foreground' },
          createElement('span', { className: 'text-muted-foreground/50' }, '\u2022'),
          text,
        ),
      ),
    ),

    createElement(Separator, null),

    // Relay Discovery
    createElement(SectionHeading, { id: 'discovery' }, 'Relay Discovery (NIP-66)'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'The Relay Discovery screen provides a nostr.watch-style relay browser powered by NIP-66 relay discovery events.',
    ),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...[
        { title: 'Multi-dimensional filtering', desc: 'Filter by relay type (OR), software (OR), country (OR), supported NIPs (AND), and boolean toggles for NIP-11 availability, payment required, and auth required.' },
        { title: 'Text search', desc: 'Search across relay URL, name, description, and software fields.' },
        { title: 'Rich relay metadata', desc: 'Each relay shows: name, URL, type chips, software chip, country flag emoji, payment/auth badges, RTT with color coding, monitor count, and NIP count.' },
        { title: 'Dynamic filter options', desc: 'Filter options are built from actual API data, not hardcoded. Software list, country list, and NIP list all reflect what\'s available in the current dataset.' },
        { title: 'Disk cache', desc: 'Discovery data is cached to disk and restored on cold start. Background refresh when data is stale (>6 hours). Prefetch on launch if user has opted in or has an account.' },
        { title: 'Data aggregation', desc: 'Parses NIP-11 JSON content for software, name, description, icon, limitations. Extracts country code, ISP, AS number from l-tags. Merges NIPs from both N tags and NIP-11 content.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // NIP-42 Auth
    createElement(SectionHeading, { id: 'auth' }, 'Relay Authentication (NIP-42)'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Nip42AuthHandler automatically responds to relay AUTH challenges. When a relay sends an AUTH challenge, the handler creates a kind-22242 event, signs it via the Amber signer (NIP-55), and sends it back to the relay. This is transparent to the user \u2014 authenticated relays just work.',
    ),

    // Foreground Service
    createElement(SectionHeading, { id: 'foreground' }, 'Foreground Service'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'RelayForegroundService keeps WebSocket connections alive when the app is backgrounded. It starts automatically when a user is logged in and the app is in the foreground, requesting POST_NOTIFICATIONS permission on Android 13+. The service is stopped on logout. This ensures notifications and feed updates continue to arrive even when the user switches to another app.',
    ),
  );
}
