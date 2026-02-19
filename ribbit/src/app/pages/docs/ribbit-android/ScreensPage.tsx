import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading } from '../_helpers';
import { Badge } from '../../../ui/Badge';
import { Separator } from '../../../ui/Separator';

export function ScreensPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Screens & Components',
      description: 'All 28 screens and 30+ reusable Compose components in Mycelium for Android.',
    }),

    // Screens
    createElement(SectionHeading, { id: 'screens' }, 'Screens (28)'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Each screen is a @Composable function using Jetpack Navigation Compose. Navigation uses Material Motion transitions with full backstack preservation for infinite exploration through feeds, threads, and profiles.',
    ),

    // Core screens
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6' }, 'Core'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
      ...[
        { name: 'DashboardScreen', desc: 'Main feed with pull-to-refresh, note cards, reaction/reply/repost counts, and zap totals. Cursor-based pagination. Scroll-aware bottom navigation.' },
        { name: 'ModernThreadViewScreen', desc: 'Hierarchical reply threading with visual thread lines and indentation. Slide-back gesture for navigation. Thread state preserved across rotation.' },
        { name: 'ProfileScreen', desc: 'User profile with metadata, note feed, follower info. Cache-first loading. QR code sharing button.' },
        { name: 'NotificationsScreen', desc: 'Real-time notifications for mentions, replies, reactions, reposts, and zaps. Grouped by type.' },
        { name: 'OnboardingScreen', desc: 'First-run setup flow. Amber signer detection, login, relay configuration, and follow list import.' },
      ].map((s) =>
        createElement('div', { key: s.name, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, s.name),
          createElement('p', { className: 'text-xs text-muted-foreground' }, s.desc),
        ),
      ),
    ),

    // Relay screens
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6' }, 'Relay Management'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
      ...[
        { name: 'RelayManagementScreen', desc: 'Tabbed HorizontalPager with relay profiles. Each profile has Outbox, Inbox, and Cache categories. Add/remove relays, NIP-11 info display, NIP-65 publishing.' },
        { name: 'RelayDiscoveryScreen', desc: 'NIP-66 relay browser with multi-dimensional filtering (software, country, NIPs, payment/auth). Text search, RTT color coding, monitor counts.' },
        { name: 'RelayHealthScreen', desc: 'Per-relay connection health metrics. Success rates, failure counts, blocklist status. Manual unblock controls.' },
        { name: 'RelayLogScreen', desc: 'Debug relay log viewer. Shows connection events, subscription changes, and error messages from RelayLogBuffer.' },
      ].map((s) =>
        createElement('div', { key: s.name, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, s.name),
          createElement('p', { className: 'text-xs text-muted-foreground' }, s.desc),
        ),
      ),
    ),

    // Content screens
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6' }, 'Content'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
      ...[
        { name: 'ComposeNoteScreen', desc: 'Note composition with text input, emoji picker, and event publishing via Amber signer.' },
        { name: 'ReplyComposeScreen', desc: 'Reply composition with parent note context. NIP-10 reply tag generation.' },
        { name: 'TopicsScreen', desc: 'NIP-29 relay group topics. Topic list with creation and navigation to topic threads.' },
        { name: 'ComposeTopicScreen', desc: 'Create new NIP-29 group topics.' },
        { name: 'ComposeTopicReplyScreen', desc: 'Reply to topic threads with kind-1111 events.' },
        { name: 'TopicThreadScreen', desc: 'Topic thread view with replies. Similar to ModernThreadViewScreen but for NIP-29 events.' },
      ].map((s) =>
        createElement('div', { key: s.name, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, s.name),
          createElement('p', { className: 'text-xs text-muted-foreground' }, s.desc),
        ),
      ),
    ),

    // Live & Media screens
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6' }, 'Live & Media'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
      ...[
        { name: 'LiveExplorerScreen', desc: 'NIP-53 live activity discovery. Browse active live streams with metadata, viewer counts, and status indicators.' },
        { name: 'LiveStreamScreen', desc: 'HLS video playback via ExoPlayer. Live chat overlay with kind-1311 messages. PiP mode support with background audio.' },
        { name: 'ImageContentViewerScreen', desc: 'Full-screen image viewer with zoom/pan gestures. Loaded via Coil with disk caching.' },
        { name: 'VideoContentViewerScreen', desc: 'Full-screen video player with ExoPlayer. Supports HLS and direct video URLs.' },
      ].map((s) =>
        createElement('div', { key: s.name, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, s.name),
          createElement('p', { className: 'text-xs text-muted-foreground' }, s.desc),
        ),
      ),
    ),

    // Settings & Utility screens
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-6' }, 'Settings & Utility'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
      ...[
        { name: 'SettingsScreen', desc: 'Main settings hub with navigation to sub-screens.' },
        { name: 'GeneralSettingsScreen', desc: 'General app preferences: relay discovery prefetch, client tag, default zap amount.' },
        { name: 'AppearanceSettingsScreen', desc: 'Theme selection (light/dark/AMOLED/system), dynamic colors, font size.' },
        { name: 'MediaSettingsScreen', desc: 'Media preferences: auto-play video, image quality, GIF autoplay.' },
        { name: 'AccountPreferencesScreen', desc: 'Account management: switch accounts, manage signer connection, export data.' },
        { name: 'WalletScreen', desc: 'NIP-47 Wallet Connect configuration and Coinos integration. Balance display and payment history.' },
        { name: 'QrCodeScreen', desc: 'QR code display for sharing npub via ZXing. Scannable by other Nostr clients.' },
        { name: 'AboutScreen', desc: 'App version, build info, licenses, and links.' },
        { name: 'DebugFollowListScreen', desc: 'Debug utility for inspecting the contact list and follow graph.' },
      ].map((s) =>
        createElement('div', { key: s.name, className: 'rounded-lg border border-border p-3' },
          createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, s.name),
          createElement('p', { className: 'text-xs text-muted-foreground' }, s.desc),
        ),
      ),
    ),

    createElement(Separator, null),

    // Components
    createElement(SectionHeading, { id: 'components' }, 'Components (30+)'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Reusable Compose components shared across screens.',
    ),

    // Navigation components
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4' }, 'Navigation & Layout'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2' },
      ...[
        { name: 'AppHeader / AdaptiveHeader', desc: 'Top app bar with adaptive behavior based on scroll state and screen context.' },
        { name: 'BottomNavigation', desc: 'Bottom navigation bar with Home, Topics, Notifications, and Profile tabs.' },
        { name: 'ScrollAwareBottomNavigation', desc: 'Auto-hiding bottom nav that slides away on scroll down and returns on scroll up.' },
        { name: 'SmartBottomNavigation', desc: 'Intelligent bottom nav that adapts to screen context and navigation depth.' },
        { name: 'AppSidebar / GlobalSidebar', desc: 'Drawer sidebar with account info, navigation links, and settings access.' },
        { name: 'AccountSwitchBottomSheet', desc: 'Bottom sheet for switching between multiple Nostr accounts.' },
        { name: 'CutoutPadding', desc: 'Utility for handling display cutout insets on notched/hole-punch devices.' },
      ].map((c) =>
        createElement('div', { key: c.name, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, c.name),
          createElement('p', { className: 'text-[10px] text-muted-foreground mt-0.5' }, c.desc),
        ),
      ),
    ),

    // Content components
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4' }, 'Content'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2' },
      ...[
        { name: 'NoteCard', desc: 'Standard note card with author info, content, media, reactions, replies, reposts, and zap counts.' },
        { name: 'ModernNoteCard', desc: 'Enhanced note card with richer layout, URL previews, and inline media.' },
        { name: 'ClickableNoteContent', desc: 'Note text with clickable mentions (@npub), hashtags (#tag), and URLs. NIP-19 entity parsing.' },
        { name: 'MarkdownNoteContent', desc: 'Note content with basic Markdown rendering support.' },
        { name: 'LiveActivityRow', desc: 'Row component for live stream listings with status indicator, viewer count, and metadata.' },
        { name: 'RelayOrbs / RelayStatusIndicator', desc: 'Visual indicators for relay connection status. Colored orbs show connected/connecting/failed states.' },
      ].map((c) =>
        createElement('div', { key: c.name, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, c.name),
          createElement('p', { className: 'text-[10px] text-muted-foreground mt-0.5' }, c.desc),
        ),
      ),
    ),

    // Interaction components
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4' }, 'Interaction'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2' },
      ...[
        { name: 'ExpandingZapMenu', desc: 'Expanding radial menu for quick zap amounts. Animates outward from the zap button.' },
        { name: 'SemiCircleZapMenu', desc: 'Semi-circular zap amount selector with preset values and custom input.' },
        { name: 'SupportMyceliumZapDialog', desc: 'Dialog for zapping the Mycelium project to support development.' },
        { name: 'ReactionEmoji', desc: 'Emoji reaction display with animation. Supports custom emoji reactions beyond simple +.' },
        { name: 'EmojiPicker / EmojiData', desc: 'Full emoji picker with categories, search, and recent emoji tracking.' },
        { name: 'ModernSearchBar', desc: 'Animated search bar with expand/collapse transitions and clear button.' },
      ].map((c) =>
        createElement('div', { key: c.name, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, c.name),
          createElement('p', { className: 'text-[10px] text-muted-foreground mt-0.5' }, c.desc),
        ),
      ),
    ),

    // Media components
    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4' }, 'Media & Animation'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2' },
      ...[
        { name: 'InlineVideoPlayer', desc: 'Inline ExoPlayer for video content in feed. Supports HLS, MP4, and WebM.' },
        { name: 'PipStreamManager / PipStreamOverlay', desc: 'Picture-in-Picture management for live streams. Background audio continuation.' },
        { name: 'SharedPlayerPool', desc: 'Shared ExoPlayer instance pool to avoid creating multiple player instances. Memory-efficient video playback.' },
        { name: 'SharedElementTransition', desc: 'Material shared element transitions between screens (e.g. profile avatar expanding).' },
        { name: 'ThreadSlideBackBox', desc: 'Gesture-based slide-back container for thread navigation. Swipe right to go back.' },
        { name: 'LoadingAnimation', desc: 'Custom loading animation for feed refreshes and data loading states.' },
      ].map((c) =>
        createElement('div', { key: c.name, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, c.name),
          createElement('p', { className: 'text-[10px] text-muted-foreground mt-0.5' }, c.desc),
        ),
      ),
    ),
  );
}
