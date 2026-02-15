import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState, subscribeAuth, login, logout } from '../store/auth';
import { getRelayState, subscribeRelay } from '../store/relay';
import { getProfile, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';

interface HeaderState {
  auth: ReturnType<typeof getAuthState>;
  relay: ReturnType<typeof getRelayState>;
  profileName: string;
  mobileOpen: boolean;
  dropdownOpen: boolean;
}

export class Header extends Component<{}, HeaderState> {
  private unsubAuth: (() => void) | null = null;
  private unsubRelay: (() => void) | null = null;
  private unsubProfiles: (() => void) | null = null;
  private outsideClickHandler: ((e: Event) => void) | null = null;
  declare state: HeaderState;

  constructor(props: {}) {
    super(props);
    this.state = {
      auth: getAuthState(),
      relay: getRelayState(),
      profileName: '',
      mobileOpen: false,
      dropdownOpen: false,
    };
  }

  componentDidMount() {
    this.unsubAuth = subscribeAuth(() => {
      const auth = getAuthState();
      this.setState({ ...this.state, auth });
      this.updateProfileName(auth.pubkey);
    });
    this.unsubRelay = subscribeRelay(() => {
      this.setState({ ...this.state, relay: getRelayState() });
    });
    this.unsubProfiles = subscribeProfiles(() => {
      this.updateProfileName(this.state.auth.pubkey);
    });
    this.updateProfileName(this.state.auth.pubkey);

    this.outsideClickHandler = () => {
      if (this.state.dropdownOpen) this.setState({ ...this.state, dropdownOpen: false });
    };
    document.addEventListener('click', this.outsideClickHandler);
  }

  componentWillUnmount() {
    this.unsubAuth?.();
    this.unsubRelay?.();
    this.unsubProfiles?.();
    if (this.outsideClickHandler) document.removeEventListener('click', this.outsideClickHandler);
  }

  updateProfileName(pubkey: string | null) {
    if (!pubkey) {
      this.setState({ profileName: '' });
      return;
    }
    const profile = getProfile(pubkey);
    const name = profile?.displayName || profile?.name || shortenNpub(npubEncode(pubkey));
    this.setState({ profileName: name });
  }

  getRelayStatus(): string {
    const statuses = Array.from(this.state.relay.statuses.values());
    if (statuses.some((s) => s === 'connected')) return 'connected';
    if (statuses.some((s) => s === 'connecting')) return 'connecting';
    return 'disconnected';
  }

  render() {
    const { auth, profileName, mobileOpen, dropdownOpen } = this.state;
    const relayStatus = this.getRelayStatus();
    const initials = (profileName || '??').substring(0, 2).toUpperCase();

    const navLinks = [
      { to: '/', label: 'Feed' },
      { to: '/notifications', label: 'Notifications' },
      { to: '/raw', label: 'Events' },
      { to: '/docs', label: 'Blazecn' },
    ];

    return createElement('nav', {
      className: 'sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md',
    },
      createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 lg:px-8' },
        // 3-column grid: logo | center nav | right actions
        createElement('div', {
          className: 'grid h-14 items-center',
          style: { gridTemplateColumns: '1fr auto 1fr' },
        },
          // Left: Logo
          createElement('div', { className: 'flex items-center' },
            createElement(Link, { to: '/', className: 'flex items-center gap-2 group' },
              createElement('span', { className: 'text-lg' }, '\u{1F438}'),
              createElement('span', { className: 'font-bold text-sm tracking-tight' }, 'ribbit'),
            ),
          ),

          // Center: Nav links (desktop)
          createElement('div', { className: 'hidden lg:flex items-center gap-1' },
            ...navLinks.map((link) =>
              createElement(Link, {
                key: link.label,
                to: link.to,
                className: 'px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
              }, link.label),
            ),
          ),

          // Right: Actions
          createElement('div', { className: 'flex items-center justify-end gap-2' },
            // Relay status badge
            createElement('div', {
              className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                relayStatus === 'connected' ? 'bg-success/10 text-success'
                : relayStatus === 'connecting' ? 'bg-warning/10 text-warning'
                : 'bg-destructive/10 text-destructive'
              }`,
            },
              createElement('span', {
                className: `w-1.5 h-1.5 rounded-full ${
                  relayStatus === 'connected' ? 'bg-success'
                  : relayStatus === 'connecting' ? 'bg-warning animate-pulse'
                  : 'bg-destructive'
                }`,
              }),
              relayStatus,
            ),

            auth.pubkey
              ? createElement('div', { className: 'relative hidden lg:block' },
                  // User dropdown trigger
                  createElement('button', {
                    onClick: (e: Event) => { e.stopPropagation(); this.setState({ ...this.state, dropdownOpen: !dropdownOpen }); },
                    className: 'flex items-center gap-1.5 py-1 text-muted-foreground hover:text-foreground transition-colors',
                  },
                    createElement('div', {
                      className: 'w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center',
                    },
                      createElement('span', { className: 'text-xs font-semibold text-primary' }, initials),
                    ),
                    createElement('span', { className: 'text-sm font-medium' }, profileName),
                    createElement('span', { className: 'text-xs opacity-40' }, '\u25BE'),
                  ),

                  // Dropdown menu
                  dropdownOpen
                    ? createElement('div', {
                        className: 'absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-lg shadow-lg py-1 z-50',
                      },
                        createElement(Link, {
                          to: `/u/${auth.pubkey}`,
                          className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Profile'),
                        createElement(Link, {
                          to: '/notifications',
                          className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Notifications'),
                        createElement(Link, {
                          to: '/relays',
                          className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Relay Settings'),
                        createElement(Link, {
                          to: '/raw',
                          className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                        }, 'Raw Events'),
                        createElement('div', { className: 'border-t border-border my-1' }),
                        createElement('button', {
                          onClick: logout,
                          className: 'flex items-center gap-2.5 px-3 py-2 w-full text-sm text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-colors',
                        }, 'Sign Out'),
                      )
                    : null,
                )
              : createElement('button', {
                  onClick: login,
                  disabled: auth.isLoading,
                  className: 'hidden lg:inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors',
                }, auth.isLoading ? 'Connecting...' : 'Sign In'),

            // Mobile menu button
            createElement('button', {
              onClick: () => this.setState({ ...this.state, mobileOpen: !mobileOpen }),
              className: 'lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
            }, mobileOpen ? '\u2715' : '\u2630'),
          ),
        ),
      ),

      // Mobile menu
      mobileOpen
        ? createElement('div', { className: 'lg:hidden border-t border-border bg-background' },
            createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 py-3 space-y-0.5' },
              ...navLinks.map((link) =>
                createElement(Link, {
                  key: link.label,
                  to: link.to,
                  className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                  onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                }, link.label),
              ),
              createElement('div', { className: 'border-t border-border mt-2 pt-3' },
                auth.pubkey
                  ? createElement('div', { className: 'space-y-0.5' },
                      createElement(Link, {
                        to: `/u/${auth.pubkey}`,
                        className: 'block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
                        onClick: () => this.setState({ ...this.state, mobileOpen: false }),
                      }, 'Profile'),
                      createElement('button', {
                        onClick: () => { logout(); this.setState({ ...this.state, mobileOpen: false }); },
                        className: 'flex items-center px-3 py-2.5 w-full text-sm text-destructive/70 hover:text-destructive rounded-md transition-colors',
                      }, 'Sign Out'),
                    )
                  : createElement('button', {
                      onClick: () => { login(); this.setState({ ...this.state, mobileOpen: false }); },
                      className: 'w-full text-center py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors',
                    }, 'Sign In with Nostr'),
              ),
            ),
          )
        : null,
    );
  }
}

export class Sidebar extends Component {
  render() {
    const sections = [
      {
        heading: 'Feed',
        links: [
          { to: '/', label: 'Hot', icon: '\u{1F525}' },
          { to: '/?sort=new', label: 'New', icon: '\u2728' },
          { to: '/?sort=top', label: 'Top', icon: '\u{1F4C8}' },
        ],
      },
      {
        heading: 'You',
        links: [
          { to: '/notifications', label: 'Notifications', icon: '\u{1F514}' },
          { to: '/relays', label: 'Relays', icon: '\u{1F4E1}' },
        ],
      },
      {
        heading: 'Explore',
        links: [
          { to: '/raw', label: 'Raw Events', icon: '\u{1F50C}' },
        ],
      },
      {
        heading: 'Developer',
        links: [
          { to: '/docs', label: 'Blazecn', icon: '\u26A1' },
        ],
      },
    ];

    return createElement('aside', { className: 'hidden lg:block w-52 shrink-0' },
      createElement('div', { className: 'sticky top-[72px] space-y-5' },
        ...sections.map((section) =>
          createElement('div', { key: section.heading },
            createElement('p', {
              className: 'px-3 mb-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground/60',
            }, section.heading),
            ...section.links.map((link) =>
              createElement(Link, {
                key: link.label,
                to: link.to,
                className: 'flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-md transition-colors',
              },
                createElement('span', { className: 'text-muted-foreground/60' }, link.icon),
                link.label,
              ),
            ),
          ),
        ),
        // About
        createElement('div', { className: 'border-t border-border pt-4 mt-4' },
          createElement('div', { className: 'px-3 text-xs text-muted-foreground/50 leading-relaxed' },
            'ribbit.network',
            createElement('br', null),
            'Powered by Nostr',
          ),
        ),
      ),
    );
  }
}

export class MainLayout extends Component<{ children: any }> {
  render() {
    const hideSidebar = typeof window !== 'undefined' && window.location.pathname === '/docs';

    return createElement('div', { className: 'min-h-screen bg-background' },
      createElement(Header, null),
      createElement('div', { className: 'mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8' },
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
