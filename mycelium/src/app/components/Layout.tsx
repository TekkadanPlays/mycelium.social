import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState, subscribeAuth, login, logout } from '../store/auth';
import { getProfile, subscribeProfiles } from '../store/profiles';
import { getBootstrapState, subscribeBootstrap } from '../store/bootstrap';
import { getNotificationsState, subscribeNotifications } from '../store/notifications';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ThemeSelector } from '../ui/ThemeSelector';

// ---------------------------------------------------------------------------
// Docs project data for the NavigationMenu dropdown
// ---------------------------------------------------------------------------

const DOCS_PROJECTS = [
  { icon: '\u26A1', title: 'Blazecn', desc: 'UI component library', path: '/docs/blazecn' },
  { icon: '\uD83C\uDF44', title: 'Mycelium', desc: 'Nostr social client', path: '/docs/mycelium' },
  { icon: '\uD83D\uDD25', title: 'Kaji', desc: 'Nostr protocol library', path: '/docs/kaji' },
  { icon: '\uD83D\uDCF1', title: 'Mycelium for Android', desc: 'Native Android app', path: '/docs/mycelium-android' },
  { icon: '\uD83D\uDD10', title: 'nos2x-frog', desc: 'Browser signer extension', path: '/docs/nos2x-frog' },
  { icon: '\uD83E\uDDA0', title: 'Cybin', desc: 'Kotlin Nostr protocol library', path: '/docs/cybin' },
];

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

interface HeaderState {
  auth: ReturnType<typeof getAuthState>;
  profileName: string;
  profilePicture: string;
  mobileOpen: boolean;
  dropdownOpen: boolean;
  docsOpen: boolean;
  unseenNotifs: number;
}

export class Header extends Component<{}, HeaderState> {
  private unsubAuth: (() => void) | null = null;
  private unsubProfiles: (() => void) | null = null;
  private unsubBootstrap: (() => void) | null = null;
  private unsubNotifs: (() => void) | null = null;
  private outsideClickHandler: ((e: Event) => void) | null = null;
  private headerRef: HTMLElement | null = null;
  declare state: HeaderState;

