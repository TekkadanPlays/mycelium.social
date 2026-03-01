import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState, subscribeAuth, login } from '../store/auth';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Separator } from '../ui/Separator';
import { Zap, Check, AlertCircle, Loader2, Shield, ShieldCheck } from '../lib/icons';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  badge?: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: '21,000',
    period: 'sats / month',
    features: [
      'Custom relay subdomain',
      'Nostr relay (strfry)',
      'Access control lists',
      'Moderator management',
      'Web of trust filtering',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '69,000',
    period: 'sats / month',
    badge: 'Popular',
    highlight: true,
    features: [
      'Everything in Standard',
      'Custom domain support',
      'Priority provisioning',
      'Stream relay integration',
      'Lightning payment splits',
      'Premium support',
    ],
  },
];

interface CreateRelayState {
  pubkey: string | null;
  isLoading: boolean;
  name: string;
  selectedPlan: string;
  submitting: boolean;
  error: string;
  success: boolean;
  domain: string;
  paymentsEnabled: boolean;
}

export class CreateRelay extends Component<{}, CreateRelayState> {
  private unsub: (() => void) | null = null;
  declare state: CreateRelayState;

  constructor(props: {}) {
    super(props);
    const auth = getAuthState();
    this.state = {
      pubkey: auth.pubkey,
      isLoading: auth.isLoading,
      name: '',
      selectedPlan: 'standard',
      submitting: false,
      error: '',
      success: false,
      domain: '',
      paymentsEnabled: false,
    };
  }

  componentDidMount() {
    this.unsub = subscribeAuth(() => {
      const auth = getAuthState();
      this.setState({ pubkey: auth.pubkey, isLoading: auth.isLoading });
    });
    this.loadConfig();
  }

  componentWillUnmount() { this.unsub?.(); }

  private async loadConfig() {
    try {
      const config = await api.get<{ domain: string; payments_enabled?: boolean }>('/config');
      this.setState({ domain: config.domain, paymentsEnabled: !!config.payments_enabled });
    } catch { /* ignore */ }
  }

  private handleSubmit = async () => {
    const { name, pubkey } = this.state;
    if (!name.trim() || !pubkey) return;
    this.setState({ submitting: true, error: '' });
    try {
      await api.post('/relays', { name: name.trim().toLowerCase() });
      this.setState({ success: true, submitting: false });
    } catch (err: any) {
      this.setState({ error: err.message, submitting: false });
    }
  };

