import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Card, CardContent } from '../ui/Card';
import { HelpCircle, Zap, Shield, Globe, Settings } from '../lib/icons';

interface FAQItem {
  q: string;
  a: string;
}

const SECTIONS: { title: string; icon: any; items: FAQItem[] }[] = [
  {
    title: 'Getting Started',
    icon: Zap,
    items: [
      {
        q: 'What is a Nostr relay?',
        a: 'A Nostr relay is a server that stores and forwards Nostr events (messages, posts, reactions, etc.) between clients. Running your own relay gives you control over your data and who can access it.',
      },
      {
        q: 'How do I create a relay?',
        a: 'Sign in with your Nostr identity (NIP-07 browser extension like nos2x or Alby), then visit the Deploy page. Choose a name for your relay and it will be provisioned automatically.',
      },
      {
        q: 'Do I need technical knowledge?',
        a: 'No. Mycelium handles all the infrastructure for you. Your relay is managed through a simple web interface where you can configure access controls, moderators, and more.',
      },
      {
        q: 'How long does provisioning take?',
        a: 'Most relays are ready within 1-2 minutes after creation. You will receive a WebSocket URL (wss://yourname.mycelium.social) that you can add to any Nostr client.',
      },
    ],
  },
  {
    title: 'Access & Moderation',
    icon: Shield,
    items: [
      {
        q: 'Can I control who uses my relay?',
        a: 'Yes. You can set your relay to public (anyone can read/write), restricted (allowlist/blocklist), or private (invite-only). Access control lists let you manage exactly who can post.',
      },
      {
        q: 'What is Web of Trust filtering?',
        a: 'Web of Trust uses the social graph (who follows whom) to automatically filter spam. Users within N degrees of your follow list get access, while unknown accounts are blocked.',
      },
      {
        q: 'Can I add moderators?',
        a: 'Yes. You can add other Nostr pubkeys as moderators who can manage the relay settings, approve users, and handle content moderation.',
      },
    ],
  },
  {
    title: 'Payments & Pricing',
    icon: Globe,
    items: [
      {
        q: 'How do payments work?',
        a: 'Relay hosting is paid via Lightning Network (Bitcoin). You can pay with any Lightning wallet. Invoices are generated automatically and your relay stays active as long as your subscription is current.',
      },
      {
        q: 'What happens if my payment lapses?',
        a: 'Your relay data is preserved for 30 days after expiration. During this time you can renew to restore service. After 30 days, the relay and its data may be removed.',
      },
      {
        q: 'Can I use my own domain?',
        a: 'Premium plans support custom domains. You point a CNAME record to our servers and we handle the TLS certificate automatically.',
      },
    ],
  },
  {
    title: 'Technical',
    icon: Settings,
    items: [
      {
        q: 'What relay software do you use?',
        a: 'We use strfry, a high-performance C++ Nostr relay. It supports all standard NIPs and can handle thousands of concurrent connections.',
      },
      {
        q: 'Is there an API?',
        a: 'Yes. The relay management API is available at /api. You can programmatically manage relay settings, view invoices, and more. Authentication uses JWT tokens from NIP-07 login.',
      },
      {
        q: 'Can I export my relay data?',
        a: 'Yes. You can export all events stored on your relay in standard Nostr JSON format. Contact support for bulk exports.',
      },
      {
        q: 'What NIPs are supported?',
        a: 'strfry supports NIP-01, NIP-02, NIP-04, NIP-09, NIP-11, NIP-12, NIP-15, NIP-16, NIP-20, NIP-22, NIP-28, NIP-33, NIP-40, NIP-42, NIP-45, NIP-50, and more.',
      },
    ],
  },
];

interface FAQState {
  openIndex: string | null;
}

export class FAQ extends Component<{}, FAQState> {
  declare state: FAQState;

  constructor(props: {}) {
    super(props);
    this.state = { openIndex: null };
  }

  private toggle = (key: string) => {
    this.setState({ openIndex: this.state.openIndex === key ? null : key });
  };

  render() {
    const { openIndex } = this.state;

    return createElement('div', { className: 'max-w-3xl mx-auto py-8 px-4 space-y-8' },
      // Hero
      createElement('div', { className: 'text-center space-y-3' },
        createElement('div', { className: 'size-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4' },
          createElement(HelpCircle, { className: 'size-7 text-primary' }),
        ),
        createElement('h1', { className: 'text-4xl font-extrabold tracking-tight' }, 'Frequently Asked Questions'),
        createElement('p', { className: 'text-lg text-muted-foreground' }, 'Everything you need to know about running a Nostr relay on Mycelium.'),
      ),

      // Sections
      ...SECTIONS.map((section, si) =>
        createElement('div', { key: section.title, className: 'space-y-3' },
          createElement('div', { className: 'flex items-center gap-2.5 mb-1' },
            createElement(section.icon, { className: 'size-5 text-primary' }),
            createElement('h2', { className: 'text-xl font-bold' }, section.title),
          ),
          ...section.items.map((item, qi) => {
            const key = `${si}-${qi}`;
            const isOpen = openIndex === key;
            return createElement('div', {
              key,
              className: 'rounded-lg border border-border/50 overflow-hidden transition-colors' + (isOpen ? ' bg-accent/30' : ''),
            },
              createElement('button', {
                type: 'button',
                onClick: () => this.toggle(key),
                className: 'flex items-center justify-between w-full px-4 py-3.5 text-left cursor-pointer',
              },
                createElement('span', { className: 'text-sm font-semibold pr-4' }, item.q),
                createElement('span', {
                  className: 'text-muted-foreground shrink-0 transition-transform duration-200' + (isOpen ? ' rotate-180' : ''),
                }, '\u25BE'),
              ),
              isOpen
                ? createElement('div', { className: 'px-4 pb-4' },
                  createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' }, item.a),
                )
                : null,
            );
          }),
        ),
      ),
    );
  }
}
