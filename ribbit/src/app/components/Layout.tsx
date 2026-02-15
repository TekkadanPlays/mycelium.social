import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState, subscribeAuth, login, logout } from '../store/auth';
import { getProfile, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ThemeSelector } from '../ui/ThemeSelector';

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

interface HeaderState {
  auth: ReturnType<typeof getAuthState>;
  profileName: string;
  profilePicture: string;
  mobileOpen: boolean;
  dropdownOpen: boolean;
}

export class Header extends Component<{}, HeaderState> {
  private unsubAuth: (() => void) | null = null;
  private unsubProfiles: (() => void) | null = null;
  private outsideClickHandler: ((e: Event) => void) | null = null;
  declare state: HeaderState;

  constructor(props: {}) {
    super(props);
    this.state = {
      auth: getAuthState(),
      profileName: '',
      profilePicture: '',
      mobileOpen: false,
      dropdownOpen: false,
    };
  }

  componentDidMount() {
    this.unsubAuth = subscribeAuth(() => {
      const auth = getAuthState();
      this.setState({ ...this.state, auth });
      this.updateProfile(auth.pubkey);
    });
    this.unsubProfiles = subscribeProfiles(() => {
      this.updateProfile(this.state.auth.pubkey);
    });
    this.updateProfile(this.state.auth.pubkey);

    this.outsideClickHandler = () => {
      if (this.state.dropdownOpen) this.setState({ ...this.state, dropdownOpen: false });
    };
    document.addEventListener('click', this.outsideClickHandler);
  }

  componentWillUnmount() {
    this.unsubAuth?.();
    this.unsubProfiles?.();
    if (this.outsideClickHandler) document.removeEventListener('click', this.outsideClickHandler);
  }

  updateProfile(pubkey: string | null) {
    if (!pubkey) {
      this.setState({ profileName: '', profilePicture: '' });
      return;
    }
    const profile = getProfile(pubkey);
    const name = profile?.displayName || profile?.name || shortenNpub(npubEncode(pubkey));
    this.setState({ profileName: name, profilePicture: profile?.picture || '' });
  }

