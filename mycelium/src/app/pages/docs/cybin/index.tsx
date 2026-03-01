import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';
import { Separator } from '../../../ui/Separator';

export function CybinIntro() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Cybin',
      description: 'Custom Kotlin Multiplatform Nostr protocol library powering Mycelium for Android.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'Kotlin'),
      createElement(Badge, { variant: 'secondary' }, 'Multiplatform'),
      createElement(Badge, { variant: 'secondary' }, 'secp256k1'),
      createElement(Badge, { variant: 'outline' }, 'v0.1.0'),
    ),

    // What is Cybin
    createElement(SectionHeading, { id: 'what' }, 'What is Cybin?'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Cybin is our custom Kotlin Multiplatform Nostr protocol library. It handles all cryptographic operations, event creation and signing, relay communication, bech32 encoding/decoding, and NIP-specific implementations. Mycelium for Android delegates all protocol-level work to Cybin \u2014 the app itself never touches raw cryptography or event wire formats directly.',
    ),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'The name "Cybin" references the psilocybin molecule \u2014 fitting for a library that forms the neural substrate of the Mycelium network.',
    ),

    // Why not Kaji?
    createElement(SectionHeading, { id: 'why' }, 'Why a custom library?'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Kaji is our InfernoJS-native Nostr protocol library for the web. Cybin fills the same role for Kotlin Multiplatform — purpose-built for Mycelium Android\'s needs: lean, with only the NIP implementations we actually use, and designed to integrate cleanly with our relay connection state machine and signer architecture.',
    ),

    createElement(Separator, null),

    // Modules
    createElement(SectionHeading, { id: 'modules' }, 'Module Structure'),
    createElement('div', { className: 'space-y-2' },
      ...[
        { pkg: 'core', desc: 'Event, EventTemplate, Filter, TagArrayBuilder, HexKey, hexToByteArray, toHexString, nowUnixSeconds, CybinUtils. The foundational types for all Nostr operations \u2014 event creation, serialization, filtering, and tag manipulation.' },
        { pkg: 'crypto', desc: 'KeyPair generation and management. Wraps secp256k1-kmp-jni for native elliptic curve operations. Handles key derivation, signing, and verification.' },
        { pkg: 'signer', desc: 'NostrSigner interface with two implementations: NostrSignerInternal (local key signing) and NostrSignerExternal (NIP-55 Amber delegation). All event signing goes through this abstraction.' },
        { pkg: 'relay', desc: 'CybinRelayPool for managing multiple relay connections. CybinSubscription for filter-based event streaming. RelayConnectionListener for connection lifecycle callbacks. RelayUrlNormalizer for URL canonicalization.' },
        { pkg: 'nip19', desc: 'Nip19Parser for bech32 entity encoding/decoding. Supports NPub, NSec, NEvent, NNote, NProfile, NAddress. Handles nostr: URI scheme parsing and generation.' },
        { pkg: 'nip25', desc: 'ReactionEvent builder for kind-7 reaction events. Supports custom emoji reactions and relay hints.' },
        { pkg: 'nip47', desc: 'LnZapPaymentRequestEvent (kind-23194) and LnZapPaymentResponseEvent (kind-23195) for Nostr Wallet Connect. NIP-04 encrypted request/response with PayInvoiceSuccessResponse and PayInvoiceErrorResponse parsing.' },
        { pkg: 'nip55', desc: 'ExternalSignerLogin for Amber login flow. NostrSignerExternal for delegated signing via Android intents and content provider queries. AmberDetector for signer app discovery. Permission and CommandType enums. IActivityLauncher interface for activity result handling.' },
        { pkg: 'nip57', desc: 'LnZapRequestEvent (kind-9734) builder. Supports PUBLIC, PRIVATE, ANONYMOUS, and NONZAP zap types. Handles zap request tag construction for both note zaps and profile zaps.' },
      ].map((m) =>
        createElement('div', { key: m.pkg, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, 'com.example.cybin.' + m.pkg),
          createElement('p', { className: 'text-xs text-muted-foreground' }, m.desc),
        ),
      ),
    ),

    createElement(Separator, null),

    // NIP Coverage
    createElement(SectionHeading, { id: 'nips' }, 'NIP Coverage'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Cybin implements the protocol-level primitives for these NIPs. Higher-level NIP logic (like NIP-66 relay discovery aggregation or NIP-11 caching) lives in the Mycelium app layer.',
    ),
    createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2' },
      ...[
        { nip: 'NIP-01', label: 'Basic protocol', scope: 'Event, Filter, relay pool' },
        { nip: 'NIP-02', label: 'Follow List', scope: 'Contact list events' },
        { nip: 'NIP-10', label: 'Text Notes', scope: 'Tag conventions' },
        { nip: 'NIP-19', label: 'bech32 entities', scope: 'Full parser + encoder' },
        { nip: 'NIP-25', label: 'Reactions', scope: 'ReactionEvent builder' },
        { nip: 'NIP-42', label: 'Relay auth', scope: 'Auth event signing' },
        { nip: 'NIP-44', label: 'Encryption', scope: 'Versioned payloads' },
        { nip: 'NIP-47', label: 'Wallet Connect', scope: 'Request/response events' },
        { nip: 'NIP-55', label: 'Android signer', scope: 'Full Amber integration' },
        { nip: 'NIP-57', label: 'Lightning Zaps', scope: 'Zap request builder' },
        { nip: 'NIP-65', label: 'Relay list', scope: 'Relay list events' },
      ].map((n) =>
        createElement('div', { key: n.nip, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-mono font-semibold' }, n.nip),
          createElement('p', { className: 'text-[10px] text-muted-foreground' }, n.label),
          createElement('p', { className: 'text-[10px] text-muted-foreground/70 italic' }, n.scope),
        ),
      ),
    ),

    createElement(Separator, null),

    // Key Abstractions
    createElement(SectionHeading, { id: 'abstractions' }, 'Key Abstractions'),

    createElement('h3', { className: 'text-sm font-semibold mt-4' }, 'Event & EventTemplate'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-2' },
      'Event is the immutable, signed Nostr event. EventTemplate is the unsigned builder that gets passed to a NostrSigner for signing. This separation ensures events are always properly signed before transmission.',
    ),
    createElement(CodeBlock, {
      code: `// Create an unsigned event template
val template = EventTemplate(
    createdAt = nowUnixSeconds(),
    kind = 1,
    tags = arrayOf(arrayOf("p", targetPubkey)),
    content = "Hello Nostr!"
)

// Sign it with any signer implementation
val signed: Event = signer.sign(template)

// Serialize to JSON for relay transmission
val json: String = signed.toJson()`,
    }),

    createElement('h3', { className: 'text-sm font-semibold mt-6' }, 'NostrSigner'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-2' },
      'The signer interface abstracts key management. The app never needs to know whether signing happens locally or via an external app like Amber.',
    ),
    createElement(CodeBlock, {
      code: `// Interface — all signing goes through this
interface NostrSigner {
    val pubKey: HexKey
    suspend fun sign(template: EventTemplate): Event
}

// Local signing (nsec import)
val internal = NostrSignerInternal(KeyPair(privKey = secretBytes))

// External signing (Amber via NIP-55)
val external = NostrSignerExternal(context, packageName, pubKey)`,
    }),

    createElement('h3', { className: 'text-sm font-semibold mt-6' }, 'CybinRelayPool'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-2' },
      'Manages WebSocket connections to multiple relays. Handles connection lifecycle, subscription management, and event routing. Used by Mycelium\'s RelayConnectionStateMachine as the underlying transport layer.',
    ),
    createElement(CodeBlock, {
      code: `// Create a subscription with filters
val subscription = pool.subscribe(
    relayUrls = listOf("wss://relay.damus.io", "wss://nos.lol"),
    filter = Filter(
        kinds = listOf(1),
        authors = listOf(myPubkey),
        since = nowUnixSeconds() - 3600
    ),
    listener = object : RelayConnectionListener {
        override fun onEvent(event: Event) { /* handle */ }
        override fun onEOSE() { /* end of stored events */ }
    }
)

// Send a signed event
pool.send(signedEvent, relayUrls)

// Clean up
subscription.close()`,
    }),

    createElement(Separator, null),

    // Tech Stack
    createElement(SectionHeading, { id: 'stack' }, 'Tech Stack'),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
      ...[
        { title: 'Language', desc: 'Kotlin with coroutines for async signing and relay communication.' },
        { title: 'Crypto', desc: 'secp256k1-kmp-jni for native elliptic curve operations. No pure-Kotlin crypto fallback \u2014 native performance only.' },
        { title: 'Serialization', desc: 'kotlinx.serialization for JSON event encoding/decoding.' },
        { title: 'Networking', desc: 'WebSocket relay connections via the host app\'s Ktor client. Cybin provides the protocol layer, not the transport.' },
        { title: 'Encoding', desc: 'Custom bech32 implementation for NIP-19 entity encoding. Handles npub, nsec, nevent, nprofile, naddr.' },
        { title: 'Distribution', desc: 'Included as a local module dependency in the Mycelium Android project. Version 0.1.0.' },
      ].map((item) =>
        createElement('div', { key: item.title, className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold mb-1' }, item.title),
          createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
        ),
      ),
    ),

    // Usage in Mycelium
    createElement(SectionHeading, { id: 'usage' }, 'Usage in Mycelium'),
    createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
      'Cybin is imported across 35 files in the Mycelium Android codebase with 106 total import statements. Key integration points:',
    ),
    createElement('div', { className: 'space-y-1' },
      ...[
        'AccountStateViewModel \u2014 event signing, reactions, zaps, follow/unfollow via NostrSigner',
        'AmberSignerManager \u2014 NIP-55 login flow and external signer state management',
        'RelayConnectionStateMachine \u2014 CybinRelayPool for WebSocket connections and subscriptions',
        'NwcPaymentManager \u2014 NIP-47 payment request/response with NIP-04 encryption',
        'ZapRequestBuilder \u2014 NIP-57 zap request event construction',
        'EventPublisher \u2014 event template creation with TagArrayBuilder and client tag injection',
        'Nip42AuthHandler \u2014 relay authentication challenge/response signing',
        'NoteContentAnnotatedBuilder \u2014 NIP-19 entity parsing for clickable mentions',
        'ContactListRepository \u2014 kind-3 contact list event creation and parsing',
        'Nip65RelayListRepository \u2014 kind-10002 relay list event handling',
      ].map((text, i) =>
        createElement('div', { key: String(i), className: 'flex gap-2 text-xs text-muted-foreground' },
          createElement('span', { className: 'text-muted-foreground/50 shrink-0' }, '\u2022'),
          text,
        ),
      ),
    ),
  );
}
