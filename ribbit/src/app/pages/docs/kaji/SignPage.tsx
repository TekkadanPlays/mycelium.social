import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock } from '../_helpers';

export function KajiSignPage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'sign',
      description: 'Low-level schnorr signing and verification using @noble/curves secp256k1.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'signEvent'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Signs a 64-char hex event hash with a private key. Returns a 128-char hex schnorr signature. You rarely call this directly \u2014 use finalizeEvent or signWithExtension instead.',
      ),
      createElement(CodeBlock, { code: "import { signEvent } from 'kaji'\n\nconst sig = signEvent(eventHash, privateKeyHex)\n// sig: 128-char hex schnorr signature" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'verifySignature'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Verifies a schnorr signature against an event hash and public key. Returns false on any error (invalid hex, wrong key, etc).',
      ),
      createElement(CodeBlock, { code: "import { verifySignature } from 'kaji'\n\nconst valid = verifySignature(eventHash, signature, publicKeyHex)\n// true or false" }),
    ),

    createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
      createElement('p', { className: 'text-sm font-medium mb-2' }, 'Implementation note'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Both functions delegate to schnorr.sign() and schnorr.verify() from @noble/curves/secp256k1. The noble library is audited and has zero dependencies of its own.',
      ),
    ),
  );
}
