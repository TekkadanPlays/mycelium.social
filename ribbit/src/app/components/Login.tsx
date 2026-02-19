import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { getAuthState, subscribeAuth, login } from '../store/auth';
import { hasNip07 } from '../../nostr/nip07';
import { isAndroid } from '../../nostr/nip55';
import { Button } from '../ui/Button';

interface LoginState {
  auth: ReturnType<typeof getAuthState>;
  hasExtension: boolean;
  showHelp: boolean;
}

export class Login extends Component<{}, LoginState> {
  private unsub: (() => void) | null = null;
  declare state: LoginState;

  constructor(props: {}) {
    super(props);
    this.state = {
      auth: getAuthState(),
      hasExtension: false,
      showHelp: false,
    };
  }

  componentDidMount() {
    this.unsub = subscribeAuth(() => {
      this.setState({ ...this.state, auth: getAuthState() });
    });
    // Check for extension after a short delay (extensions inject async)
    setTimeout(() => {
      const has = hasNip07() || isAndroid();
      this.setState({ ...this.state, hasExtension: has, showHelp: !has });
    }, 500);
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  render() {
    const { auth, hasExtension, showHelp } = this.state;

    const extensions = [
      { platform: 'Desktop', app: 'nos2x or Alby extension', links: [
        { label: 'nos2x', href: 'https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp' },
        { label: 'Alby', href: 'https://chrome.google.com/webstore/detail/alby-bitcoin-lightning-wa/iokeahhehimjnekafflcihljlcjccdbe' },
      ]},
      { platform: 'iOS', app: 'Nostore', links: [
        { label: 'Install', href: 'https://apps.apple.com/us/app/nostore/id1666553677' },
      ]},
      { platform: 'Android', app: 'Amber (NIP-55 signer)', links: [
        { label: 'Install', href: 'https://play.google.com/store/apps/details?id=com.greenart7c3.nostrsigner' },
      ]},
    ];

    return createElement('div', null,
      // Hero
      createElement('div', { className: 'text-center mb-10' },
        createElement('p', {
          className: 'text-xs font-medium tracking-wide uppercase text-muted-foreground mb-3',
        }, 'Decentralized Social \u00B7 Powered by Nostr'),
        createElement('h1', { className: 'text-2xl sm:text-3xl font-bold tracking-tight mb-3' },
          'Welcome to ',
          createElement('span', { className: 'text-primary' }, 'Mycelium'),
        ),
        createElement('p', {
          className: 'text-sm text-muted-foreground max-w-lg mx-auto mb-6',
        }, 'A decentralized Nostr social platform. No algorithms, no censorship. Just conversations.'),
        createElement('div', { className: 'flex items-center justify-center gap-3' },
          createElement(Button, {
            onClick: login,
            disabled: hasExtension ? auth.isLoading : false,
          }, hasExtension && auth.isLoading ? 'Connecting...' : 'Sign In with Nostr'),
          createElement(Button, {
            variant: 'outline',
            onClick: () => this.setState({ ...this.state, showHelp: !showHelp }),
          }, showHelp ? 'Hide Help' : 'Get Started'),
        ),
        auth.error
          ? createElement('p', { className: 'text-xs text-destructive mt-3' }, auth.error)
          : null,
      ),

      // Feature grid
      createElement('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10' },
        ...[
          { icon: '\u{1F310}', title: 'Decentralized', desc: 'No central server. Your identity lives on the Nostr network.' },
          { icon: '\u{1F438}', title: 'Community-first', desc: 'Upvotes, threads, and groups. Built for real discussion.' },
          { icon: '\u{1F512}', title: 'You own your keys', desc: 'Sign in with your Nostr extension. No passwords, no email.' },
          { icon: '\u26A1', title: 'Lightning-fast', desc: 'Built with InfernoJS. Blazing fast rendering, tiny bundle.' },
        ].map((f) =>
          createElement('div', {
            key: f.title,
            className: 'p-4 rounded-lg border border-border bg-card/40',
          },
            createElement('div', { className: 'text-primary mb-2.5 text-lg' }, f.icon),
            createElement('h3', { className: 'font-medium text-sm mb-1' }, f.title),
            createElement('p', { className: 'text-xs text-muted-foreground leading-relaxed' }, f.desc),
          ),
        ),
      ),

      // NIP-07 help section
      showHelp
        ? createElement('div', {
            className: 'max-w-md mx-auto rounded-lg border border-border bg-background p-6',
          },
            createElement('h3', { className: 'font-semibold text-lg mb-2' }, 'Sign in with Nostr'),
            createElement('p', { className: 'text-sm text-muted-foreground mb-5' },
              'You need a NIP-07 browser extension to sign in.',
            ),
            createElement('div', { className: 'space-y-2' },
              ...extensions.map((ext) =>
                createElement('div', {
                  key: ext.platform,
                  className: 'flex items-center justify-between p-3 rounded-md bg-muted/50',
                },
                  createElement('div', null,
                    createElement('p', { className: 'text-sm font-medium' }, ext.platform),
                    createElement('p', { className: 'text-xs text-muted-foreground' }, ext.app),
                  ),
                  createElement('div', { className: 'flex gap-3' },
                    ...ext.links.map((link) =>
                      createElement('a', {
                        key: link.label,
                        href: link.href,
                        target: '_blank',
                        rel: 'noopener',
                        className: 'text-xs font-medium text-primary hover:underline',
                      }, link.label),
                    ),
                  ),
                ),
              ),
            ),
          )
        : null,
    );
  }
}
