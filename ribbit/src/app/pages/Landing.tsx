import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Separator } from '../ui/Separator';
import { toast } from '../ui/Toast';
import { login } from '../store/auth';

let _glowDocs = false;
let _glowTimer: ReturnType<typeof setTimeout> | null = null;
let _glowListeners: Set<() => void> = new Set();
function setGlowDocs(v: boolean) { _glowDocs = v; _glowListeners.forEach(fn => fn()); }
function subscribeGlow(fn: () => void) { _glowListeners.add(fn); return () => { _glowListeners.delete(fn); }; }

function handleFeedClick(e: Event) {
  e.preventDefault();
  toast.error('Feed currently unavailable', {
    description: 'Check out the docs to explore the ribbit.network ecosystem.',
  });
  // Always extend the glow timer on repeated clicks
  if (_glowTimer) clearTimeout(_glowTimer);
  if (!_glowDocs) setGlowDocs(true);
  _glowTimer = setTimeout(() => { _glowTimer = null; setGlowDocs(false); }, 4000);
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PROJECTS = [
  {
    icon: '\uD83D\uDC38',
    name: 'Ribbit',
    desc: 'Full-featured Nostr social client for web and Android. Follow feeds, reactions, threads, relay management, and NIP-29 groups.',
    tags: ['InfernoJS', 'Nostr', 'Social'],
    href: '/docs/ribbit',
  },
  {
    icon: '\uD83D\uDD25',
    name: 'Kaji',
    desc: 'Zero-dependency Nostr protocol library. Events, signing, relay pools, thread parsing, reactions, groups \u2014 11 modules, ~2.5 KB gzipped.',
    tags: ['TypeScript', 'Library', '11 modules'],
    href: '/docs/kaji',
  },
  {
    icon: '\u26A1',
    name: 'Blazecn',
    desc: 'InfernoJS component library inspired by shadcn/ui. 24+ accessible components with full light/dark theming via CSS custom properties.',
    tags: ['Components', 'Tailwind', '24+ parts'],
    href: '/docs/blazecn',
  },
  {
    icon: '\uD83D\uDD10',
    name: 'nos2x-frog',
    desc: 'NIP-07 browser extension fork with enhanced permission management, relay configuration, and multi-account support.',
    tags: ['Extension', 'NIP-07', 'Security'],
    href: '/docs/nos2x-frog',
  },
  {
    icon: '\uD83D\uDCF1',
    name: 'Ribbit Android',
    desc: 'Native Android client built with Jetpack Compose and Material Design 3. Tabbed relay manager, NIP-11 caching, wallet zaps, and thread views.',
    tags: ['Android', 'Kotlin', 'Compose'],
    href: '/docs/ribbit-android',
  },
  {
    icon: '\uD83D\uDCDC',
    name: 'NIPs',
    desc: 'Categorical reorganization of the Nostr specification. 69 NIPs across 9 numbered categories for easier discovery.',
    tags: ['Protocol', '9 categories', 'Fork'],
    href: '/docs/nips',
  },
];

const FEATURES = [
  {
    icon: '\uD83C\uDF10',
    title: 'Censorship Resistant',
    desc: 'No central server. Your posts live on relays you choose. No one can silence you.',
  },
  {
    icon: '\uD83D\uDD11',
    title: 'Own Your Identity',
    desc: 'Cryptographic keys, not email/password. Your identity is portable across every Nostr client.',
  },
  {
    icon: '\u26A1',
    title: 'Blazing Fast',
    desc: 'Built on InfernoJS \u2014 the fastest virtual DOM library. Sub-millisecond renders, tiny bundle.',
  },
  {
    icon: '\uD83C\uDF19',
    title: 'Dark Mode Native',
    desc: 'Full light and dark theming via CSS custom properties. Pastel palette, zero flash on load.',
  },
  {
    icon: '\uD83D\uDCF1',
    title: 'Web + Android',
    desc: 'One codebase philosophy. ribbit.network for web, Ribbit Android for mobile. Same NIP coverage.',
  },
  {
    icon: '\uD83E\uDDF1',
    title: 'Modular Stack',
    desc: 'Kaji for protocol, Blazecn for UI, nos2x-frog for signing. Use one piece or the whole stack.',
  },
];

const STATS = [
  { value: '11', label: 'Kaji modules' },
  { value: '24+', label: 'UI components' },
  { value: '14', label: 'NIPs supported' },
  { value: '0', label: 'Hardcoded relays' },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

// Inject the glow keyframes once
if (typeof document !== 'undefined' && !document.getElementById('glow-docs-style')) {
  const style = document.createElement('style');
  style.id = 'glow-docs-style';
  style.textContent = `
    @keyframes docs-glow {
      0%, 100% { box-shadow: 0 0 8px var(--primary), 0 0 20px color-mix(in oklch, var(--primary) 40%, transparent); opacity: 1; }
      50% { box-shadow: 0 0 16px var(--primary), 0 0 36px color-mix(in oklch, var(--primary) 60%, transparent); opacity: 0.85; }
    }
    .glow-docs-active {
      animation: docs-glow 1.5s ease-in-out infinite;
      ring: 2px var(--primary);
    }
  `;
  document.head.appendChild(style);
}

class GlowDocsButton extends Component<{ className?: string; label?: string }, { glow: boolean }> {
  declare state: { glow: boolean };
  private unsub: (() => void) | null = null;
  constructor(props: any) { super(props); this.state = { glow: _glowDocs }; }
  componentDidMount() { this.unsub = subscribeGlow(() => this.setState({ glow: _glowDocs })); }
  componentWillUnmount() { this.unsub?.(); }
  render() {
    const base = 'inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-all duration-500';
    const glowCls = this.state.glow
      ? base + ' border-primary text-foreground glow-docs-active ring-2 ring-primary ring-offset-2 ring-offset-background'
      : base + ' border-input text-foreground hover:bg-accent';
    return createElement(Link, { to: '/docs', className: glowCls }, this.props.label || 'Read the Docs');
  }
}

function HeroSection() {
  return createElement('section', { className: 'relative overflow-hidden' },
    // Gradient background orbs
    createElement('div', { className: 'absolute inset-0 -z-10 overflow-hidden' },
      createElement('div', {
        className: 'absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/8 blur-3xl',
      }),
      createElement('div', {
        className: 'absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl',
      }),
    ),

    createElement('div', { className: 'max-w-3xl mx-auto text-center py-20 sm:py-28 px-4' },
      // Badge
      createElement('div', { className: 'flex justify-center mb-6' },
        createElement(Badge, { variant: 'secondary', className: 'px-3 py-1 text-xs' },
          '\uD83D\uDC38 Open source \u00B7 Nostr native \u00B7 Zero tracking',
        ),
      ),

      // Headline
      createElement('h1', {
        className: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6',
      },
        createElement('span', { className: 'block' }, 'Social networking'),
        createElement('span', { className: 'block text-primary' }, 'without permission.'),
      ),

      // Subheadline
      createElement('p', {
        className: 'text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed',
      },
        'ribbit.network is a complete Nostr ecosystem \u2014 client, protocol library, UI toolkit, and browser extension. All open source. All yours.',
      ),

      // CTAs
      createElement('div', { className: 'flex flex-wrap justify-center gap-3' },
        createElement('a', {
          href: '/feed',
          onClick: handleFeedClick,
          className: 'inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer',
        }, 'Open Feed \u2192'),
        createElement(GlowDocsButton, { label: 'Read the Docs' }),
        createElement('a', {
          href: 'https://github.com/TekkadanPlays',
          target: '_blank',
          rel: 'noopener',
          className: 'inline-flex items-center gap-2 rounded-lg border border-input px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
        }, 'GitHub'),
      ),
    ),
  );
}

function StatsBar() {
  return createElement('section', {
    className: 'border-y border-border bg-muted/30',
  },
    createElement('div', {
      className: 'max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center',
    },
      ...STATS.map((stat) =>
        createElement('div', { key: stat.label },
          createElement('p', { className: 'text-3xl font-extrabold tracking-tight text-foreground' }, stat.value),
          createElement('p', { className: 'text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium' }, stat.label),
        ),
      ),
    ),
  );
}

function FeaturesGrid() {
  return createElement('section', { className: 'max-w-4xl mx-auto px-4 py-16' },
    createElement('div', { className: 'text-center mb-12' },
      createElement('h2', { className: 'text-2xl sm:text-3xl font-bold tracking-tight mb-3' }, 'Built different.'),
      createElement('p', { className: 'text-muted-foreground max-w-lg mx-auto' },
        'Every piece of the stack is designed for sovereignty, speed, and developer experience.',
      ),
    ),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
      ...FEATURES.map((f) =>
        createElement('div', {
          key: f.title,
          className: 'rounded-xl border border-border p-5 hover:border-primary/30 hover:bg-accent/30 transition-all duration-200',
        },
          createElement('div', { className: 'text-2xl mb-3' }, f.icon),
          createElement('h3', { className: 'text-sm font-bold mb-1.5' }, f.title),
          createElement('p', { className: 'text-xs text-muted-foreground leading-relaxed' }, f.desc),
        ),
      ),
    ),
  );
}

function ProjectsSection() {
  return createElement('section', { className: 'max-w-4xl mx-auto px-4 py-16' },
    createElement('div', { className: 'text-center mb-12' },
      createElement('h2', { className: 'text-2xl sm:text-3xl font-bold tracking-tight mb-3' }, 'The ecosystem.'),
      createElement('p', { className: 'text-muted-foreground max-w-lg mx-auto' },
        'Six projects, one mission: make Nostr accessible to everyone.',
      ),
    ),
    createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
      ...PROJECTS.map((p) =>
        createElement(Link, {
          key: p.name,
          to: p.href,
          className: 'group rounded-xl border border-border p-5 hover:border-primary/30 hover:bg-accent/30 transition-all duration-200 block',
        },
          createElement('div', { className: 'flex items-center gap-3 mb-3' },
            createElement('span', { className: 'text-2xl' }, p.icon),
            createElement('h3', { className: 'text-sm font-bold group-hover:text-primary transition-colors' }, p.name),
          ),
          createElement('p', { className: 'text-xs text-muted-foreground leading-relaxed mb-3' }, p.desc),
          createElement('div', { className: 'flex flex-wrap gap-1.5' },
            ...p.tags.map((tag) =>
              createElement(Badge, { key: tag, variant: 'outline', className: 'text-[10px] px-1.5 py-0' }, tag),
            ),
          ),
        ),
      ),
    ),
  );
}

