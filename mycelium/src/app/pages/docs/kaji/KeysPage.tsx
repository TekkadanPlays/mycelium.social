import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiKeysPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'keys',
      description: 'Key pair generation, public key derivation, and NIP-19 bech32 conversion.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'generateKeyPair'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Generates a new secp256k1 key pair using a cryptographically secure random source. Returns 64-char hex strings.',
      ),
      createElement(CodeBlock, { code: "import { generateKeyPair } from 'kaji'\n\nconst { privateKey, publicKey } = generateKeyPair()\n// privateKey: '3bf0c63f...' (64-char hex)\n// publicKey:  'a1b2c3d4...' (64-char hex)" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'getPublicKey'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Derives the public key from a private key hex string.',
      ),
      createElement(CodeBlock, { code: "import { getPublicKey } from 'kaji'\n\nconst pubkey = getPublicKey(privateKeyHex)" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'keyPairToNip19'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Converts a KeyPair to NIP-19 bech32-encoded npub and nsec strings.',
      ),
      createElement(CodeBlock, { code: "import { generateKeyPair, keyPairToNip19 } from 'kaji'\n\nconst kp = generateKeyPair()\nconst { npub, nsec } = keyPairToNip19(kp)\n// npub: 'npub1abc...'\n// nsec: 'nsec1xyz...'" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'KeyPair.privateKey', type: 'string', default: '64-char hex' },
      { prop: 'KeyPair.publicKey', type: 'string', default: '64-char hex' },
    ]}),
  );
}
