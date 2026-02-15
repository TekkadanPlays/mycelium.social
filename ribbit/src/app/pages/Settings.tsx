import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState, subscribeAuth } from '../store/auth';
import { getProfile, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Separator } from '../ui/Separator';

interface SettingsState {
  pubkey: string | null;
  name: string;
  picture: string;
  npub: string;
}

export class Settings extends Component<{}, SettingsState> {
  private unsubAuth: (() => void) | null = null;
  private unsubProfiles: (() => void) | null = null;
  declare state: SettingsState;

  constructor(props: {}) {
    super(props);
    const auth = getAuthState();
    this.state = { pubkey: auth.pubkey, name: '', picture: '', npub: '' };
  }

  componentDidMount() {
    this.unsubAuth = subscribeAuth(() => {
      const auth = getAuthState();
      this.setState({ ...this.state, pubkey: auth.pubkey });
      this.updateProfile(auth.pubkey);
    });
    this.unsubProfiles = subscribeProfiles(() => {
      this.updateProfile(this.state.pubkey);
    });
    this.updateProfile(this.state.pubkey);
  }

  componentWillUnmount() {
    this.unsubAuth?.();
    this.unsubProfiles?.();
  }

  updateProfile(pubkey: string | null) {
    if (!pubkey) {
      this.setState({ name: '', picture: '', npub: '' });
      return;
    }
    const profile = getProfile(pubkey);
    this.setState({
      name: profile?.displayName || profile?.name || shortenNpub(npubEncode(pubkey)),
      picture: profile?.picture || '',
      npub: npubEncode(pubkey),
    });
  }

  render() {
    const { pubkey, name, picture, npub } = this.state;

    if (!pubkey) {
      return createElement('div', { className: 'text-center py-20' },
        createElement('div', { className: 'text-4xl mb-4' }, '\u2699\uFE0F'),
        createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Sign in to access settings.'),
      );
    }

    const initials = (name || '??').substring(0, 2).toUpperCase();

    const settingsSections = [
      {
        title: 'Network',
        items: [
          { to: '/settings/relays', label: 'Relay Manager', desc: 'Manage relay profiles: Outbox, Inbox, Indexers, and custom collections.', icon: '\u{1F4E1}' },
          { to: '/discover', label: 'Discover Relays', desc: 'Browse and search the relay network using NIP-66 monitoring.', icon: '\u{1F50D}' },
        ],
      },
      {
        title: 'Developer',
        items: [
          { to: '/raw', label: 'Raw Events', desc: 'Connect to any relay and inspect the raw event firehose.', icon: '\u{1F50C}' },
          { to: '/docs', label: 'Documentation', desc: 'Explore the ribbit.network stack documentation.', icon: '\uD83D\uDCDA' },
        ],
      },
    ];

    return createElement('div', { className: 'space-y-6 max-w-2xl' },
      // Page header
      createElement('div', null,
        createElement('h1', { className: 'text-xl font-bold tracking-tight' }, 'Settings'),
        createElement('p', { className: 'text-sm text-muted-foreground mt-1' }, 'Manage your account, relays, and preferences.'),
      ),

      // Profile card
      createElement('div', { className: 'rounded-xl border border-border p-5' },
        createElement('div', { className: 'flex items-center gap-4' },
          createElement(Avatar, { className: 'size-14' },
            picture
              ? createElement(AvatarImage, { src: picture, alt: name })
              : null,
            createElement(AvatarFallback, { className: 'text-lg' }, initials),
          ),
          createElement('div', { className: 'flex-1 min-w-0' },
            createElement('p', { className: 'font-semibold text-base truncate' }, name),
            createElement('p', { className: 'text-xs text-muted-foreground font-mono truncate mt-0.5' }, npub),
          ),
          createElement(Link, {
            to: `/u/${pubkey}`,
            className: 'shrink-0',
          },
            createElement(Button, { variant: 'outline', size: 'sm' }, 'View Profile'),
          ),
        ),
      ),

      // Settings sections
      ...settingsSections.map((section) =>
        createElement('div', { key: section.title, className: 'space-y-3' },
          createElement('h2', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider' }, section.title),
          createElement('div', { className: 'rounded-xl border border-border divide-y divide-border' },
            ...section.items.map((item) =>
              createElement(Link, {
                key: item.to,
                to: item.to,
                className: 'flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors first:rounded-t-xl last:rounded-b-xl',
              },
                createElement('span', { className: 'text-xl shrink-0' }, item.icon),
                createElement('div', { className: 'flex-1 min-w-0' },
                  createElement('p', { className: 'text-sm font-medium' }, item.label),
                  createElement('p', { className: 'text-xs text-muted-foreground mt-0.5' }, item.desc),
                ),
                createElement('span', { className: 'text-muted-foreground/40 text-sm shrink-0' }, '\u203A'),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
