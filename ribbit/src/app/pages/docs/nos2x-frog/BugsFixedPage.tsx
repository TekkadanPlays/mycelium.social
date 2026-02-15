import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';

// ---------------------------------------------------------------------------
// nos2x-frog — Bugs Fixed from nos2x-fox
// A running log of critical bugs inherited from the upstream nos2x-fox
// extension that have been identified and fixed in nos2x-frog.
// ---------------------------------------------------------------------------

interface BugEntry {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  date: string;
  commit: string;
  file: string;
  symptom: string;
  rootCause: string;
  fix: string;
  code?: string;
}

const BUGS: BugEntry[] = [
  {
    id: 'NFB-001',
    title: 'Multiple popup windows for concurrent sign requests',
    severity: 'critical',
    date: '2026-02-15',
    commit: '88eb881',
    file: 'src/background.ts — promptForPermission()',
    symptom: 'When a website sends multiple signEvent requests simultaneously (e.g. 3 NIP-98 HTTP Auth events for file uploads), each request opens its own popup window instead of queuing them into a single window. Users get spammed with N separate popups.',
    rootCause: 'Race condition in the popup creation logic. The openPromptMap (which tracks active prompt windows) is only populated inside an async .then() callback after browser.windows.create() resolves. When N requests arrive near-simultaneously, all N check openPromptMap before any .then() has fired — so all N see an empty map and each creates a new window.',
    fix: 'Added a pendingWindowPromise gate variable. The window acquisition now has a 3-way check: (1) existing tracked window in openPromptMap — reuse it, (2) pendingWindowPromise is set (another request is already creating a window) — await the same promise, (3) neither — create the popup and store the promise as a gate. The prompt UI already had pagination support for multiple queued requests.',
    code: `// BEFORE (broken): every concurrent request creates a new window
if (Object.values(openPromptMap).length > 0) {
  // reuse existing window
} else {
  // create new window — but openPromptMap is empty during async gap!
  browser.windows.create({ url, type: 'popup' });
}

// AFTER (fixed): pendingWindowPromise prevents concurrent creation
const existingEntry = Object.values(openPromptMap).find(({ windowId }) => windowId);
if (existingEntry) {
  windowPromise = browser.windows.get(existingEntry.windowId);
} else if (pendingWindowPromise) {
  windowPromise = pendingWindowPromise; // wait for in-flight creation
} else {
  pendingWindowPromise = browser.windows.create({ url, type: 'popup' });
  windowPromise = pendingWindowPromise;
}`,
  },
  {
    id: 'NFB-002',
    title: 'Coarse permission model with no per-capability control',
    severity: 'high',
    date: '2026-01-01',
    commit: '',
    file: 'src/types.ts, src/storage.ts, src/background.ts',
    symptom: 'The original nos2x-fox used a single numeric permission level (1/5/10/20) per site. Users could not grant getPublicKey without also granting signEvent. No way to allow read-only access or restrict to specific event kinds.',
    rootCause: 'The permission model was designed as a simple escalating trust level rather than a capability-based system. Level 1 = basic, level 10 = sign events, level 20 = encrypt/decrypt. No granularity, no expiration, no kind filtering.',
    fix: 'Replaced with a full per-capability grant system. Each site has individual grants for: getPublicKey, getRelays, signEvent, nip04.encrypt, nip04.decrypt, nip44.encrypt, nip44.decrypt. Grants have duration (once, 5m, 30m, 1h, 8h, 24h, session, forever), optional allowedKinds[] filter for signEvent, and automatic expiration. Legacy permissions are migrated on extension update.',
  },
  {
    id: 'NFB-003',
    title: 'No risk assessment for signing requests',
    severity: 'high',
    date: '2026-01-01',
    commit: '',
    file: 'src/types.ts, src/prompt.tsx',
    symptom: 'All signing requests looked identical in the prompt UI. A harmless NIP-42 relay auth event looked the same as a zap request or NIP-46 remote signing delegation. Users had no visual cue about the risk level of what they were approving.',
    rootCause: 'The original prompt UI was a simple approve/deny dialog with no event analysis. It displayed raw event data but provided no interpretation or risk context.',
    fix: 'Added a 4-tier risk classification system (low/medium/high/critical) based on event kind. The prompt now shows a color-coded risk banner, human-readable event kind names, site trust badges (NEW SITE, KNOWN SITE, FREQUENTLY DENIED), content previews, and tag breakdowns. Critical-risk events (zaps, wallet ops, NIP-46 remote signing) always prompt regardless of existing grants.',
  },
  {
    id: 'NFB-004',
    title: 'No flood protection against signing request spam',
    severity: 'high',
    date: '2026-01-01',
    commit: '',
    file: 'src/background.ts, src/prompt.tsx',
    symptom: 'A malicious or buggy website could send unlimited signEvent requests, each queuing into the prompt system with no throttling. Combined with NFB-001, this could spawn dozens of popup windows.',
    rootCause: 'No rate limiting or flood detection existed in the original extension.',
    fix: 'Added rate limiting (max 10 requests per 30-second window per host) with a rejection cooldown. The prompt UI detects floods (10+ pending requests) and shows a warning banner with a "Reject all N" button. A batch "Authorize all AUTH events" button handles legitimate NIP-42 relay auth floods.',
  },
  {
    id: 'NFB-005',
    title: 'React 19 dependency for a browser extension',
    severity: 'medium',
    date: '2026-01-01',
    commit: '',
    file: 'package.json, all .tsx files',
    symptom: 'The extension bundled React 19 + ReactDOM for a UI that consists of a popup, an options page, and a prompt dialog. Unnecessarily large bundle size for a browser extension that should be as lightweight as possible.',
    rootCause: 'The original nos2x-fox was built with React hooks (useState, useEffect, etc.) throughout all UI components.',
    fix: 'Complete migration to InfernoJS 9.0.11 — a React-compatible library that is significantly smaller and faster. All functional components with hooks were converted to class components. A react-shim.ts handles SVG component imports that expect React. Bundle size reduced substantially.',
  },
];

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
};

