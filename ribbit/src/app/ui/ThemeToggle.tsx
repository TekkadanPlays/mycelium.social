import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';
import { isDarkMode, toggleDarkMode, subscribeTheme } from '../store/theme';

// ---------------------------------------------------------------------------
// ThemeToggle
//
// Toggles between light and dark themes. Uses the centralized theme store
// which manages both dark mode and base color themes.
// ---------------------------------------------------------------------------

interface ThemeToggleProps {
  className?: string;
}

interface ThemeToggleState {
  dark: boolean;
}

export class ThemeToggle extends Component<ThemeToggleProps, ThemeToggleState> {
  declare state: ThemeToggleState;
  private unsub: (() => void) | null = null;

  constructor(props: ThemeToggleProps) {
    super(props);
    this.state = { dark: isDarkMode() };
  }

  componentDidMount() {
    this.unsub = subscribeTheme(() => this.setState({ dark: isDarkMode() }));
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  private toggle = () => {
    toggleDarkMode();
  };

  render() {
    const { className } = this.props;
    const dark = this.state.dark;

    return createElement('button', {
      type: 'button',
      onClick: this.toggle,
      'aria-label': dark ? 'Switch to light mode' : 'Switch to dark mode',
      className: cn(
        'inline-flex items-center justify-center size-9 rounded-md border border-input bg-background text-foreground shadow-xs cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        className,
      ),
    },
      // Sun icon (shown in dark mode — click to go light)
      dark
        ? createElement('svg', {
            className: 'size-4',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
            createElement('circle', { cx: '12', cy: '12', r: '4' }),
            createElement('path', { d: 'M12 2v2' }),
            createElement('path', { d: 'M12 20v2' }),
            createElement('path', { d: 'm4.93 4.93 1.41 1.41' }),
            createElement('path', { d: 'm17.66 17.66 1.41 1.41' }),
            createElement('path', { d: 'M2 12h2' }),
            createElement('path', { d: 'M20 12h2' }),
            createElement('path', { d: 'm6.34 17.66-1.41 1.41' }),
            createElement('path', { d: 'm19.07 4.93-1.41 1.41' }),
          )
        // Moon icon (shown in light mode — click to go dark)
        : createElement('svg', {
            className: 'size-4',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
            createElement('path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }),
          ),
    );
  }
}