function NipCoverage() {
  return createElement('section', { className: 'border-y border-border bg-muted/30' },
    createElement('div', { className: 'max-w-4xl mx-auto px-4 py-16' },
      createElement('div', { className: 'text-center mb-10' },
        createElement('h2', { className: 'text-2xl sm:text-3xl font-bold tracking-tight mb-3' }, 'Protocol coverage.'),
        createElement('p', { className: 'text-muted-foreground max-w-lg mx-auto' },
          'We implement the NIPs that matter for a real social experience. More coming every sprint.',
        ),
      ),
      createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3' },
        ...([
          { nip: 'NIP-01', title: 'Events & Protocol', status: 'full' },
          { nip: 'NIP-02', title: 'Follow Lists', status: 'full' },
          { nip: 'NIP-05', title: 'DNS Identifiers', status: 'full' },
          { nip: 'NIP-07', title: 'Browser Extension', status: 'full' },
          { nip: 'NIP-10', title: 'Threads', status: 'full' },
          { nip: 'NIP-18', title: 'Reposts', status: 'full' },
          { nip: 'NIP-19', title: 'Bech32 Encoding', status: 'full' },
          { nip: 'NIP-25', title: 'Reactions', status: 'full' },
          { nip: 'NIP-29', title: 'Groups', status: 'full' },
          { nip: 'NIP-42', title: 'Relay Auth', status: 'full' },
          { nip: 'NIP-55', title: 'Android Signer', status: 'full' },
          { nip: 'NIP-65', title: 'Relay Lists', status: 'full' },
        ]).map((n) =>
          createElement('div', {
            key: n.nip,
            className: 'rounded-lg border border-border p-3 bg-background',
          },
            createElement('div', { className: 'flex items-center justify-between mb-1' },
              createElement('span', { className: 'text-xs font-mono font-bold' }, n.nip),
              createElement('span', { className: 'text-xs' }, '\u2705'),
            ),
            createElement('p', { className: 'text-[11px] text-muted-foreground' }, n.title),
          ),
        ),
      ),
      createElement('div', { className: 'text-center mt-6' },
        createElement(Link, {
          to: '/docs/nips',
          className: 'text-xs text-primary hover:underline',
        }, 'View full NIP coverage matrix \u2192'),
      ),
    ),
  );
}

