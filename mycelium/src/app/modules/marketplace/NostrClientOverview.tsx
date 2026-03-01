// Standalone project overview page for the Nostr Client app.
// Not currently wired into the site — saved for future use as a "project overview" module.

import { createElement } from 'inferno-create-element';
import { Badge } from '../../ui/Badge';
import { Separator } from '../../ui/Separator';

const APP = {
    title: 'Nostr Social Client',
    description: 'A decentralized social client with feed, profiles, hashtag explorer, and marketplace — built entirely with blazecn, Kaji, and InfernoJS.',
    icon: '\u26A1',
    tags: ['Social', 'Nostr', 'NIP-07', 'NIP-65'],
    features: [
        'Global feed with real-time note streaming',
        'NIP-07 extension login (Alby, nos2x)',
        'NIP-65 relay list discovery and management',
        'Profile viewing and editing (kind 0)',
        'Reactions, reposts, and content warnings',
        'Hashtag explorer with frequency analysis',
        'NIP-15 marketplace with stall browsing',
        'Responsive sidebar layout with mobile support',
    ],
};

export function NostrClientOverview() {
    return createElement('div', { className: 'space-y-8' },
        // App header
        createElement('div', { className: 'flex items-start gap-4' },
            createElement('div', { className: 'size-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0' }, APP.icon),
            createElement('div', { className: 'flex-1 min-w-0' },
                createElement('h2', { className: 'text-xl font-bold tracking-tight' }, APP.title),
                createElement('p', { className: 'text-sm text-muted-foreground mt-1' }, APP.description),
                createElement('div', { className: 'flex flex-wrap gap-1.5 mt-2' },
                    ...APP.tags.map((tag) =>
                        createElement(Badge, { key: tag, variant: 'secondary', className: 'text-[10px]' }, tag),
                    ),
                ),
            ),
        ),

        createElement(Separator, null),

        // Architecture
        createElement('div', { className: 'space-y-4' },
            createElement('h3', { className: 'text-sm font-semibold' }, 'Architecture'),
            createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3' },
                ...[
                    { label: 'UI Layer', value: 'blazecn + InfernoJS', desc: '49 components, createElement API, class-based state' },
                    { label: 'Nostr Layer', value: 'Kaji', desc: 'RelayPool, ProfileStore, event signing, NIP helpers' },
                    { label: 'Styling', value: 'Tailwind CSS v4', desc: 'OKLCH tokens, 20 themes, class-based dark mode' },
                    { label: 'Auth', value: 'NIP-07', desc: 'Browser extension signing via Alby or nos2x' },
                ].map((item) =>
                    createElement('div', { key: item.label, className: 'rounded-lg border border-border p-3' },
                        createElement('p', { className: 'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground' }, item.label),
                        createElement('p', { className: 'text-sm font-semibold mt-1' }, item.value),
                        createElement('p', { className: 'text-xs text-muted-foreground mt-0.5' }, item.desc),
                    ),
                ),
            ),
        ),

        // Features
        createElement('div', { className: 'space-y-3' },
            createElement('h3', { className: 'text-sm font-semibold' }, 'Features'),
            createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
                ...APP.features.map((feature) =>
                    createElement('div', { key: feature, className: 'flex items-start gap-2 text-sm' },
                        createElement('svg', {
                            className: 'size-4 text-primary shrink-0 mt-0.5',
                            viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
                            'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                        }, createElement('path', { d: 'M20 6L9 17l-5-5' })),
                        createElement('span', { className: 'text-muted-foreground' }, feature),
                    ),
                ),
            ),
        ),

        // Pages breakdown
        createElement('div', { className: 'space-y-3' },
            createElement('h3', { className: 'text-sm font-semibold' }, 'Pages'),
            createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' },
                ...[
                    { name: 'Feed', desc: 'Global note stream with compose box, reactions, reposts, muting, and load-more pagination.', icon: '\uD83D\uDCF0' },
                    { name: 'Profile', desc: 'User profile with banner, avatar, NIP-05 badge, notes tab, about tab, and inline profile editor.', icon: '\uD83D\uDC64' },
                    { name: 'Hashtags', desc: 'Frequency-weighted hashtag cloud from your note history. Multi-tag filtering with AND logic.', icon: '#\uFE0F\u20E3' },
                    { name: 'Marketplace', desc: 'NIP-15 stall browser with product cards, category filters, and stall detail pages.', icon: '\uD83D\uDED2' },
                    { name: 'Stall Detail', desc: 'Individual merchant stall with product grid, pricing, and merchant profile info.', icon: '\uD83C\uDFEA' },
                ].map((page) =>
                    createElement('div', { key: page.name, className: 'rounded-lg border border-border p-3' },
                        createElement('div', { className: 'flex items-center gap-2 mb-1' },
                            createElement('span', { className: 'text-base' }, page.icon),
                            createElement('p', { className: 'text-sm font-semibold' }, page.name),
                        ),
                        createElement('p', { className: 'text-xs text-muted-foreground' }, page.desc),
                    ),
                ),
            ),
        ),

        // Project structure
        createElement('div', { className: 'space-y-3' },
            createElement('h3', { className: 'text-sm font-semibold' }, 'Project Structure'),
            createElement('div', { className: 'rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-muted-foreground' },
                createElement('pre', null,
`nostr-app/
\u251C\u2500\u2500 src/
\u2502   \u251C\u2500\u2500 main.tsx              # App entry, router, init
\u2502   \u251C\u2500\u2500 tailwind.css           # Tokens + theme overrides
\u2502   \u251C\u2500\u2500 components/
\u2502   \u2502   \u251C\u2500\u2500 ComposeBox.tsx    # Note composer
\u2502   \u2502   \u2514\u2500\u2500 NoteCard.tsx      # Note display card
\u2502   \u251C\u2500\u2500 layout/
\u2502   \u2502   \u2514\u2500\u2500 AppShell.tsx      # Sidebar + mobile nav
\u2502   \u251C\u2500\u2500 pages/
\u2502   \u2502   \u251C\u2500\u2500 FeedPage.tsx      # Global feed
\u2502   \u2502   \u251C\u2500\u2500 ProfilePage.tsx   # User profiles
\u2502   \u2502   \u251C\u2500\u2500 HashtagPage.tsx   # Hashtag explorer
\u2502   \u2502   \u251C\u2500\u2500 MarketplacePage.tsx # NIP-15 market
\u2502   \u2502   \u2514\u2500\u2500 StallPage.tsx     # Stall detail
\u2502   \u251C\u2500\u2500 stores/
\u2502   \u2502   \u251C\u2500\u2500 nostr.ts          # Pool, auth, NIP-65
\u2502   \u2502   \u251C\u2500\u2500 feed.ts           # Feed subscription
\u2502   \u2502   \u2514\u2500\u2500 market.ts         # Marketplace state
\u2502   \u2514\u2500\u2500 lib/
\u2502       \u251C\u2500\u2500 icons.tsx          # Heroicons helper
\u2502       \u2514\u2500\u2500 time.ts            # Relative time
\u251C\u2500\u2500 package.json
\u251C\u2500\u2500 vite.config.ts
\u2514\u2500\u2500 tsconfig.json`),
            ),
        ),

        // Libraries used
        createElement('div', { className: 'space-y-3' },
            createElement('h3', { className: 'text-sm font-semibold' }, 'Libraries Used'),
            createElement('div', { className: 'flex flex-wrap gap-2' },
                ...[
                    { name: 'blazecn', desc: 'UI components' },
                    { name: 'kaji', desc: 'Nostr protocol' },
                    { name: 'inferno', desc: 'View layer' },
                    { name: 'inferno-router', desc: 'Client routing' },
                    { name: 'tailwindcss v4', desc: 'Styling' },
                    { name: 'vite', desc: 'Build tool' },
                    { name: 'hono', desc: 'Server' },
                ].map((lib) =>
                    createElement('div', { key: lib.name, className: 'inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs' },
                        createElement('span', { className: 'font-semibold' }, lib.name),
                        createElement('span', { className: 'text-muted-foreground' }, '\u2014 ' + lib.desc),
                    ),
                ),
            ),
        ),
    );
}