  constructor(props: {}) {
    super(props);
    this.state = {
      auth: getAuthState(),
      profileName: '',
      profilePicture: '',
      mobileOpen: false,
      dropdownOpen: false,
      docsOpen: false,
      unseenNotifs: getNotificationsState().unseenCount,
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
    this.unsubBootstrap = subscribeBootstrap(() => {
      this.updateProfile(this.state.auth.pubkey);
    });
    this.unsubNotifs = subscribeNotifications(() => {
      this.setState({ ...this.state, unseenNotifs: getNotificationsState().unseenCount });
    });
    this.updateProfile(this.state.auth.pubkey);

    this.outsideClickHandler = (e: Event) => {
      if (this.headerRef && !this.headerRef.contains(e.target as Node)) {
        if (this.state.dropdownOpen || this.state.docsOpen) {
          this.setState({ ...this.state, dropdownOpen: false, docsOpen: false });
        }
      }
    };
    document.addEventListener('mousedown', this.outsideClickHandler);
  }

  componentWillUnmount() {
    this.unsubAuth?.();
    this.unsubProfiles?.();
    this.unsubBootstrap?.();
    this.unsubNotifs?.();
    if (this.outsideClickHandler) document.removeEventListener('mousedown', this.outsideClickHandler);
  }

  updateProfile(pubkey: string | null) {
    if (!pubkey) {
      this.setState({ profileName: '', profilePicture: '' });
      return;
    }
    // Try bootstrap profile first (available immediately from indexers)
    const bs = getBootstrapState();
    if (bs.profile) {
      const name = bs.profile.displayName || bs.profile.name || shortenNpub(npubEncode(pubkey));
      const picture = bs.profile.picture || '';
      // Only update if we have better data than current state
      if (name !== this.state.profileName || picture !== this.state.profilePicture) {
        this.setState({ profileName: name, profilePicture: picture });
      }
    }
    // Also check profiles store (may have newer data after pool connects)
    const profile = getProfile(pubkey);
    if (profile) {
      const name = profile.displayName || profile.name || shortenNpub(npubEncode(pubkey));
      const picture = profile.picture || '';
      if (name !== this.state.profileName || picture !== this.state.profilePicture) {
        this.setState({ profileName: name, profilePicture: picture });
      }
    }
  }

  render() {
    const { auth, profileName, profilePicture, mobileOpen, dropdownOpen, docsOpen } = this.state;
    const initials = (profileName || '??').substring(0, 2).toUpperCase();

    // Chevron SVG for the Docs trigger
    const chevron = createElement('svg', {
      className: 'relative top-px ml-1 size-3 transition-transform duration-200' + (docsOpen ? ' rotate-180' : ''),
      viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, createElement('path', { d: 'M6 9l6 6 6-6' }));

    return createElement('nav', {
      ref: (el: HTMLElement | null) => { this.headerRef = el; },
      className: 'sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md',
    },
      createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 lg:px-8' },
        createElement('div', { className: 'flex h-14 items-center justify-between' },

          // ── Left: Logo + Navigation ──
          createElement('div', { className: 'flex items-center gap-1' },
            // Logo
            createElement(Link, { to: '/', className: 'flex items-center gap-2 shrink-0 mr-4' },
              createElement('span', { className: 'text-xl' }, '\u{1F344}'),
              createElement('span', { className: 'font-extrabold text-base tracking-tight' }, 'mycelium'),
            ),

            // Desktop nav
            createElement('div', { className: 'hidden md:flex items-center gap-0.5' },

              // ── Docs dropdown trigger ──
              createElement('div', { className: 'relative' },
                createElement('button', {
                  type: 'button',
                  onClick: (e: Event) => { e.stopPropagation(); this.setState({ ...this.state, docsOpen: !docsOpen, dropdownOpen: false }); },
                  className: 'inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                    + ' hover:bg-accent hover:text-accent-foreground'
                    + (docsOpen ? ' bg-accent/50' : ''),
                }, 'Docs', chevron),

                // ── Docs dropdown panel ──
                docsOpen
                  ? createElement('div', {
                    className: 'absolute left-0 top-full mt-1.5 w-[480px] rounded-lg border bg-popover p-4 shadow-lg z-50',
                  },
                    // Header row
                    createElement('div', { className: 'flex items-center justify-between mb-3' },
                      createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' }, 'Projects'),
                      createElement(Link, {
                        to: '/docs',
                        onClick: () => this.setState({ ...this.state, docsOpen: false }),
                        className: 'text-xs text-primary hover:underline',
                      }, 'View all \u2192'),
                    ),
                    // Project grid
                    createElement('div', { className: 'grid grid-cols-2 gap-1' },
                      ...DOCS_PROJECTS.map((p) =>
                        createElement(Link, {
                          key: p.title,
                          to: p.path,
                          onClick: () => this.setState({ ...this.state, docsOpen: false }),
                          className: 'flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-accent',
                        },
                          createElement('span', { className: 'text-lg mt-0.5 shrink-0' }, p.icon),
                          createElement('div', null,
                            createElement('div', { className: 'text-sm font-semibold leading-tight' }, p.title),
                            createElement('p', { className: 'text-xs text-muted-foreground mt-0.5 leading-snug' }, p.desc),
                          ),
                        ),
                      ),
                    ),
                  )
                  : null,
              ),
              // Live link
              createElement('a', {
                href: 'https://live.mycelium.social',
                target: '_blank',
                rel: 'noopener',
                className: 'inline-flex h-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                  + ' hover:bg-accent hover:text-accent-foreground',
              }, 'Live'),
            ),
          ),

          // ── Right: GitHub icon + Theme controls + Auth ──
          createElement('div', { className: 'flex items-center gap-1.5' },
            createElement('a', {
              href: 'https://github.com/TekkadanPlays',
              target: '_blank',
              rel: 'noopener',
              title: 'GitHub',
              className: 'inline-flex items-center justify-center rounded-md size-8 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
            },
              createElement('svg', {
                className: 'size-4',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
              }, createElement('path', { d: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' })),
            ),
            createElement(ThemeSelector, { className: 'size-8' }),
            createElement(ThemeToggle, { className: 'size-8' }),

            auth.pubkey
              ? createElement('div', { className: 'relative hidden md:block' },
                createElement('button', {
                  onClick: (e: Event) => { e.stopPropagation(); this.setState({ ...this.state, dropdownOpen: !dropdownOpen, docsOpen: false }); },
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
                dropdownOpen
                  ? createElement('div', {
                    className: 'absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-lg shadow-lg py-1 z-50',
                  },
                    createElement(Link, { to: `/u/${auth.pubkey}`, onClick: () => this.setState({ ...this.state, dropdownOpen: false }), className: 'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors' }, 'Profile'),
                    createElement(Link, { to: '/notifications', onClick: () => this.setState({ ...this.state, dropdownOpen: false }), className: 'flex items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors' },
                      'Notifications',
                      this.state.unseenNotifs > 0
                        ? createElement('span', { className: 'text-[10px] font-semibold rounded-full px-1.5 py-0.5 leading-none bg-primary text-primary-foreground' }, String(this.state.unseenNotifs))
                        : null,
                    ),
                    createElement(Link, { to: '/settings', onClick: () => this.setState({ ...this.state, dropdownOpen: false }), className: 'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors' }, 'Settings'),
                    createElement(Link, { to: '/settings/relays', onClick: () => this.setState({ ...this.state, dropdownOpen: false }), className: 'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors' }, 'Relay Manager'),
                    createElement(Link, { to: '/wallet', onClick: () => this.setState({ ...this.state, dropdownOpen: false }), className: 'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors' }, 'Wallet'),
                    createElement(Link, { to: '/admin', onClick: () => this.setState({ ...this.state, dropdownOpen: false }), className: 'flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors' }, 'Admin Panel'),
                    createElement('div', { className: 'border-t border-border my-1' }),
                    createElement('button', { onClick: () => { logout(); this.setState({ ...this.state, dropdownOpen: false }); }, className: 'flex items-center gap-2 px-3 py-2 w-full text-sm text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-colors' }, 'Sign Out'),
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

      // ── Mobile menu ──
      mobileOpen
        ? createElement('div', { className: 'md:hidden border-t border-border bg-background' },
          createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 py-3 space-y-0.5' },
            // Navigation links
            createElement('p', { className: 'px-3 pt-1 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/60' }, 'Navigation'),
            createElement(Link, {
              to: '/docs',
              className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
              onClick: () => this.setState({ ...this.state, mobileOpen: false }),
            },
              createElement('span', { className: 'text-sm' }, '\u{1F4DA}'),
              'Docs',
            ),
            createElement('a', {
              href: 'https://live.mycelium.social',
              target: '_blank',
              rel: 'noopener',
              className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
            },
              createElement('span', { className: 'text-sm' }, '\u{1F534}'),
              'Live',
            ),
            createElement(Link, {
              to: '/signup',
              className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
              onClick: () => this.setState({ ...this.state, mobileOpen: false }),
            },
              createElement('span', { className: 'text-sm' }, '\u26A1'),
              'Deploy a Relay',
            ),
            createElement(Link, {
              to: '/faq',
              className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
              onClick: () => this.setState({ ...this.state, mobileOpen: false }),
            },
              createElement('span', { className: 'text-sm' }, '\u2753'),
              'FAQ',
            ),

            // Auth section
            auth.pubkey
              ? createElement('div', { className: 'space-y-0.5 border-t border-border mt-2 pt-2' },
                createElement(Link, { to: `/u/${auth.pubkey}`, className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors', onClick: () => this.setState({ ...this.state, mobileOpen: false }) }, 'Profile'),
                createElement(Link, { to: '/notifications', className: 'flex items-center justify-between px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors', onClick: () => this.setState({ ...this.state, mobileOpen: false }) },
                  'Notifications',
                  this.state.unseenNotifs > 0
                    ? createElement('span', { className: 'text-[10px] font-semibold rounded-full px-1.5 py-0.5 leading-none bg-primary text-primary-foreground' }, String(this.state.unseenNotifs))
                    : null,
                ),
                createElement(Link, { to: '/settings', className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors', onClick: () => this.setState({ ...this.state, mobileOpen: false }) }, 'Settings'),
                createElement(Link, { to: '/settings/relays', className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors', onClick: () => this.setState({ ...this.state, mobileOpen: false }) }, 'Relay Manager'),
                createElement(Link, { to: '/wallet', className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors', onClick: () => this.setState({ ...this.state, mobileOpen: false }) }, 'Wallet'),
                createElement(Link, { to: '/admin', className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors', onClick: () => this.setState({ ...this.state, mobileOpen: false }) }, 'Admin Panel'),
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
    const hideSidebar = isLanding || path.startsWith('/docs') || path.startsWith('/blocks');

    // Landing page and blocks page get full-width, no container constraints
    if (isLanding || path.startsWith('/blocks') || path.startsWith('/examples') || path.startsWith('/run') || path.startsWith('/notifications') || path.startsWith('/feed') || path.startsWith('/post/') || path.startsWith('/u/') || path.startsWith('/t/') || path.startsWith('/discover') || path.startsWith('/relay/') || path.startsWith('/settings') || path.startsWith('/signup') || path.startsWith('/faq') || path.startsWith('/admin') || path.startsWith('/wallet')) {
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
