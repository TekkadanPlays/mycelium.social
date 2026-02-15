import { createElement } from 'inferno-create-element';
import { cn } from '../../ui/utils';

export function SectionHeading({ id, children }: { id: string; children?: any }) {
  return createElement('div', { id, className: 'scroll-mt-20 mb-6' },
    createElement('h2', {
      className: 'text-xl font-bold tracking-tight pb-1 border-b border-border w-fit',
    }, children),
  );
}

export function ExampleRow({ label, children }: { label: string; children?: any }) {
  return createElement('div', { className: 'space-y-2' },
    createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, label),
    createElement('div', { className: 'flex flex-wrap items-center gap-3' }, children),
  );
}

export function DemoBox({ children, className }: { children?: any; className?: string }) {
  return createElement('div', {
    className: cn(
      'flex items-center justify-center rounded-lg border border-border p-8',
      className,
    ),
    style: {
      backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
    },
  }, children);
}

export function CodeBlock({ code }: { code: string }) {
  return createElement('pre', {
    className: 'rounded-lg bg-muted/50 border border-border p-4 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed',
  }, createElement('code', null, code));
}

export function PropTable({ rows }: { rows: Array<{ prop: string; type: string; default: string }> }) {
  return createElement('div', { className: 'overflow-x-auto' },
    createElement('table', { className: 'w-full text-sm' },
      createElement('thead', null,
        createElement('tr', { className: 'border-b border-border' },
          createElement('th', { className: 'text-left py-2 pr-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground' }, 'Prop'),
          createElement('th', { className: 'text-left py-2 pr-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground' }, 'Type'),
          createElement('th', { className: 'text-left py-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground' }, 'Default'),
        ),
      ),
      createElement('tbody', null,
        ...rows.map((row) =>
          createElement('tr', { key: row.prop, className: 'border-b border-border/50' },
            createElement('td', { className: 'py-2 pr-4 font-mono text-xs text-primary' }, row.prop),
            createElement('td', { className: 'py-2 pr-4 font-mono text-xs text-muted-foreground' }, row.type),
            createElement('td', { className: 'py-2 font-mono text-xs' }, row.default),
          ),
        ),
      ),
    ),
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return createElement('div', { className: 'mb-8' },
    createElement('h1', { className: 'text-2xl font-bold tracking-tight mb-2' }, title),
    createElement('p', { className: 'text-muted-foreground' }, description),
  );
}