function CodePreview() {
  const code = `import { createEvent, Kind, RelayPool, signWithExtension } from 'kaji'

const pool = new RelayPool()
pool.addRelay('wss://your-relay.example')
await pool.connectAll()

const event = createEvent(Kind.Text, 'Hello from Kaji!')
const signed = await signWithExtension(event)
await pool.publish(signed)`;

  return createElement('section', { className: 'max-w-4xl mx-auto px-4 py-16' },
    createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' },
      createElement('div', null,
        createElement('h2', { className: 'text-2xl sm:text-3xl font-bold tracking-tight mb-3' }, 'Ship in minutes.'),
        createElement('p', { className: 'text-muted-foreground leading-relaxed mb-4' },
          'Kaji gives you everything you need to build a Nostr app. Create events, sign with browser extensions, publish to relay pools \u2014 all in a few lines of TypeScript.',
        ),
        createElement('div', { className: 'space-y-2' },
          ...([
            'Zero framework coupling \u2014 works with any UI',
            'Audited crypto dependencies only',
            'Full TypeScript types, tree-shakeable ESM',
          ]).map((item) =>
            createElement('div', { key: item, className: 'flex items-start gap-2' },
              createElement('span', { className: 'text-primary text-sm mt-0.5' }, '\u2713'),
              createElement('span', { className: 'text-sm text-muted-foreground' }, item),
            ),
          ),
        ),
        createElement('div', { className: 'mt-6' },
          createElement(Link, {
            to: '/docs/kaji',
            className: 'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors',
          }, 'Kaji Docs \u2192'),
        ),
      ),
      createElement('div', {
        className: 'rounded-xl border border-border bg-muted/50 p-4 overflow-x-auto',
      },
        createElement('pre', { className: 'text-xs font-mono leading-relaxed text-foreground whitespace-pre' }, code),
      ),
    ),
  );
}

