import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';
import { Badge } from '../../../ui/Badge';

// ---------------------------------------------------------------------------
// Upgrading nos2x-frog — bugs found and improvements made during our own dev
// ---------------------------------------------------------------------------

interface UpgradeEntry {
  id: string;
  title: string;
  scope: 'critical' | 'medium' | 'low' | 'ux';
  date: string;
  files: string;
  before: string;
  after: string;
  details: string;
  code?: string;
}

const UPGRADES: UpgradeEntry[] = [
  {
    id: 'NFB-006',
    title: 'Profile save broken by audit log filling storage quota',
    scope: 'critical',
    date: '2026-02-18',
    files: 'src/options.tsx, src/requestLog.ts',
    before: 'Creating or saving a profile throws QuotaExceededError. The "Clear audit log" button in Danger Zone also fails with the same error. The extension becomes unable to persist any data.',
    after: 'Two-layer fix: (1) The audit log flush in requestLog.ts now catches QuotaExceededError and aggressively trims to 25% of entries, or nukes the log entirely if still over quota. (2) saveNewProfile wraps the storage write in a try/catch \u2014 on quota failure it performs a surgical clear: reads essential keys into memory, calls browser.storage.local.clear() (the only API that always succeeds regardless of quota), then restores the essentials without the bloated audit log.',
    details: 'The audit log (AUDIT_LOG key in browser.storage.local) grew unbounded and consumed the entire 5 MB storage quota. When the quota is critically full, even browser.storage.local.remove() fails \u2014 the browser\'s quota check fires on any write transaction, including deletions. The Danger Zone "Clear audit log" button uses the same surgical clear+restore approach.',
    code: `// Surgical clear \u2014 the only way to free space when quota is critically full\nconst keysToKeep = [\n  'private_key', 'profiles', 'pin_enabled', 'encrypted_private_key',\n  'active_public_key', 'pin_cache_duration', 'nip42_auto_sign',\n  'site_permissions', 'security_preferences',\n];\nconst essentials = await browser.storage.local.get(keysToKeep);\nawait browser.storage.local.clear(); // always succeeds\nawait browser.storage.local.set(essentials); // restore without audit log`,
  },
  {
    id: 'NFB-008',
    title: 'SVG icons invisible on dark background',
    scope: 'low',
    date: '2026-02-18',
    files: 'src/style.scss, src/assets/icons/*.svg',
    before: 'All Ionicon SVG icons in the options page were nearly invisible \u2014 rendering as black shapes on the dark (#1a1a1e) background.',
    after: 'Replaced the unreliable attribute selectors with a blanket CSS rule that forces all SVG shape elements (path, circle, ellipse, rect, line, polyline, polygon) to fill:currentColor and stroke:currentColor, with a higher-specificity [fill="none"] { fill: none !important } rule to preserve stroke-only outlines. Also added explicit fill="currentColor" to all affected SVG source files.',
    details: 'Two issues: (1) Many Ionicon SVGs have shape elements (<ellipse>, <circle>, <path>) with no fill attribute, which defaults to fill:black in SVG. (2) The CSS used attribute selectors like svg :not([fill]) to catch these, but esbuild-plugin-svgr converts SVGs to JSX components that set DOM properties, not HTML attributes \u2014 so the CSS selectors never matched.',
  },
  {
    id: 'NFU-004',
    title: 'Profile management overhaul',
    scope: 'ux',
    date: '2026-02-18',
    files: 'src/options.tsx',
    before: 'Creating a new profile used an empty-string key ("") as a sentinel value in the profiles map. This caused subtle bugs: the empty key could persist in storage, the active profile pill had no way to deselect during creation, and canceling creation left stale state. The code used a single privateKey state field for both viewing existing profiles and entering new ones.',
    after: 'Clean isCreatingProfile boolean flag and a separate newProfileKey state field. Profile creation is fully isolated from existing profile viewing. Cancel properly resets state and reloads the previously selected profile. The profiles map is never mutated \u2014 all updates use immutable spreads. Storage writes are wrapped in quota-aware try/catch with surgical clear recovery.',
    details: 'The profile UI now has three distinct modes: viewing (shows selected profile details), creating (isolated form with its own state), and editing (inline field updates). Transitions between modes are explicit and clean up after themselves. The active profile indicator in the popup updates immediately via browser.storage.onChanged listeners.',
  },
];

const SCOPE_BADGE: Record<string, { variant: string; label: string }> = {
  critical: { variant: 'destructive', label: 'CRITICAL' },
  medium: { variant: 'secondary', label: 'MEDIUM' },
  low: { variant: 'outline', label: 'LOW' },
  ux: { variant: 'default', label: 'UX' },
};

export function BreakingNos2xFrogPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Upgrading nos2x-frog',
      description: 'Bugs discovered and improvements made during our own development of nos2x-frog.',
    }),

    createElement('p', { className: 'text-sm text-muted-foreground' },
      'These are issues we discovered and fixed during active development of nos2x-frog \u2014 not inherited from nos2x-fox, but found through our own testing and usage. Each entry documents what was wrong, how we fixed it, and the technical details.',
    ),

    // Summary
    createElement('div', { className: 'flex gap-4 flex-wrap' },
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(UPGRADES.length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Total changes'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold text-destructive' }, String(UPGRADES.filter(u => u.scope === 'critical').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Critical'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(UPGRADES.filter(u => u.scope === 'ux').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'UX'),
      ),
    ),

    // Entries
    ...UPGRADES.map((u) =>
      createElement('div', { key: u.id, className: 'space-y-4' },
        createElement(SectionHeading, { id: u.id.toLowerCase() },
          createElement('span', { className: 'flex items-center gap-3' },
            createElement('code', { className: 'text-xs font-mono text-muted-foreground' }, u.id),
            u.title,
          ),
        ),

        createElement('div', { className: 'flex flex-wrap items-center gap-2 text-xs' },
          createElement(Badge, { variant: (SCOPE_BADGE[u.scope]?.variant ?? 'secondary') as any }, SCOPE_BADGE[u.scope]?.label ?? u.scope.toUpperCase()),
          createElement('span', { className: 'text-muted-foreground' }, u.date),
          createElement('code', { className: 'text-muted-foreground' }, u.files),
        ),

        createElement('div', { className: 'space-y-3 text-sm' },
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Before'),
            createElement('p', { className: 'text-muted-foreground' }, u.before),
          ),
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'After'),
            createElement('p', { className: 'text-muted-foreground' }, u.after),
          ),
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Details'),
            createElement('p', { className: 'text-muted-foreground' }, u.details),
          ),
        ),

        u.code
          ? createElement(CodeBlock, { code: u.code, lang: 'typescript' })
          : null,
      ),
    ),
  );
}
