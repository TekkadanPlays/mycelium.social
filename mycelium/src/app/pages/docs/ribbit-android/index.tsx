import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';
import { Separator } from '../../../ui/Separator';

export function MyceliumAndroidIndex() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Mycelium for Android',
      description: 'Native Nostr social client for Android, built with Jetpack Compose, Material Design 3, and the Cybin protocol library.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'Kotlin'),
      createElement(Badge, { variant: 'secondary' }, 'Jetpack Compose'),
      createElement(Badge, { variant: 'secondary' }, 'Material 3'),
      createElement(Badge, { variant: 'secondary' }, 'Cybin'),
      createElement(Badge, { variant: 'secondary' }, 'Ktor'),
      createElement(Badge, { variant: 'outline' }, 'v0.1.7-beta'),
    ),

    // What is Mycelium Android
    createElement(SectionHeading, { id: 'what' }, 'What is Mycelium for Android?'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Mycelium for Android is the native mobile companion to mycelium.social. It connects directly to the decentralized Nostr network \u2014 no centralized server owns your data. Built entirely in Kotlin with Jetpack Compose, it delivers a smooth Material Design 3 experience with full relay sovereignty, NIP-55 signer integration, Lightning zaps, live streaming, relay discovery, and more.',
    ),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'The app uses Cybin, our custom Kotlin Multiplatform Nostr protocol library, for all cryptographic operations, event signing, relay communication, and NIP implementations. Authentication is handled exclusively through external signers (Amber) via NIP-55 \u2014 no private keys are ever stored in the app.',
    ),

    // Features overview
    createElement(SectionHeading, { id: 'features' }, 'Features'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' },
      ...[
        { icon: '\uD83D\uDCF0', title: 'Social Feed', desc: 'Real-time feed from followed accounts. Reactions, replies, reposts, and zap counts inline. Cursor-based pagination with pull-to-refresh.' },
        { icon: '\uD83D\uDCAC', title: 'Thread View', desc: 'Hierarchical reply threading with visual thread lines. Slide-back gesture navigation. State preservation across rotation and navigation.' },
        { icon: '\uD83D\uDCE1', title: 'Relay Manager', desc: 'Profile-based relay management with Outbox, Inbox, and Cache categories. NIP-65 relay list publishing. Custom relay profiles with rename/delete.' },
        { icon: '\uD83C\uDF10', title: 'Relay Discovery', desc: 'NIP-66 powered relay browser. Multi-dimensional filtering by software, country, NIPs, payment/auth. RTT measurements and monitor counts.' },
        { icon: '\uD83D\uDD14', title: 'Notifications', desc: 'Real-time notifications for mentions, replies, reactions, reposts, and zaps. Background foreground service keeps connections alive.' },
        { icon: '\u26A1', title: 'Wallet & Zaps', desc: 'NIP-47 Wallet Connect and Coinos integration. Expanding semi-circle zap menu with preset amounts. Lightning address resolution and LNURL support.' },
        { icon: '\uD83D\uDD10', title: 'NIP-55 Signer', desc: 'Amber signer integration via NIP-55 and NIP-42 relay auth. Multi-account support with account switching. No private keys stored in the app.' },
        { icon: '\uD83D\uDC64', title: 'Profiles', desc: 'User profiles with note feeds, follower info, and metadata. Profile metadata cache persists across process death. QR code sharing for npub.' },
        { icon: '\uD83D\uDDE3\uFE0F', title: 'Topics (NIP-29)', desc: 'Relay-based group topics with kind-11 and kind-1111 events. Topic creation, replies, and moderation. Scoped moderation via NIP-22 kind-1011.' },
        { icon: '\uD83D\uDCFA', title: 'Live Streaming', desc: 'NIP-53 live activity discovery and viewing. HLS video playback with ExoPlayer. Picture-in-Picture mode with background audio continuation.' },
        { icon: '\uD83C\uDF0D', title: 'Translation', desc: 'On-device ML Kit translation. Language detection and translation for any note content. No external API calls \u2014 fully offline capable.' },
        { icon: '\uD83C\uDFA8', title: 'Material Design 3', desc: 'Dynamic color theming with light/dark/AMOLED modes. Smooth Material Motion transitions. Edge-to-edge display with proper inset handling.' },
        { icon: '\uD83D\uDD0D', title: 'Search', desc: 'Modern search bar with content and user discovery across connected relays.' },
        { icon: '\uD83D\uDDBC\uFE0F', title: 'Rich Media', desc: 'Inline video playback, GIF support via Coil, image viewer with zoom/pan, URL preview cards with OpenGraph parsing via Jsoup.' },
        { icon: '\uD83D\uDEE1\uFE0F', title: 'Relay Health', desc: 'Per-relay health tracking with automatic blocklisting of persistently failing relays. Network connectivity monitoring with auto-reconnection.' },
      ].map((f) =>
        createElement('div', { key: f.title, className: 'rounded-lg border border-border p-4' },
          createElement('div', { className: 'flex items-center gap-2 mb-2' },
            createElement('span', { className: 'text-lg' }, f.icon),
            createElement('p', { className: 'text-sm font-semibold' }, f.title),
          ),
          createElement('p', { className: 'text-xs text-muted-foreground' }, f.desc),
        ),
      ),
    ),

    createElement(Separator, null),

    // Architecture
    createElement(SectionHeading, { id: 'architecture' }, 'Architecture'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Mycelium follows a layered MVVM architecture with clear separation between UI, state management, data, and protocol layers.',
    ),
    createElement('div', { className: 'space-y-2' },
      ...[
        { title: 'UI Layer (28 screens, 30+ components)', desc: 'Jetpack Compose screens with Material Design 3. Screens include: Dashboard, Thread View, Profile, Notifications, Relay Manager, Relay Discovery, Relay Health, Relay Log, Topics, Live Explorer, Live Stream, Wallet, Settings (General, Appearance, Media, Account Preferences, About), Compose Note/Reply/Topic, QR Code, Image/Video Viewer, Onboarding, Debug Follow List.' },
        { title: 'ViewModel Layer (11 ViewModels)', desc: 'AppViewModel (global app state), AccountStateViewModel (auth + multi-account), AuthViewModel (Amber login flow), DashboardViewModel (feed orchestration), FeedStateViewModel (note collection + pagination), RelayManagementViewModel (relay CRUD + profiles), Kind1RepliesViewModel / ThreadRepliesViewModel / ThreadStateHolder (thread state), TopicsViewModel (NIP-29 groups), AnnouncementsViewModel (relay announcements).' },
        { title: 'Repository Layer (26 repositories)', desc: 'NotesRepository (feed + cache), NotificationsRepository, ContactListRepository, Nip65RelayListRepository, Nip66RelayDiscoveryRepository, RelayRepository + RelayStorageManager, ProfileMetadataCache, NoteCountsRepository, ReactionsRepository, Kind1RepliesRepository, ThreadRepliesRepository, TopicsRepository + TopicsPublishService + TopicRepliesRepository, LiveActivityRepository + LiveChatRepository, CoinosRepository, NwcConfigRepository, ScopedModerationRepository, AnchorSubscriptionRepository, QuotedNoteCache, ReplyCountCache, TranslationService, ZapStatePersistence.' },
        { title: 'Relay Layer', desc: 'RelayConnectionStateMachine \u2014 finite state machine (Disconnected \u2192 Connecting \u2192 Connected \u2192 Subscribed) with Tinder StateMachine library. Supports persistent subscriptions and temporary one-off subscriptions. RelayHealthTracker with automatic blocklisting. NetworkConnectivityMonitor for WiFi/cellular switch detection. Nip42AuthHandler for relay authentication. RelayLogBuffer for debug logging.' },
        { title: 'Network Layer', desc: 'WebSocketClient via Ktor CIO engine for relay connections. MyceliumHttpClient (Ktor OkHttp engine) for HTTP requests \u2014 NIP-11 info, URL previews, Lightning address resolution, NWC payments.' },
        { title: 'Auth Layer', desc: 'AmberSignerManager handles NIP-55 external signer communication via Android intents and content provider queries. Supports login, event signing, NIP-04/NIP-44 encryption, and relay auth. Multi-account persistence via SharedPreferences.' },
        { title: 'Service Layer', desc: 'RelayForegroundService keeps WebSocket connections alive when the app is backgrounded. EventPublisher for publishing signed events. ZapRequestBuilder + ZapPaymentHandler + LnurlResolver + LightningAddressResolver for the full zap pipeline. HtmlParser (Jsoup) + UrlPreviewService/Cache/Manager for link previews.' },
        { title: 'Cache Layer', desc: 'Nip11CacheManager (two-tier: in-memory + background refresh). ThreadReplyCache for thread state. ProfileMetadataCache persists to disk across process death. NotesRepository feed cache survives cold starts. MediaAspectRatioCache for image layout stability.' },
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
        { title: 'Language', desc: 'Kotlin with coroutines and Flow for async operations. JVM target 11. Compile SDK 36, min SDK 35.' },
        { title: 'UI', desc: 'Jetpack Compose with Material Design 3. Compose BOM for version alignment. Material Icons Extended. Adaptive Navigation Suite.' },
        { title: 'Protocol', desc: 'Cybin 0.1.0 \u2014 custom Kotlin Multiplatform Nostr library. secp256k1-kmp-jni for native crypto. Handles event creation, signing, verification, relay communication.' },
        { title: 'Networking', desc: 'Ktor Client (CIO + OkHttp engines) for WebSocket relay connections and HTTP requests. OkHttp 4.12 for additional HTTP needs. kotlinx.serialization for JSON.' },
        { title: 'Media', desc: 'Coil 2.5 for image loading (Compose integration, GIF decoder, video thumbnails). ExoPlayer (Media3 1.3.1) for HLS live streaming and inline video playback.' },
        { title: 'Navigation', desc: 'Jetpack Navigation Compose with NavHost. Material Motion transitions (shared element, slide). Full backstack preservation for infinite exploration.' },
        { title: 'ML', desc: 'Google ML Kit for on-device language detection and translation. No cloud API dependency.' },
        { title: 'Utilities', desc: 'ZXing 3.5.2 for QR code generation. Jsoup 1.17.2 for HTML parsing. Baseline Profiles for startup optimization.' },
        { title: 'Build', desc: 'Gradle with Kotlin DSL. ProGuard/R8 minification and resource shrinking for release builds. Compose compiler with strong skipping mode and metrics reporting.' },
        { title: 'Distribution', desc: 'GitHub Releases with Obtainium manifest for auto-updates. Signed APK with release keystore.' },
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
        { nip: 'NIP-05', label: 'DNS identity' },
        { nip: 'NIP-09', label: 'Event deletion' },
        { nip: 'NIP-10', label: 'Reply threading' },
        { nip: 'NIP-11', label: 'Relay info' },
        { nip: 'NIP-18', label: 'Reposts' },
        { nip: 'NIP-19', label: 'bech32 encoding' },
        { nip: 'NIP-22', label: 'Scoped moderation' },
        { nip: 'NIP-25', label: 'Reactions' },
        { nip: 'NIP-29', label: 'Relay groups' },
        { nip: 'NIP-42', label: 'Relay auth' },
        { nip: 'NIP-47', label: 'Wallet Connect' },
        { nip: 'NIP-53', label: 'Live activities' },
        { nip: 'NIP-55', label: 'Android signer' },
        { nip: 'NIP-57', label: 'Zaps' },
        { nip: 'NIP-65', label: 'Relay list' },
        { nip: 'NIP-66', label: 'Relay discovery' },
        { nip: 'NIP-86', label: 'Relay management' },
        { nip: 'NIP-98', label: 'HTTP auth' },
      ].map((n) =>
        createElement('div', { key: n.nip, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, n.nip),
          createElement('p', { className: 'text-[10px] text-muted-foreground' }, n.label),
        ),
      ),
    ),

    createElement(Separator, null),

    // Project Structure
    createElement(SectionHeading, { id: 'structure' }, 'Project Structure'),
    createElement(CodeBlock, {
      code: `social.mycelium.android/
\u251C\u2500\u2500 auth/              # AmberSignerManager (NIP-55 login + signing)
\u251C\u2500\u2500 cache/             # Nip11CacheManager, ThreadReplyCache, nip11/
\u251C\u2500\u2500 data/              # Data classes: Note, UserProfile, Relay, RelayCategory,
\u2502                      # RelayDiscovery, NotificationData, LiveActivity,
\u2502                      # LiveChatMessage, ThreadReply, UrlPreview, AccountInfo
\u251C\u2500\u2500 network/           # WebSocketClient (Ktor), MyceliumHttpClient
\u251C\u2500\u2500 relay/             # RelayConnectionStateMachine, RelayHealthTracker,
\u2502                      # NetworkConnectivityMonitor, Nip42AuthHandler, RelayLogBuffer
\u251C\u2500\u2500 repository/        # 26 repositories (notes, contacts, relays, profiles,
\u2502                      # notifications, topics, live, zaps, discovery, moderation...)
\u251C\u2500\u2500 service/           # RelayConnectionManager
\u251C\u2500\u2500 services/          # EventPublisher, Zap pipeline, URL preview pipeline,
\u2502                      # RelayForegroundService, LnurlResolver, TranslationService
\u251C\u2500\u2500 ui/
\u2502   \u251C\u2500\u2500 components/    # 30+ reusable Compose components
\u2502   \u251C\u2500\u2500 screens/       # 28 screens (Dashboard, Thread, Profile, Relay, etc.)
\u2502   \u251C\u2500\u2500 navigation/    # MyceliumNavigation, MaterialMotion transitions
\u2502   \u251C\u2500\u2500 theme/         # MyceliumTheme, ThemePreferences, dynamic colors
\u2502   \u251C\u2500\u2500 settings/      # MediaPreferences, appearance settings
\u2502   \u251C\u2500\u2500 icons/         # Custom icon definitions
\u2502   \u2514\u2500\u2500 performance/   # Performance monitoring utilities
\u251C\u2500\u2500 utils/             # AuthorUtils, Nip10ReplyDetector, Nip19QuoteParser,
\u2502                      # NoteContentAnnotatedBuilder, UrlDetector, ZapUtils,
\u2502                      # AppMemoryTrimmer, MediaAspectRatioCache, ClientTagManager
\u2514\u2500\u2500 viewmodel/         # 11 ViewModels (App, Account, Auth, Dashboard, Feed,
                         # RelayManagement, Replies, Threads, Topics, Announcements)`,
    }),

    // Installation
    createElement(SectionHeading, { id: 'install' }, 'Installation'),
    createElement('div', { className: 'space-y-3' },
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-semibold mb-1' }, 'Via Obtainium (Recommended)'),
        createElement('p', { className: 'text-xs text-muted-foreground mb-2' },
          'Install Obtainium from F-Droid or GitHub, then add the repository URL to get automatic release updates:',
        ),
        createElement(CodeBlock, { code: 'https://github.com/TekkadanPlays/mycelium-android' }),
      ),
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-semibold mb-1' }, 'Build from Source'),
        createElement('p', { className: 'text-xs text-muted-foreground mb-2' },
          'Requires JDK 11+ and Android SDK (API 35+).',
        ),
        createElement(CodeBlock, {
          code: `git clone https://github.com/TekkadanPlays/mycelium-android.git
cd mycelium-android

# Debug build
./gradlew assembleDebug

# Release build (requires keystore.properties)
./gradlew assembleRelease

# Install via ADB
adb install app/build/outputs/apk/release/app-release.apk`,
        }),
      ),
    ),

    // Requirements
    createElement(SectionHeading, { id: 'requirements' }, 'Requirements'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...[
        { title: 'Android', desc: 'API 35+ (Android 15). Targets API 36.' },
        { title: 'Signer', desc: 'Amber (com.greenart7c3.nostrsigner) or any NIP-55 compatible signer app.' },
        { title: 'Optional', desc: 'NWC-compatible wallet for zaps (e.g. Alby, Mutiny). Coinos account for integrated wallet.' },
        { title: 'Build', desc: 'JDK 11+, Android SDK, Gradle. Android Studio recommended for development.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),
  );
}