function CTASection() {
  return createElement('section', { className: 'max-w-3xl mx-auto px-4 py-20 text-center' },
    createElement('div', { className: 'text-4xl mb-4' }, '\uD83D\uDC38'),
    createElement('h2', { className: 'text-2xl sm:text-3xl font-bold tracking-tight mb-3' },
      'Ready to croak?',
    ),
    createElement('p', { className: 'text-muted-foreground max-w-md mx-auto mb-8' },
      'Jump into the feed, explore the docs, or start building with Kaji. No sign-up required \u2014 just a Nostr key.',
    ),
    createElement('div', { className: 'flex flex-wrap justify-center gap-3' },
      createElement('a', {
        href: '/feed',
        onClick: handleFeedClick,
        className: 'inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 cursor-pointer',
      }, 'Open Feed'),
      createElement(GlowDocsButton, { label: 'Documentation' }),
    ),
  );
}

function Footer() {
  return createElement('footer', { className: 'border-t border-border' },
    createElement('div', { className: 'max-w-4xl mx-auto px-4 py-8' },
      createElement('div', { className: 'flex flex-col sm:flex-row items-center justify-between gap-4' },
        createElement('div', { className: 'flex items-center gap-2' },
          createElement('span', { className: 'text-lg' }, '\uD83D\uDC38'),
          createElement('span', { className: 'text-sm font-bold' }, 'ribbit.network'),
        ),
        createElement('div', { className: 'flex flex-wrap gap-4 text-xs text-muted-foreground' },
          createElement(Link, { to: '/docs', className: 'hover:text-foreground transition-colors' }, 'Docs'),
          createElement(Link, { to: '/feed', className: 'hover:text-foreground transition-colors' }, 'Feed'),
          createElement('a', {
            href: 'https://github.com/TekkadanPlays',
            target: '_blank',
            rel: 'noopener',
            className: 'hover:text-foreground transition-colors',
          }, 'GitHub'),
          createElement(Link, { to: '/docs/nips', className: 'hover:text-foreground transition-colors' }, 'NIPs'),
        ),
        createElement('p', { className: 'text-xs text-muted-foreground/50' },
          'MIT License \u00B7 Built with Kaji + Blazecn',
        ),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Landing page (exported)
// ---------------------------------------------------------------------------

export function Landing() {
  return createElement('div', { className: 'min-h-screen' },
    HeroSection(),
    StatsBar(),
    FeaturesGrid(),
    ProjectsSection(),
    NipCoverage(),
    CodePreview(),
    CTASection(),
    Footer(),
  );
}
