import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { getBaseTheme, setBaseTheme, subscribeTheme, type BaseTheme } from '../store/theme';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from './DropdownMenu';

// ---------------------------------------------------------------------------
// ThemeSelector — header dropdown for choosing a base color theme
// Uses Blazecn DropdownMenu primitives.
// ---------------------------------------------------------------------------

const THEMES: { id: BaseTheme; label: string; swatch: string }[] = [
  { id: 'neutral', label: 'Neutral', swatch: 'bg-[oklch(0.205_0_0)] dark:bg-[oklch(0.922_0_0)]' },
  { id: 'ribbit', label: 'Ribbit', swatch: 'bg-[oklch(0.45_0.10_150)] dark:bg-[oklch(0.65_0.10_155)]' },
  { id: 'nostr', label: 'Nostr', swatch: 'bg-[oklch(0.50_0.25_300)] dark:bg-[oklch(0.65_0.22_300)]' },
  { id: 'bitcoin', label: 'Bitcoin', swatch: 'bg-[oklch(0.65_0.18_60)] dark:bg-[oklch(0.75_0.16_63)]' },
];

interface ThemeSelectorProps {
  className?: string;
}

interface ThemeSelectorState {
  active: BaseTheme;
  open: boolean;
}

export class ThemeSelector extends Component<ThemeSelectorProps, ThemeSelectorState> {
  declare state: ThemeSelectorState;
  private unsub: (() => void) | null = null;

  constructor(props: ThemeSelectorProps) {
    super(props);
    this.state = { active: getBaseTheme(), open: false };
  }

  componentDidMount() {
    this.unsub = subscribeTheme(() => this.setState({ active: getBaseTheme() }));
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  private toggleOpen = (e: Event) => {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  };

  private close = () => {
    this.setState({ open: false });
  };

  private select = (id: BaseTheme) => {
    setBaseTheme(id);
    this.close();
  };

  render() {
    const { className } = this.props;
    const { active, open } = this.state;
    const activeSwatch = THEMES.find((t) => t.id === active)?.swatch || THEMES[0].swatch;

    return createElement(DropdownMenu, null,
      createElement(DropdownMenuTrigger, {
        onClick: this.toggleOpen,
        className: cn(
          'inline-flex items-center justify-center size-9 rounded-md border border-input bg-background text-foreground shadow-xs cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          className,
        ),
      },
        // Palette icon
        createElement('svg', {
          className: 'size-4',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
          createElement('circle', { cx: '13.5', cy: '6.5', r: '.5', fill: 'currentColor' }),
          createElement('circle', { cx: '17.5', cy: '10.5', r: '.5', fill: 'currentColor' }),
          createElement('circle', { cx: '8.5', cy: '7.5', r: '.5', fill: 'currentColor' }),
          createElement('circle', { cx: '6.5', cy: '12.5', r: '.5', fill: 'currentColor' }),
          createElement('path', { d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z' }),
        ),
      ),

      createElement(DropdownMenuContent, {
        open,
        onClose: this.close,
        align: 'end',
      },
        createElement(DropdownMenuLabel, null, 'Theme'),
        ...THEMES.map((t) =>
          createElement(DropdownMenuItem, {
            key: t.id,
            onClick: () => this.select(t.id),
          },
            createElement('span', {
              className: cn('size-4 rounded-full border border-border shrink-0', t.swatch),
            }),
            t.label,
            active === t.id
              ? createElement('svg', {
                  className: 'size-3.5 ml-auto text-primary',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '3',
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                }, createElement('path', { d: 'M20 6L9 17l-5-5' }))
              : null,
          ),
        ),
      ),
    );
  }
}
