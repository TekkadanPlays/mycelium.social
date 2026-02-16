import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from '../../ui/utils';
import { createHighlighter, type Highlighter } from 'shiki';

// ---------------------------------------------------------------------------
// Shared Shiki highlighter (lazy singleton)
// ---------------------------------------------------------------------------

let _highlighter: Highlighter | null = null;
let _highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (_highlighter) return Promise.resolve(_highlighter);
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'tsx', 'javascript', 'jsx', 'bash', 'css', 'json', 'html', 'kotlin'],
    }).then((h) => { _highlighter = h; return h; });
  }
  return _highlighterPromise;
}

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

// ---------------------------------------------------------------------------
// CodeBlock — syntax-highlighted via Shiki
// ---------------------------------------------------------------------------

interface CodeBlockProps {
  code: string;
  lang?: string;
}

interface CodeBlockState {
  html: string;
}

export class CodeBlock extends Component<CodeBlockProps, CodeBlockState> {
  declare state: CodeBlockState;

  constructor(props: CodeBlockProps) {
    super(props);
    this.state = { html: '' };
  }

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate(prevProps: CodeBlockProps) {
    if (prevProps.code !== this.props.code || prevProps.lang !== this.props.lang) {
      this.highlight();
    }
  }

  private highlight() {
    const { code, lang } = this.props;
    getHighlighter().then((highlighter) => {
      const detected = lang || this.detectLang(code);
      const html = highlighter.codeToHtml(code, {
        lang: detected,
        themes: { dark: 'github-dark', light: 'github-light' },
        defaultColor: false,
      });
      this.setState({ html });
    }).catch(() => {
      // Fallback: no highlighting
    });
  }

  private detectLang(code: string): string {
    if (code.includes('import ') || code.includes('export ') || code.includes('const ') || code.includes('createElement')) return 'typescript';
    if (code.includes('fun ') || code.includes('val ') || code.includes('class ') && code.includes('override')) return 'kotlin';
    if (code.includes('@custom-variant') || code.includes('oklch(') || code.includes('--')) return 'css';
    if (code.startsWith('{') || code.startsWith('[')) return 'json';
    if (code.includes('$ ') || code.includes('bun ') || code.includes('npm ')) return 'bash';
    return 'typescript';
  }

  render() {
    const { code } = this.props;
    const { html } = this.state;

    if (html) {
      return createElement('div', {
        className: 'shiki-wrapper rounded-lg border border-border overflow-x-auto text-xs leading-relaxed [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-muted/50',
        dangerouslySetInnerHTML: { __html: html },
      });
    }

    // Fallback while Shiki loads
    return createElement('pre', {
      className: 'rounded-lg bg-muted/50 border border-border p-4 text-xs font-mono text-muted-foreground overflow-x-auto leading-relaxed',
    }, createElement('code', null, code));
  }
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

// ---------------------------------------------------------------------------
// PageCopyButton — "Copy page | v" dropdown at top-right of each doc page
// ---------------------------------------------------------------------------

interface PageCopyState {
  open: boolean;
  copied: boolean;
}

function getPageTextContent(): string {
  const main = document.querySelector('[data-slot="doc-page"]');
  return main ? (main as HTMLElement).innerText : document.body.innerText;
}

function getPageMarkdown(title: string, description: string): string {
  const lines: string[] = [];
  lines.push(`# ${title}\n`);
  lines.push(`${description}\n`);

  const main = document.querySelector('[data-slot="doc-page"]');
  if (!main) return lines.join('\n');

  // Walk through sections
  const sections = main.querySelectorAll('[id]');
  sections.forEach((section) => {
    const heading = section.querySelector('h2');
    if (heading) lines.push(`\n## ${heading.textContent}\n`);
  });

  // Collect code blocks
  const codeBlocks = main.querySelectorAll('pre code, .shiki-wrapper pre');
  codeBlocks.forEach((block) => {
    const code = (block as HTMLElement).textContent || '';
    lines.push('\n```\n' + code.trim() + '\n```\n');
  });

  // Collect prop tables
  const tables = main.querySelectorAll('table');
  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, i) => {
      const cells = row.querySelectorAll('th, td');
      const vals = Array.from(cells).map((c) => (c as HTMLElement).textContent || '');
      lines.push('| ' + vals.join(' | ') + ' |');
      if (i === 0) lines.push('| ' + vals.map(() => '---').join(' | ') + ' |');
    });
    lines.push('');
  });

  return lines.join('\n');
}

