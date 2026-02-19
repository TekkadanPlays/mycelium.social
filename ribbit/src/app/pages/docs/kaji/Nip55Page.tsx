import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';

export function KajiNip55Page() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nip55',
      description: 'Android signer integration via NIP-55. Intent-based signing for native and web apps using the nostrsigner: URI scheme.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'NIP-55'),
      createElement(Badge, { variant: 'secondary' }, 'Android'),
      createElement(Badge, { variant: 'secondary' }, 'Signing'),
      createElement(Badge, { variant: 'outline' }, 'kaji/nip55'),
    ),

    // Overview
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'overview' }, 'Overview'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'NIP-55 defines a protocol for Android applications to delegate event signing to a dedicated signer app (e.g. Amber). For web applications, Kaji uses the nostrsigner: URI scheme with callback URLs. The signer processes the request and redirects back to the calling app with the result.',
      ),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('p', { className: 'text-sm font-medium mb-2' }, 'How it works'),
        createElement('ol', { className: 'text-sm text-muted-foreground space-y-1 list-decimal pl-5' },
          createElement('li', null, 'App constructs a nostrsigner: URI with the action type and a callback URL'),
          createElement('li', null, 'Browser/OS routes the URI to the installed signer app (Amber)'),
          createElement('li', null, 'User approves the request in the signer'),
          createElement('li', null, 'Signer redirects back to the callback URL with the result appended as ?event=<result>'),
        ),
      ),
    ),

    // Detection
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'detection' }, 'Detection'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Use isAndroid() to check if the current environment is an Android device before offering NIP-55 signing.',
      ),
      createElement(CodeBlock, { code: `import { isAndroid } from 'kaji/nip55'

if (isAndroid()) {
  // Show "Sign with Amber" button
}` }),
    ),

    // API Reference
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'api' }, 'API Reference'),

      // isAndroid
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'isAndroid(): boolean'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Returns true if the user agent indicates an Android device.'),
      ),

      // requestPublicKey
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'requestPublicKey(): void'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Redirects to the signer app to request the user\'s public key. The signer will redirect back with the hex pubkey in the callback URL.'),
      ),

      // requestSignEvent
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'requestSignEvent(event: UnsignedEvent): void'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Redirects to the signer app to sign the given event. The event ID is computed automatically. The signer returns the signature in the callback URL.'),
      ),

      // parseNip55Callback
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'parseNip55Callback(): Nip55CallbackResult | null'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Parses the current URL for NIP-55 callback parameters. Returns { action, result } if present, or null if this is not a callback.'),
      ),

      // clearNip55Callback
      createElement('div', { className: 'rounded-lg border border-border p-4' },
        createElement('p', { className: 'text-sm font-mono font-semibold' }, 'clearNip55Callback(): void'),
        createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Removes the nip55_action and event query parameters from the URL without triggering navigation. Call this after processing the callback.'),
      ),
    ),

    // Usage example
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { requestPublicKey, requestSignEvent, parseNip55Callback, clearNip55Callback } from 'kaji/nip55'
import { createEvent, Kind } from 'kaji/event'

// On page load, check if we're returning from a signer callback
const callback = parseNip55Callback()
if (callback) {
  if (callback.action === 'get_public_key') {
    console.log('Got pubkey:', callback.result)
  } else if (callback.action === 'sign_event') {
    console.log('Got signature:', callback.result)
  }
  clearNip55Callback()
}

// Request public key from signer
requestPublicKey()

// Sign an event
const event = createEvent(Kind.Text, 'Hello from NIP-55!')
requestSignEvent(event)` }),
    ),

    // Callback URL format
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'callback-format' }, 'Callback URL Format'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'Per the NIP-55 spec, the callback URL ends with ?event= and the signer appends the result directly. Kaji embeds the action type in a custom nip55_action parameter so the app can distinguish between get_public_key and sign_event on return.',
      ),
      createElement(CodeBlock, { code: `// Outgoing URI (to signer):
nostrsigner:?type=get_public_key&callbackUrl=https://mycelium.social/?nip55_action=get_public_key&event=

// Return URL (from signer):
https://mycelium.social/?nip55_action=get_public_key&event=<hex_pubkey>` }),
    ),

    // Compatible signers
    createElement('div', { className: 'space-y-3' },
      createElement(SectionHeading, { id: 'signers' }, 'Compatible Signers'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        createElement('div', { className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold' }, 'Amber'),
          createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'The reference NIP-55 signer for Android. Registers the nostrsigner: URI scheme and handles key management, event signing, and encryption.'),
        ),
        createElement('div', { className: 'rounded-lg border border-border p-4' },
          createElement('p', { className: 'text-sm font-semibold' }, 'Any NIP-55 signer'),
          createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Any Android app that registers the nostrsigner: scheme and follows the NIP-55 callback protocol.'),
        ),
      ),
    ),
  );
}
