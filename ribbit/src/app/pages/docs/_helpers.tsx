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

export function PageHeader({ title, description }: { title: string; description: string }) {
  return createElement('div', { className: 'mb-8' },
    createElement('h1', { className: 'text-2xl font-bold tracking-tight mb-2' }, title),
    createElement('p', { className: 'text-muted-foreground' }, description),
  );
}