export class PageCopyButton extends Component<{ title: string; description: string }, PageCopyState> {
  declare state: PageCopyState;
  private ref: HTMLDivElement | null = null;

  constructor(props: { title: string; description: string }) {
    super(props);
    this.state = { open: false, copied: false };
  }

  private handleOutside = (e: MouseEvent) => {
    if (this.state.open && this.ref && !this.ref.contains(e.target as Node)) {
      this.setState({ open: false });
    }
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.setState({ open: false });
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutside);
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutside);
    document.removeEventListener('keydown', this.handleKey);
  }

  private copyPage = () => {
    const text = getPageTextContent();
    navigator.clipboard.writeText(text).then(() => {
      this.setState({ copied: true, open: false });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  private copyMarkdown = () => {
    const md = getPageMarkdown(this.props.title, this.props.description);
    navigator.clipboard.writeText(md).then(() => {
      this.setState({ copied: true, open: false });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  private viewMarkdown = () => {
    const md = getPageMarkdown(this.props.title, this.props.description);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    this.setState({ open: false });
  };

  private viewPlainText = () => {
    const text = getPageTextContent();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    this.setState({ open: false });
  };

  render() {
    const { open, copied } = this.state;

    // Clipboard icon
    const clipIcon = createElement('svg', {
      className: 'size-3.5',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2' }),
      createElement('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
    );

    // Check icon
    const checkIcon = createElement('svg', {
      className: 'size-3.5 text-success',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, createElement('path', { d: 'M20 6L9 17l-5-5' }));

    // External link icon
    const extIcon = createElement('svg', {
      className: 'size-3.5',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
      createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
      createElement('polyline', { points: '15 3 21 3 21 9' }),
      createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' }),
    );

    // Chevron icon
    const chevron = createElement('svg', {
      className: cn('size-3 transition-transform', open && 'rotate-180'),
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }, createElement('path', { d: 'M6 9l6 6 6-6' }));

    return createElement('div', {
      ref: (el: HTMLDivElement | null) => { this.ref = el; },
      className: 'relative inline-flex',
    },
      // Split button
      createElement('div', { className: 'inline-flex items-center rounded-md border border-input shadow-xs' },
        // Main copy button
        createElement('button', {
          type: 'button',
          onClick: this.copyPage,
          className: 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-l-md cursor-pointer',
        }, copied ? checkIcon : clipIcon, copied ? 'Copied!' : 'Copy page'),
        // Divider
        createElement('div', { className: 'w-px h-5 bg-border' }),
        // Dropdown toggle
        createElement('button', {
          type: 'button',
          onClick: () => this.setState((s: PageCopyState) => ({ open: !s.open })),
          className: 'inline-flex items-center px-1.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-r-md cursor-pointer',
        }, chevron),
      ),

      // Dropdown menu
      open
        ? createElement('div', {
            className: 'absolute right-0 top-full z-50 mt-1 w-64 rounded-md border bg-popover p-1 shadow-md',
          },
            // Copy page
            createElement('button', {
              type: 'button',
              onClick: this.copyPage,
              className: 'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
            }, clipIcon, 'Copy page'),
            // Copy as Markdown for LLMs
            createElement('button', {
              type: 'button',
              onClick: this.copyMarkdown,
              className: 'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
            }, clipIcon, 'Copy as Markdown'),
            // Separator
            createElement('div', { className: 'my-1 h-px bg-border' }),
            // View as Markdown
            createElement('button', {
              type: 'button',
              onClick: this.viewMarkdown,
              className: 'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
            }, extIcon, 'View as Markdown'),
            // View as plain text
            createElement('button', {
              type: 'button',
              onClick: this.viewPlainText,
              className: 'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
            }, extIcon, 'View as plain text'),
          )
        : null,
    );
  }
}

// ---------------------------------------------------------------------------
// PageHeader — title + description + copy button
// ---------------------------------------------------------------------------

export function PageHeader({ title, description }: { title: string; description: string }) {
  return createElement('div', { className: 'mb-8' },
    createElement('div', { className: 'flex items-start justify-between gap-4' },
      createElement('div', null,
        createElement('h1', { className: 'text-2xl font-bold tracking-tight mb-2' }, title),
        createElement('p', { className: 'text-muted-foreground' }, description),
      ),
      createElement(PageCopyButton, { title, description }),
    ),
  );
}
