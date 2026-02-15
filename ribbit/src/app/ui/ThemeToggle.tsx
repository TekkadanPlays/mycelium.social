import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// ThemeToggle
//
// Toggles between light and dark themes by adding/removing the .dark class
// on the <html> element. Persists preference in localStorage.
// ---------------------------------------------------------------------------

function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

interface ThemeToggleProps {
  className?: string;
}

interface ThemeToggleState {
  theme: 'light' | 'dark';
}

export class ThemeToggle extends Component<ThemeToggleProps, ThemeToggleState> {
  declare state: ThemeToggleState;

  constructor(props: ThemeToggleProps) {
    super(props);
    this.state = { theme: getStoredTheme() };
  }

  componentDidMount() {
    applyTheme(this.state.theme);
  }

  private toggle = () => {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: next });
    applyTheme(next);
  };

  render() {
    const { className } = this.props;
    const isDark = this.state.theme === 'dark';

    return createElement('button', {
      type: 'button',
      onClick: this.toggle,
      'aria-label': isDark ? 'Switch to light mode' : 'Switch to dark mode',
      className: cn(
        'inline-flex items-center justify-center size-9 rounded-md border border-input bg-background text-foreground shadow-xs cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        className,
      ),
    },
      // Sun icon (shown in dark mode — click to go light)
      isDark
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