export function BugsFixedPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Bugs Fixed from nos2x-fox',
      description: 'A running log of critical bugs inherited from the upstream nos2x-fox extension that have been identified and fixed in nos2x-frog.',
    }),

    createElement('p', { className: 'text-sm text-muted-foreground' },
      'nos2x-fox was a functional but rough NIP-07 signer. nos2x-frog is a ground-up overhaul that fixes fundamental architectural issues while keeping NIP-07 compatibility. This page tracks every significant bug we\'ve squashed.',
    ),

    // Summary stats
    createElement('div', { className: 'flex gap-4 flex-wrap' },
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(BUGS.length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Bugs fixed'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold text-destructive' }, String(BUGS.filter(b => b.severity === 'critical').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Critical'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(BUGS.filter(b => b.severity === 'high').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'High'),
      ),
    ),

    // Bug entries
    ...BUGS.map((bug) =>
      createElement('div', { key: bug.id, className: 'space-y-4' },
        createElement(SectionHeading, { id: bug.id.toLowerCase() },
          createElement('span', { className: 'flex items-center gap-3' },
            createElement('code', { className: 'text-xs font-mono text-muted-foreground' }, bug.id),
            bug.title,
          ),
        ),

        createElement('div', { className: 'flex flex-wrap items-center gap-2 text-xs' },
          createElement(Badge, { variant: SEVERITY_BADGE[bug.severity] as any }, bug.severity.toUpperCase()),
          createElement('span', { className: 'text-muted-foreground' }, bug.date),
          bug.commit
            ? createElement('a', {
                href: `https://github.com/TekkadanPlays/nos2x-frog/commit/${bug.commit}`,
                target: '_blank',
                rel: 'noopener',
                className: 'font-mono text-primary hover:underline',
              }, bug.commit.substring(0, 7))
            : null,
          createElement('code', { className: 'text-muted-foreground' }, bug.file),
        ),

        createElement('div', { className: 'space-y-3 text-sm' },
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Symptom'),
            createElement('p', { className: 'text-muted-foreground' }, bug.symptom),
          ),
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Root Cause'),
            createElement('p', { className: 'text-muted-foreground' }, bug.rootCause),
          ),
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Fix'),
            createElement('p', { className: 'text-muted-foreground' }, bug.fix),
          ),
        ),

        bug.code
          ? createElement(CodeBlock, { code: bug.code, lang: 'typescript' })
          : null,
      ),
    ),
  );
}