  render() {
    const { pubkey, isLoading, name, selectedPlan, submitting, error, success, domain, paymentsEnabled } = this.state;

    if (!pubkey) {
      return createElement('div', { className: 'flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto' },
        createElement('div', { className: 'size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5' },
          createElement(Zap, { className: 'size-8 text-primary' }),
        ),
        createElement('h1', { className: 'text-3xl font-extrabold tracking-tight' }, 'Deploy Your Relay'),
        createElement('p', { className: 'mt-2 text-muted-foreground' }, 'Sign in with your Nostr identity to create a relay.'),
        createElement(Button, {
          onClick: login,
          disabled: isLoading,
          className: 'mt-6 gap-2',
          size: 'lg',
        }, isLoading ? 'Connecting...' : 'Sign In with Nostr'),
      );
    }

    if (success) {
      return createElement('div', { className: 'flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto' },
        createElement('div', { className: 'size-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5' },
          createElement(Check, { className: 'size-8 text-emerald-400' }),
        ),
        createElement('h1', { className: 'text-3xl font-extrabold tracking-tight' }, 'Relay Created!'),
        createElement('p', { className: 'mt-2 text-muted-foreground' },
          domain ? `${name}.${domain} is being provisioned.` : 'Your relay is being provisioned.',
        ),
        createElement('p', { className: 'mt-1 text-sm text-muted-foreground' }, 'It should be ready within a few minutes.'),
        createElement(Link, { to: '/admin', className: 'mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline' }, 'Go to Admin Panel \u2192'),
      );
    }

    return createElement('div', { className: 'max-w-4xl mx-auto py-8 px-4 space-y-8' },
      // Hero
      createElement('div', { className: 'text-center space-y-3' },
        createElement('h1', { className: 'text-4xl font-extrabold tracking-tight' }, 'Deploy Your Relay'),
        createElement('p', { className: 'text-lg text-muted-foreground max-w-xl mx-auto' },
          'Get your own Nostr relay up and running in seconds. Choose a plan that fits your needs.',
        ),
      ),

      // Plans (only show if payments enabled)
      paymentsEnabled
        ? createElement('div', { className: 'grid md:grid-cols-2 gap-6 max-w-2xl mx-auto' },
          ...PLANS.map((plan) =>
            createElement('button', {
              key: plan.id,
              type: 'button',
              onClick: () => this.setState({ selectedPlan: plan.id }),
              className: 'text-left rounded-xl border-2 p-6 transition-all cursor-pointer'
                + (selectedPlan === plan.id
                  ? ' border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : ' border-border hover:border-primary/30'),
            },
              createElement('div', { className: 'flex items-center justify-between mb-4' },
                createElement('h3', { className: 'text-lg font-bold' }, plan.name),
                plan.badge
                  ? createElement(Badge, { variant: 'default', className: 'text-[10px]' }, plan.badge)
                  : null,
              ),
              createElement('div', { className: 'mb-4' },
                createElement('span', { className: 'text-3xl font-extrabold font-mono' }, plan.price),
                createElement('span', { className: 'text-sm text-muted-foreground ml-2' }, plan.period),
              ),
              createElement(Separator, { className: 'mb-4' }),
              createElement('ul', { className: 'space-y-2' },
                ...plan.features.map((f) =>
                  createElement('li', { key: f, className: 'flex items-center gap-2 text-sm' },
                    createElement(Check, { className: 'size-4 text-primary shrink-0' }),
                    f,
                  ),
                ),
              ),
            ),
          ),
        )
        : createElement('div', { className: 'max-w-md mx-auto' },
          createElement(Card, { className: 'border-primary/30 bg-primary/5' },
            createElement(CardContent, { className: 'p-6 text-center' },
              createElement(ShieldCheck, { className: 'size-8 text-primary mx-auto mb-3' }),
              createElement('p', { className: 'text-sm font-semibold' }, 'Free Relay Deployment'),
              createElement('p', { className: 'text-xs text-muted-foreground mt-1' }, 'Payments are not enabled on this server. Relay creation is free.'),
            ),
          ),
        ),

      // Create form
      createElement(Card, { className: 'max-w-md mx-auto' },
        createElement(CardHeader, null,
          createElement(CardTitle, null, 'Choose a Relay Name'),
        ),
        createElement(CardContent, { className: 'space-y-4' },
          createElement('div', { className: 'flex items-center gap-2' },
            createElement(Input, {
              placeholder: 'myrelay',
              value: name,
              onInput: (e: Event) => this.setState({ name: (e.target as HTMLInputElement).value }),
              className: 'font-mono',
            }),
            domain
              ? createElement('span', { className: 'text-sm text-muted-foreground whitespace-nowrap font-mono' }, `.${domain}`)
              : null,
          ),
          name.trim()
            ? createElement('p', { className: 'text-xs text-muted-foreground' },
              'Your relay will be available at ',
              createElement('code', { className: 'text-primary' }, `wss://${name.trim().toLowerCase()}.${domain || 'example.com'}`),
            )
            : null,
          error
            ? createElement('div', { className: 'flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive' },
              createElement(AlertCircle, { className: 'size-4 shrink-0' }), error,
            )
            : null,
          createElement(Button, {
            onClick: this.handleSubmit,
            disabled: submitting || !name.trim(),
            className: 'w-full gap-2',
          },
            submitting
              ? createElement(Loader2, { className: 'size-4 animate-spin' })
              : createElement(Zap, { className: 'size-4' }),
            submitting ? 'Creating...' : 'Deploy Relay',
          ),
        ),
      ),
    );
  }
}
