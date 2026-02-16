import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock } from '../_helpers';

export function RibbitAndroidIndex() {
  return createElement('div', { className: 'space-y-8 max-w-3xl' },
    createElement(PageHeader, {
      title: 'Ribbit Android',
      description: 'Native Nostr social client for Android, built with Jetpack Compose and Material Design 3.',
    }),

    // Overview
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Overview'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Ribbit Android is the native mobile companion to ribbit.network. It shares the same NIP coverage and design philosophy \u2014 censorship-resistant social networking with full relay sovereignty. Built entirely in Kotlin with Jetpack Compose, it delivers a smooth, modern Material Design 3 experience.',
      ),
    ),

    // Tech Stack
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Tech Stack'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...([
          { label: 'UI Framework', value: 'Jetpack Compose' },
          { label: 'Design System', value: 'Material Design 3' },
          { label: 'Language', value: 'Kotlin' },
          { label: 'State Management', value: 'ViewModel + StateFlow' },
          { label: 'Navigation', value: 'Custom with state preservation' },
          { label: 'Networking', value: 'OkHttp WebSocket + HTTP' },
          { label: 'Image Loading', value: 'Coil (Compose)' },
          { label: 'Serialization', value: 'kotlinx.serialization' },
        ]).map((item) =>
          createElement('div', {
            key: item.label,
            className: 'rounded-lg border border-border p-3',
          },
            createElement('p', { className: 'text-[11px] text-muted-foreground uppercase tracking-wider font-medium' }, item.label),
            createElement('p', { className: 'text-sm font-semibold mt-0.5' }, item.value),
          ),
        ),
      ),
    ),

    // Features
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Features'),
      createElement('div', { className: 'space-y-2' },
        ...([
          { icon: '\uD83D\uDCF1', title: 'Thread View', desc: 'Hierarchical comment system with visual thread lines, state preservation across navigation and rotation.' },
          { icon: '\uD83D\uDCE1', title: 'Relay Manager', desc: 'Tabbed interface with General and Personal tabs. Personal tab has Outbox, Inbox, and Cache relay categories with NIP-11 info display.' },
          { icon: '\uD83D\uDD0D', title: 'NIP-11 Caching', desc: 'Intelligent NIP-11 relay information caching with background refresh of stale data and preloading for known relays.' },
          { icon: '\u26A1', title: 'Wallet & Zaps', desc: 'NIP-47 Wallet Connect integration for sending and receiving zaps (Lightning payments) directly from the app.' },
          { icon: '\uD83D\uDD10', title: 'NIP-55 Signer', desc: 'Android signer integration via NIP-55 for secure key management without exposing private keys to the app.' },
          { icon: '\uD83D\uDC64', title: 'Profile Management', desc: 'User profiles with note feeds, multi-account support, and avatar sidebar navigation.' },
          { icon: '\uD83D\uDD0D', title: 'Search', desc: 'Find content and users across connected relays.' },
          { icon: '\uD83C\uDFA8', title: 'Material Design 3', desc: 'Dynamic color theming, smooth animations, and responsive layouts optimized for all screen sizes.' },
        ]).map((f) =>
          createElement('div', {
            key: f.title,
            className: 'flex gap-3 rounded-lg border border-border p-3',
          },
            createElement('span', { className: 'text-lg shrink-0' }, f.icon),
            createElement('div', null,
              createElement('p', { className: 'text-sm font-semibold' }, f.title),
              createElement('p', { className: 'text-xs text-muted-foreground mt-0.5' }, f.desc),
            ),
          ),
        ),
      ),
    ),

    // Relay Manager Architecture
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Relay Manager Architecture'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'The relay manager uses a tabbed HorizontalPager with two main views:',
      ),
      createElement('div', { className: 'space-y-2' },
        createElement('div', { className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, 'General Tab'),
          createElement('p', { className: 'text-xs text-muted-foreground' },
            'A flat list of relays with add/remove, NIP-11 info display, connection testing, and health monitoring. Each relay shows its name, software, supported NIPs, and online status.',
          ),
        ),
        createElement('div', { className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, 'Personal Tab'),
          createElement('p', { className: 'text-xs text-muted-foreground' },
            'Three categorized sections \u2014 Outbox (publishing), Inbox (receiving), and Cache (backup). Each category has its own add input and relay list. Relays are created with NIP-11 cache lookup for instant info display.',
          ),
        ),
      ),
      createElement(CodeBlock, {
        code: `// Relay data model with NIP-11 integration
data class UserRelay(
    val url: String,
    val read: Boolean = true,
    val write: Boolean = true,
    val info: RelayInformation? = null,
    val isOnline: Boolean = false,
    val lastChecked: Long = 0,
    val addedAt: Long = System.currentTimeMillis()
) {
    val displayName: String
        get() = info?.name ?: url.removePrefix("wss://")
    val supportedNips: List<Int>
        get() = info?.supported_nips ?: emptyList()
}`,
      }),
    ),

    // NIP-11 Cache
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'NIP-11 Cache System'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'The Nip11CacheManager provides a two-tier caching strategy:',
      ),
      createElement('ul', { className: 'text-sm text-muted-foreground space-y-1 list-disc pl-5' },
        createElement('li', null, 'In-memory cache for instant access during the session'),
        createElement('li', null, 'Background refresh of stale entries (>5 minutes old)'),
        createElement('li', null, 'Preloading of NIP-11 data for all configured relays on startup'),
        createElement('li', null, 'Cache-first strategy: new relays get cached info immediately, fresh data fetched in background'),
      ),
    ),

    // NIP Coverage
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'NIP Coverage'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Ribbit Android implements the same NIPs as ribbit.network, plus NIP-55 (Android Signer) and NIP-47 (Wallet Connect):',
      ),
      createElement('div', { className: 'flex flex-wrap gap-1.5' },
        ...([1, 2, 5, 7, 9, 10, 11, 18, 19, 25, 29, 42, 47, 55, 65]).map((n) =>
          createElement('span', {
            key: String(n),
            className: 'text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono',
          }, 'NIP-' + String(n).padStart(2, '0')),
        ),
      ),
    ),

    // Installation
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Installation'),
      createElement('div', { className: 'space-y-2' },
        createElement('div', { className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, 'Via Obtanium (Recommended)'),
          createElement('p', { className: 'text-xs text-muted-foreground' },
            'Install Obtanium from F-Droid, then add the repository URL:',
          ),
          createElement(CodeBlock, { code: 'https://github.com/TekkadanPlays/ribbit-android' }),
        ),
        createElement('div', { className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, 'Build from Source'),
          createElement(CodeBlock, {
            code: `git clone https://github.com/TekkadanPlays/ribbit-android.git
cd ribbit-android
./gradlew assembleDebug`,
          }),
        ),
      ),
    ),

    // Architecture
    createElement('section', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Architecture'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...([
          { title: 'UI Layer', desc: 'Jetpack Compose screens with Material Design 3 components, HorizontalPager for tabs, LazyColumn for lists.' },
          { title: 'ViewModel Layer', desc: 'ViewModels with StateFlow for reactive UI updates. RelayManagementViewModel manages relay CRUD operations.' },
          { title: 'Repository Layer', desc: 'RelayRepository handles persistence (SharedPreferences), NIP-11 fetching, and connection testing.' },
          { title: 'Service Layer', desc: 'RelayConnectionManager manages OkHttp WebSocket connections with status tracking and reconnection.' },
        ]).map((item) =>
          createElement('div', {
            key: item.title,
            className: 'rounded-lg border border-border p-3',
          },
            createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
            createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
          ),
        ),
      ),
    ),

  );
}
