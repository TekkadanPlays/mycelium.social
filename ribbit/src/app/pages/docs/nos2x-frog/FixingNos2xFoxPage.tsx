import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';

// ---------------------------------------------------------------------------
// Fixing nos2x-fox — inherited bugs from the upstream codebase
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
  {
    id: 'NFB-006',
    title: 'Profile save broken by audit log filling storage quota',
    severity: 'critical',
    date: '2026-02-18',
    commit: '',
    file: 'src/options.tsx, src/requestLog.ts',
    symptom: 'Creating or saving a profile throws QuotaExceededError. The "Clear audit log" button in Danger Zone also fails with the same error. The extension becomes unable to persist any data.',
    rootCause: 'The audit log (AUDIT_LOG key in browser.storage.local) grew unbounded and consumed the entire 5 MB storage quota. When the quota is critically full, even browser.storage.local.remove() fails — the browser\'s quota check fires on any write transaction, including deletions.',
    fix: 'Two-layer fix: (1) The audit log flush in requestLog.ts now catches QuotaExceededError and aggressively trims to 25% of entries, or nukes the log entirely if still over quota. (2) saveNewProfile wraps the storage write in a try/catch — on quota failure it performs a surgical clear: reads essential keys (profiles, private keys, permissions) into memory, calls browser.storage.local.clear() (the only API that always succeeds regardless of quota), then restores the essentials without the bloated audit log. The Danger Zone "Clear audit log" button uses the same surgical clear+restore approach.',
    code: `// Surgical clear — the only way to free space when quota is critically full
const keysToKeep = [
  'private_key', 'profiles', 'pin_enabled', 'encrypted_private_key',
  'active_public_key', 'pin_cache_duration', 'nip42_auto_sign',
  'site_permissions', 'security_preferences',
];
const essentials = await browser.storage.local.get(keysToKeep);
await browser.storage.local.clear(); // always succeeds
await browser.storage.local.set(essentials); // restore without audit log`,
  },
  {
    id: 'NFB-008',
    title: 'SVG icons invisible on dark background',
    severity: 'medium',
    date: '2026-02-18',
    commit: '',
    file: 'src/style.scss, src/assets/icons/*.svg',
    symptom: 'All Ionicon SVG icons in the options page were nearly invisible — rendering as black shapes on the dark (#1a1a1e) background.',
    rootCause: 'Two issues: (1) Many Ionicon SVGs have shape elements (<ellipse>, <circle>, <path>) with no fill attribute, which defaults to fill:black in SVG. (2) The CSS used attribute selectors like svg :not([fill]) to catch these, but esbuild-plugin-svgr converts SVGs to JSX components that set DOM properties, not HTML attributes — so the CSS selectors never matched.',
    fix: 'Replaced the unreliable attribute selectors with a blanket CSS rule that forces all SVG shape elements (path, circle, ellipse, rect, line, polyline, polygon) to fill:currentColor and stroke:currentColor, with a higher-specificity [fill="none"] { fill: none !important } rule to preserve stroke-only outlines. Also added explicit fill="currentColor" to all affected SVG source files as belt-and-suspenders.',
  },
];

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
};

export function FixingNos2xFoxPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Fixing nos2x-fox',
      description: 'Critical bugs inherited from the upstream nos2x-fox codebase that we identified and fixed in nos2x-frog.',
    }),

    createElement('p', { className: 'text-sm text-muted-foreground' },
      'These are bugs that existed in nos2x-fox before we forked it. They range from race conditions in popup window management to storage quota failures that brick the extension. Each entry documents the symptom, root cause, and our fix.',
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
        createElement('p', { className: 'text-2xl font-bold' }, String(BUGS.filter(b => b.severity === 'medium').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Medium'),
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
