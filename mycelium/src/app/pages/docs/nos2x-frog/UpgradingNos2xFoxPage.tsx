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