  render() {
    const { auth, profileName, profilePicture, mobileOpen, dropdownOpen } = this.state;
    const initials = (profileName || '??').substring(0, 2).toUpperCase();

    const navLinks = [
      { to: '/feed', label: 'Feed' },
      { to: '/docs', label: 'Docs' },
    ];

    return createElement('nav', {
      className: 'sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md',
    },
      createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 lg:px-8' },
        createElement('div', { className: 'flex h-16 items-center justify-between' },
          // Left: Logo
          createElement(Link, { to: '/', className: 'flex items-center gap-2.5 group shrink-0' },
            createElement('span', { className: 'text-2xl' }, '\u{1F438}'),
            createElement('span', { className: 'font-extrabold text-lg tracking-tight' }, 'ribbit'),
          ),

          // Right: Nav links + actions
          createElement('div', { className: 'flex items-center gap-2' },
            // Nav links (desktop)
            createElement('div', { className: 'hidden md:flex items-center gap-1 mr-2' },
              ...navLinks.map((link) =>
                createElement(Link, {
                  key: link.label,
                  to: link.to,
                  className: 'px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50',
                }, link.label),
              ),
            ),

            // Theme controls
            createElement(ThemeSelector, { className: 'size-8' }),
            createElement(ThemeToggle, { className: 'size-8' }),

            auth.pubkey
              ? createElement('div', { className: 'relative hidden md:block' },
                  // User dropdown trigger
                  createElement('button', {
                    onClick: (e: Event) => { e.stopPropagation(); this.setState({ ...this.state, dropdownOpen: !dropdownOpen }); },
                    className: 'flex items-center gap-2 rounded-full border border-border px-1 py-1 pr-3 hover:bg-accent/50 transition-colors',
                  },
                    createElement(Avatar, { className: 'size-7' },
                      profilePicture
                        ? createElement(AvatarImage, { src: profilePicture, alt: profileName })
                        : null,
                      createElement(AvatarFallback, { className: 'text-[10px]' }, initials),
                    ),
                    createElement('span', { className: 'text-sm font-medium max-w-[120px] truncate' }, profileName),
                    createElement('span', { className: 'text-xs opacity-40' }, '\u25BE'),
                  ),

                  // Dropdown menu
                  dropdownOpen
                    ? createElement('div', {
                        className: 'absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg py-1.5 z-50',
                      },
                        createElement(Link, {
                          to: `/u/${auth.pubkey}`,
                          className: 'flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Profile'),
                        createElement(Link, {
                          to: '/notifications',
                          className: 'flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Notifications'),
                        createElement(Link, {
                          to: '/settings',
                          className: 'flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Settings'),
                        createElement(Link, {
                          to: '/settings/relays',
                          className: 'flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Relay Manager'),
                        createElement('div', { className: 'border-t border-border my-1.5' }),
                        createElement('button', {
                          onClick: logout,
                          className: 'flex items-center gap-2.5 px-4 py-2.5 w-full text-sm text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-colors',
                        }, 'Sign Out'),
                      )
                    : null,
                )
              : createElement(Button, {
                  onClick: login,
                  disabled: auth.isLoading,
                  size: 'sm',
                  className: 'hidden md:inline-flex',
                }, auth.isLoading ? 'Connecting...' : 'Sign In'),

            // Mobile menu button
            createElement('button', {
              onClick: () => this.setState({ ...this.state, mobileOpen: !mobileOpen }),
              className: 'md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
            }, mobileOpen ? '\u2715' : '\u2630'),
          ),
        ),
      ),

      // Mobile menu
      mobileOpen
        ? createElement('div', { className: 'md:hidden border-t border-border bg-background' },
            createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 py-3 space-y-0.5' },
              ...navLinks.map((link) =>
                createElement(Link, {
                  key: link.label,
                  to: link.to,
                  className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                  onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                }, link.label),
              ),
              auth.pubkey
                ? createElement('div', { className: 'space-y-0.5 border-t border-border mt-2 pt-2' },
                    createElement(Link, {
                      to: `/u/${auth.pubkey}`,
                      className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                      onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                    }, 'Profile'),
                    createElement(Link, {
                      to: '/notifications',
                      className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                      onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                    }, 'Notifications'),
                    createElement(Link, {
                      to: '/settings',
                      className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                      onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                    }, 'Settings'),
                    createElement(Link, {
                      to: '/settings/relays',
                      className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                      onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                    }, 'Relay Manager'),
                    createElement('button', {
                      onClick: () => { logout(); this.setState({ ...this.state, mobileOpen: false }); },
                      className: 'flex items-center px-3 py-2.5 w-full text-sm text-destructive/70 hover:text-destructive rounded-md transition-colors',
                    }, 'Sign Out'),
                  )
                : createElement('div', { className: 'border-t border-border mt-2 pt-3 px-3' },
                    createElement(Button, {
                      onClick: () => { login(); this.setState({ ...this.state, mobileOpen: false }); },
                      className: 'w-full',
                      size: 'sm',
                    }, 'Sign In with Nostr'),
                  ),
            ),
          )
        : null,
    );
  }
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export class Sidebar extends Component {
  render() {
    const auth = getAuthState();
    const sections = [
      {
        heading: 'Feed',
        links: [
          { to: '/feed', label: 'Global', icon: '\u{1F30D}' },
          { to: '/feed?mode=following', label: 'Following', icon: '\u{1F465}' },
        ],
      },
      ...(auth.pubkey ? [{
        heading: 'You',
        links: [
          { to: `/u/${auth.pubkey}`, label: 'Profile', icon: '\u{1F464}' },
          { to: '/notifications', label: 'Notifications', icon: '\u{1F514}' },
          { to: '/settings', label: 'Settings', icon: '\u2699\uFE0F' },
        ],
      }] : []),
      {
        heading: 'Network',
        links: [
          { to: '/settings/relays', label: 'Relay Manager', icon: '\u{1F4E1}' },
          { to: '/discover', label: 'Discover Relays', icon: '\u{1F50D}' },
        ],
      },
      {
        heading: 'Developer',
        links: [
          { to: '/raw', label: 'Raw Events', icon: '\u{1F50C}' },
          { to: '/docs', label: 'Documentation', icon: '\uD83D\uDCDA' },
        ],
      },
    ];

    return createElement('aside', { className: 'hidden lg:block w-52 shrink-0' },
      createElement('div', { className: 'sticky top-[80px] space-y-5' },
        ...sections.map((section) =>
          createElement('div', { key: section.heading },
            createElement('p', {
              className: 'px-3 mb-1.5 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/50',
            }, section.heading),
            ...section.links.map((link) =>
              createElement(Link, {
                key: link.label,
                to: link.to,
                className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
              },
                createElement('span', { className: 'text-sm' }, link.icon),
                link.label,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// MainLayout
// ---------------------------------------------------------------------------

export class MainLayout extends Component<{ children: any }> {
  render() {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const isLanding = path === '/';
    const hideSidebar = isLanding || path.startsWith('/docs');

    // Landing page gets full-width, no header chrome padding
    if (isLanding) {
      return createElement('div', { className: 'min-h-screen bg-background' },
        createElement(Header, null),
        createElement('main', null,
          this.props.children,
        ),
      );
    }

    return createElement('div', { className: 'min-h-screen bg-background' },
      createElement(Header, null),
      createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-6' },
        createElement('div', { className: 'flex gap-8' },
          !hideSidebar ? createElement(Sidebar, null) : null,
          createElement('main', { className: 'flex-1 min-w-0' },
            this.props.children,
          ),
        ),
      ),
    );
  }
}
