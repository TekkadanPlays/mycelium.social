import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading } from '../_helpers';
import { Badge } from '../../../ui/Badge';

// ---------------------------------------------------------------------------
// Upgrading nos2x-fox — architectural improvements and redesigns
// ---------------------------------------------------------------------------

interface UpgradeEntry {
  id: string;
  title: string;
  scope: 'architecture' | 'security' | 'ux';
  date: string;
  files: string;
  before: string;
  after: string;
  details: string;
}

const UPGRADES: UpgradeEntry[] = [
  {
    id: 'NFU-001',
    title: 'Per-capability permission system',
    scope: 'security',
    date: '2026-01-01',
    files: 'src/types.ts, src/storage.ts, src/background.ts',
    before: 'A single numeric permission level (1/5/10/20) per site. Users could not grant getPublicKey without also granting signEvent. No way to allow read-only access or restrict to specific event kinds. No expiration.',
    after: 'Each site has individual grants for: getPublicKey, getRelays, signEvent, nip04.encrypt, nip04.decrypt, nip44.encrypt, nip44.decrypt. Grants have configurable duration (once, 5m, 30m, 1h, 8h, 24h, session, forever), optional allowedKinds[] filter for signEvent, and automatic expiration. Legacy permissions are migrated on extension update.',
    details: 'The new system stores permissions as a map of site origin \u2192 capability grants. Each grant records the capability name, duration, creation timestamp, and optional kind filter. The background script checks grants before prompting \u2014 if a valid non-expired grant exists for the requested capability, the request is auto-approved silently.',
  },
  {
    id: 'NFU-002',
    title: 'Risk assessment engine for signing requests',
    scope: 'security',
    date: '2026-01-01',
    files: 'src/types.ts, src/prompt.tsx',
    before: 'All signing requests looked identical in the prompt UI. A harmless NIP-42 relay auth event looked the same as a zap request or NIP-46 remote signing delegation. Users had no visual cue about the risk level of what they were approving.',
    after: 'A 4-tier risk classification system (low/medium/high/critical) based on event kind. The prompt shows a color-coded risk banner, human-readable event kind names, site trust badges (NEW SITE, KNOWN SITE, FREQUENTLY DENIED), content previews, and tag breakdowns. Critical-risk events (zaps, wallet ops, NIP-46 remote signing) always prompt regardless of existing grants.',
    details: 'Risk tiers: Low = metadata updates, relay lists, contact lists. Medium = text notes, reactions, reposts. High = DMs, channel messages, application-specific events. Critical = zaps (kind 9734/9735), NIP-46 remote signing (kind 24133), wallet operations. The prompt UI adapts its layout based on risk \u2014 critical events get a red banner and expanded detail view.',
  },
  {
    id: 'NFU-003',
    title: 'Flood protection and rate limiting',
    scope: 'security',
    date: '2026-01-01',
    files: 'src/background.ts, src/prompt.tsx',
    before: 'A malicious or buggy website could send unlimited signEvent requests, each queuing into the prompt system with no throttling. Combined with the popup race condition (NFB-001), this could spawn dozens of popup windows.',
    after: 'Rate limiting at 10 requests per 30-second window per host with a rejection cooldown. The prompt UI detects floods (10+ pending requests) and shows a warning banner with a "Reject all N" button. A batch "Authorize all AUTH events" button handles legitimate NIP-42 relay auth floods.',
    details: 'The rate limiter uses a sliding window counter per origin. When the limit is hit, subsequent requests are auto-rejected with a descriptive error message. The cooldown prevents the site from immediately retrying. The prompt UI groups pending requests by type and shows batch action buttons when appropriate.',
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
  architecture: { variant: 'secondary', label: 'ARCHITECTURE' },
  security: { variant: 'destructive', label: 'SECURITY' },
  ux: { variant: 'default', label: 'UX' },
};

export function UpgradingNos2xFoxPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Upgrading nos2x-fox',
      description: 'Architectural improvements and redesigns that transform nos2x-fox into nos2x-frog.',
    }),

    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Beyond fixing inherited bugs, nos2x-frog introduces fundamental architectural changes. These aren\'t patches \u2014 they\'re redesigns of core systems that were inadequate in the original extension. Each entry documents what existed before, what we built to replace it, and why.',
    ),

    // Summary
    createElement('div', { className: 'flex gap-4 flex-wrap' },
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(UPGRADES.length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Major upgrades'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold text-destructive' }, String(UPGRADES.filter(u => u.scope === 'security').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Security'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(UPGRADES.filter(u => u.scope === 'ux').length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'UX'),
      ),
    ),

    // Upgrade entries
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
      ),
    ),
  );
}
