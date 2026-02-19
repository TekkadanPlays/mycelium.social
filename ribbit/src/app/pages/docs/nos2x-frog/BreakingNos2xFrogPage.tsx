import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading } from '../_helpers';
import { Badge } from '../../../ui/Badge';

// ---------------------------------------------------------------------------
// Breaking nos2x-frog — bugs introduced by our own modifications
// A running log. New entries are added at the top as bugs are discovered.
// ---------------------------------------------------------------------------

interface BreakEntry {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  date: string;
  file: string;
  symptom: string;
  cause: string;
  fix: string;
  status: 'fixed' | 'open';
}

const BREAKS: BreakEntry[] = [
  // Add new entries here as bugs are discovered
];

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
};

export function BreakingNos2xFrogPage() {
  const fixed = BREAKS.filter(b => b.status === 'fixed').length;
  const open = BREAKS.filter(b => b.status === 'open').length;

  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Breaking nos2x-frog',
      description: 'A running log of bugs introduced by our own modifications to nos2x-frog. Transparency about what we\'ve broken and how we\'ve fixed it.',
    }),

    createElement('p', { className: 'text-sm text-muted-foreground' },
      'Every codebase accumulates bugs during active development. This page tracks bugs that we introduced ourselves \u2014 not inherited from nos2x-fox, but caused by our own changes. Each entry documents what broke, why, and how it was resolved.',
    ),

    // Summary stats
    createElement('div', { className: 'flex gap-4 flex-wrap' },
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold' }, String(BREAKS.length)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Total'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold text-green-600' }, String(fixed)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Fixed'),
      ),
      createElement('div', { className: 'rounded-lg border border-border px-4 py-3' },
        createElement('p', { className: 'text-2xl font-bold text-destructive' }, String(open)),
        createElement('p', { className: 'text-xs text-muted-foreground' }, 'Open'),
      ),
    ),

    // Empty state
    BREAKS.length === 0
      ? createElement('div', { className: 'rounded-lg border border-dashed border-border p-12 text-center' },
          createElement('p', { className: 'text-lg font-medium mb-1' }, 'No bugs logged yet'),
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'This is a good sign \u2014 but also means we might not have caught them yet. Bugs will be documented here as they\'re discovered during development and testing.',
          ),
        )
      : null,

    // Bug entries
    ...BREAKS.map((bug) =>
      createElement('div', { key: bug.id, className: 'space-y-4' },
        createElement(SectionHeading, { id: bug.id.toLowerCase() },
          createElement('span', { className: 'flex items-center gap-3' },
            createElement('code', { className: 'text-xs font-mono text-muted-foreground' }, bug.id),
            bug.title,
            bug.status === 'open'
              ? createElement(Badge, { variant: 'destructive', className: 'ml-2 text-[10px]' }, 'OPEN')
              : createElement(Badge, { variant: 'outline', className: 'ml-2 text-[10px]' }, 'FIXED'),
          ),
        ),

        createElement('div', { className: 'flex flex-wrap items-center gap-2 text-xs' },
          createElement(Badge, { variant: (SEVERITY_BADGE[bug.severity] ?? 'secondary') as any }, bug.severity.toUpperCase()),
          createElement('span', { className: 'text-muted-foreground' }, bug.date),
          createElement('code', { className: 'text-muted-foreground' }, bug.file),
        ),

        createElement('div', { className: 'space-y-3 text-sm' },
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Symptom'),
            createElement('p', { className: 'text-muted-foreground' }, bug.symptom),
          ),
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, 'Cause'),
            createElement('p', { className: 'text-muted-foreground' }, bug.cause),
          ),
          createElement('div', null,
            createElement('p', { className: 'font-semibold mb-1' }, bug.status === 'fixed' ? 'Fix' : 'Status'),
            createElement('p', { className: 'text-muted-foreground' }, bug.fix),
          ),
        ),
      ),
    ),
  );
}
