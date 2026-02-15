import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiUtilsPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'utils',
      description: 'NIP-19 bech32 encoding/decoding, nprofile TLV, hex helpers, kind names, and display utilities.',
    }),

    // NIP-19 bech32
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'NIP-19 Bech32'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Encode and decode npub, nsec, and note bech32 strings. These are the human-readable formats used in Nostr clients.',
      ),
      createElement(CodeBlock, { code: "import { npubEncode, npubDecode, nsecEncode, nsecDecode, noteEncode, noteDecode } from 'kaji'\n\n// Encode hex \u2192 bech32\nnpubEncode('3bf0c63f...')  // 'npub1...'\nnsecEncode('abc123...')    // 'nsec1...'\nnoteEncode('def456...')    // 'note1...'\n\n// Decode bech32 \u2192 hex\nnpubDecode('npub1...')  // '3bf0c63f...'\nnsecDecode('nsec1...')  // 'abc123...'\nnoteDecode('note1...')  // 'def456...'" }),
    ),

    // nprofile TLV
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'nprofile TLV'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'NIP-19 TLV (Type-Length-Value) encoding for nprofile, which bundles a pubkey with relay hints.',
      ),
      createElement(CodeBlock, { code: "import { nprofileEncode, nprofileDecode } from 'kaji'\n\n// Encode pubkey + relay hints\nconst nprofile = nprofileEncode('3bf0c63f...', [\n  'wss://mycelium.social',\n  'wss://relay.damus.io',\n])\n// 'nprofile1...'\n\n// Decode\nconst { pubkey, relays } = nprofileDecode(nprofile)\n// pubkey: '3bf0c63f...'\n// relays: ['wss://mycelium.social', 'wss://relay.damus.io']" }),
    ),

    // Generic bech32
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Generic Bech32'),
      createElement(CodeBlock, { code: "import { encodeBech32, decodeBech32 } from 'kaji'\n\nconst encoded = encodeBech32('npub', hexString)\nconst { prefix, hex } = decodeBech32(bech32String)" }),
    ),

    // Hex helpers
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Hex & Display Helpers'),
      createElement(CodeBlock, { code: "import { isHex, shortenHex, shortenNpub, bytesToHex, hexToBytes } from 'kaji'\n\nisHex('3bf0c63f...', 64)  // true (validates 64-char lowercase hex)\nshortenHex('3bf0c63fcfdb1a...', 8)  // '3bf0c63f...cfdb1a'\nshortenNpub('npub1abc...xyz')       // 'npub1abc...st.xyz'" }),
    ),

    // kindName
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'kindName'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Maps a kind number to a human-readable name. Returns "Kind N" for unknown kinds.',
      ),
      createElement(CodeBlock, { code: "import { kindName } from 'kaji'\n\nkindName(0)     // 'Metadata'\nkindName(1)     // 'Short Text Note'\nkindName(7)     // 'Reaction'\nkindName(10002) // 'Relay List Metadata'\nkindName(99999) // 'Kind 99999'" }),
    ),

    // Misc
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Other'),
      createElement(CodeBlock, { code: "import { unixNow, utf8Encode, utf8Decode } from 'kaji'\n\nunixNow()                    // current unix timestamp (seconds)\nutf8Encode('hello')          // Uint8Array\nutf8Decode(new Uint8Array()) // string" }),
    ),

    createElement(PropTable, { rows: [
      { prop: 'npubEncode(hex)', type: 'string', default: 'Hex \u2192 npub' },
      { prop: 'npubDecode(npub)', type: 'string', default: 'npub \u2192 hex' },
      { prop: 'nsecEncode(hex)', type: 'string', default: 'Hex \u2192 nsec' },
      { prop: 'nsecDecode(nsec)', type: 'string', default: 'nsec \u2192 hex' },
      { prop: 'noteEncode(hex)', type: 'string', default: 'Hex \u2192 note' },
      { prop: 'noteDecode(note)', type: 'string', default: 'note \u2192 hex' },
      { prop: 'nprofileEncode(pubkey, relays?)', type: 'string', default: 'TLV encode' },
      { prop: 'nprofileDecode(nprofile)', type: '{pubkey, relays}', default: 'TLV decode' },
      { prop: 'isHex(str, length?)', type: 'boolean', default: 'Validate hex string' },
      { prop: 'shortenHex(hex, chars?)', type: 'string', default: 'Truncate for display' },
      { prop: 'shortenNpub(npub)', type: 'string', default: 'Truncate npub' },
      { prop: 'kindName(kind)', type: 'string', default: 'Human-readable kind name' },
      { prop: 'unixNow()', type: 'number', default: 'Current unix timestamp' },
    ]}),
  );
}
