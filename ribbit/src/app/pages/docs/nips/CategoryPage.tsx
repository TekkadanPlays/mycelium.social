import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../../../ui/Badge';
import { PageHeader } from '../_helpers';
import { CATEGORIES, type CategoryDef } from './index';

// Reusable category page — renders the NIP table for a given range slug (e.g. '1xx')
function renderCategory(cat: CategoryDef) {
  const implemented = cat.nips.filter((n) => n.kaji === true || n.mycelium === true).length;

  return createElement('div', { className: 'space-y-6' },
    createElement(PageHeader, {
      title: cat.range + ' — ' + cat.title,
      description: cat.description,
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-2' },
      createElement(Badge, null, cat.nips.length + ' NIPs'),
      implemented > 0
        ? createElement(Badge, { variant: 'secondary' }, implemented + ' implemented')
        : null,
      createElement(Badge, { variant: 'outline' }, cat.range),
    ),

    // NIP table
    createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
      createElement('table', { className: 'w-full text-sm' },
        createElement('thead', null,
          createElement('tr', { className: 'border-b border-border bg-muted/30' },
            createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-16' }, 'New'),
            createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-16' }, 'Old'),
            createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Title'),
            createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-14' }, 'Kaji'),
            createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-14' }, 'Mycelium'),
          ),
        ),
        createElement('tbody', null,
          ...cat.nips.map((nip, i) =>
            createElement('tr', {
              key: nip.num,
              className: i < cat.nips.length - 1 ? 'border-b border-border/50' : '',
            },
              createElement('td', { className: 'px-3 py-2 font-mono text-xs' }, nip.num),
              createElement('td', { className: 'px-3 py-2 font-mono text-xs text-muted-foreground' }, nip.old),
              createElement('td', { className: 'px-3 py-2' },
                createElement('span', { className: nip.deprecated ? 'line-through text-muted-foreground' : '' }, nip.title),
                nip.deprecated ? createElement('span', { className: 'ml-2 text-xs text-destructive' }, 'deprecated') : null,
              ),
              createElement('td', { className: 'px-3 py-2 text-center' },
                nip.kaji === true ? '\u2705'
                  : nip.kaji === 'partial' ? '\u26A0\uFE0F'
                  : createElement('span', { className: 'text-muted-foreground/30' }, '\u2014'),
              ),
              createElement('td', { className: 'px-3 py-2 text-center' },
                nip.mycelium === true ? '\u2705'
                  : nip.mycelium === 'partial' ? '\u26A0\uFE0F'
                  : createElement('span', { className: 'text-muted-foreground/30' }, '\u2014'),
              ),
            ),
          ),
        ),
      ),
    ),

    // Legend
    createElement('div', { className: 'flex flex-wrap gap-4 text-xs text-muted-foreground' },
      createElement('span', null, '\u2705 Implemented'),
      createElement('span', null, '\u26A0\uFE0F Partial'),
      createElement('span', null, '\u2014 Not yet'),
    ),

    // Back link
    createElement(Link, {
      to: '/docs/nips',
      className: 'inline-flex items-center gap-1 text-xs text-primary hover:underline',
    }, '\u2190 All categories'),
  );
}

// One exported component per category range
export function Nips1xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '1xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips2xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '2xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips3xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '3xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips4xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '4xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips5xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '5xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips6xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '6xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips7xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '7xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips8xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '8xx');
  return cat ? renderCategory(cat) : null;
}
export function Nips9xxPage() {
  const cat = CATEGORIES.find((c) => c.range === '9xx');
  return cat ? renderCategory(cat) : null;
}
