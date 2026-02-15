import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiNip07Page() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nip07',
      description: 'NIP-07: window.nostr browser extension integration. Works with Alby, nos2x, nos2x-frog, and any NIP-07 signer.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Nip07Nostr interface'),
      createElement(CodeBlock, { code: "interface Nip07Nostr {\n  getPublicKey(): Promise<string>\n  signEvent(event: UnsignedEvent & { id: string }): Promise<NostrEvent>\n  getRelays?(): Promise<Record<string, { read: boolean; write: boolean }>>\n  nip04?: {\n    encrypt(pubkey: string, plaintext: string): Promise<string>\n    decrypt(pubkey: string, ciphertext: string): Promise<string>\n  }\n  nip44?: {\n    encrypt(pubkey: string, plaintext: string): Promise<string>\n    decrypt(pubkey: string, ciphertext: string): Promise<string>\n  }\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'hasNip07'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Returns true if window.nostr is available. Always returns false on the server.',
      ),
      createElement(CodeBlock, { code: "import { hasNip07 } from 'kaji'\n\nif (hasNip07()) {\n  // Extension is installed\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'getNip07PublicKey'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Prompts the user to approve sharing their public key. Throws if no extension is found.',
      ),
      createElement(CodeBlock, { code: "import { getNip07PublicKey } from 'kaji'\n\nconst pubkey = await getNip07PublicKey()\n// '3bf0c63f...' (64-char hex)" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'signWithExtension'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Computes the event ID, then asks the extension to sign. Returns a fully signed NostrEvent. This is the primary way to sign events in browser apps.',
      ),
      createElement(CodeBlock, { code: "import { createEvent, Kind, signWithExtension } from 'kaji'\n\nconst unsigned = createEvent(Kind.Text, 'Hello!')\nconst signed = await signWithExtension(unsigned)\n// signed.id, signed.sig, signed.pubkey are all set" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'getExtensionRelays'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Fetches the user\'s preferred relay list from the extension (if supported). Returns null if unavailable.',
      ),
      createElement(CodeBlock, { code: "import { getExtensionRelays } from 'kaji'\n\nconst relays = await getExtensionRelays()\n// { 'wss://relay.damus.io': { read: true, write: true }, ... }\n// or null" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'hasNip07()', type: 'boolean', default: 'Check extension availability' },
      { prop: 'getNip07PublicKey()', type: 'Promise<string>', default: 'Get user pubkey' },
      { prop: 'signWithExtension(event)', type: 'Promise<NostrEvent>', default: 'Sign via extension' },
      { prop: 'getExtensionRelays()', type: 'Promise<Record | null>', default: 'Get relay prefs' },
    ]}),
  );
}
