import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { getAuthState, subscribeAuth, login } from '../store/auth';
import { api } from '../lib/api';
import {
  coinos, getCoinosToken, setCoinosToken, clearWalletSession, getActivePubkey,
  type CoinosUser, type CoinosPayment,
} from '../lib/coinos';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Separator } from '../ui/Separator';
import {
  Wallet as WalletIcon, Zap, ArrowDownLeft, ArrowUpRight, RefreshCw,
  AlertCircle, Loader2, Bitcoin, LogOut, Send, Copy, Check, ExternalLink,
} from '../lib/icons';

interface WalletState {
  pubkey: string | null;
  config: { coinos_enabled: boolean } | null;
  coinosUser: CoinosUser | null;
  payments: CoinosPayment[];
  incoming: number;
  outgoing: number;
  loading: boolean;
  connecting: boolean;
  error: string;
  btcRate: number | null;
  copied: string | null;

  // Send
  sendTo: string;
  sendAmount: string;
  sendMemo: string;
  sending: boolean;
  sendResult: string;

  // Receive
  recvAmount: string;
  recvMemo: string;
  recvCreating: boolean;
  recvInvoice: { bolt11?: string; text?: string; amount: number } | null;
}

function fmtSats(amount: number): string {
  return new Intl.NumberFormat().format(Math.abs(amount));
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export class Wallet extends Component<{}, WalletState> {
  private unsub: (() => void) | null = null;
  declare state: WalletState;

  constructor(props: {}) {
    super(props);
    const auth = getAuthState();
    this.state = {
      pubkey: auth.pubkey, config: null, coinosUser: null,
      payments: [], incoming: 0, outgoing: 0,
      loading: true, connecting: false, error: '', btcRate: null, copied: null,
      sendTo: '', sendAmount: '', sendMemo: '', sending: false, sendResult: '',
      recvAmount: '', recvMemo: '', recvCreating: false, recvInvoice: null,
    };
  }

  componentDidMount() {
    this.unsub = subscribeAuth(() => {
      this.setState({ pubkey: getAuthState().pubkey });
    });
    this.loadData();
  }

  componentWillUnmount() { this.unsub?.(); }

  private satsToUsd = (sats: number): string | null => {
    if (!this.state.btcRate) return null;
    const usd = (Math.abs(sats) / 100_000_000) * this.state.btcRate;
    return usd.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  private copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    this.setState({ copied: id });
    setTimeout(() => this.setState({ copied: null }), 2000);
  };

  private loadData = async () => {
    this.setState({ loading: true, error: '' });
    try {
      const cfg = await api.get<{ coinos_enabled: boolean }>('/config');
      this.setState({ config: cfg });
      if (!cfg.coinos_enabled) { this.setState({ loading: false }); return; }

      try { const rates = await coinos.rates(); if (rates?.USD) this.setState({ btcRate: rates.USD }); } catch {}

      const activePk = await getActivePubkey();
      const storedPk = localStorage.getItem('coinos_pubkey');
      if (storedPk && activePk && storedPk !== activePk) {
        clearWalletSession();
        this.setState({ coinosUser: null, payments: [] });
      }

      if (getCoinosToken()) {
        await this.loadWalletData();
      } else if ((window as any).nostr) {
        const ok = await this.connectWithNostr();
        if (ok) await this.loadWalletData();
      }
    } catch (err: any) { this.setState({ error: err.message }); }
    this.setState({ loading: false });
  };

  private connectWithNostr = async (): Promise<boolean> => {
    const nostr = (window as any).nostr;
    if (!nostr) { this.setState({ error: 'No Nostr extension found' }); return false; }
    this.setState({ connecting: true });
    try {
      const { challenge } = await coinos.challenge();
      const event = {
        kind: 27235,
        created_at: Math.floor(Date.now() / 1000),
        content: '',
        tags: [
          ['u', `${window.location.origin}/api/coinos/nostrAuth`],
          ['method', 'POST'],
          ['challenge', challenge],
        ],
      };
      const signedEvent = await nostr.signEvent(event);
      const pubkey = signedEvent.pubkey || (await nostr.getPublicKey());
      const result = await coinos.nostrAuth({ challenge, event: signedEvent });
      if (result.token) { setCoinosToken(pubkey, result.token); return true; }
      this.setState({ error: 'Authentication failed' });
      return false;
    } catch (err: any) { this.setState({ error: err.message || 'Failed to connect' }); return false; }
    finally { this.setState({ connecting: false }); }
  };

  private loadWalletData = async () => {
    try {
      const me = await coinos.me();
      this.setState({ coinosUser: me });
      const resp = await coinos.payments(15, 0);
      const inSats = resp.incoming ? Object.values(resp.incoming).reduce((a, b) => a + (b.sats || 0), 0) : 0;
      const outSats = resp.outgoing ? Object.values(resp.outgoing).reduce((a, b) => a + Math.abs(b.sats || 0), 0) : 0;
      this.setState({ payments: resp.payments || [], incoming: inSats, outgoing: outSats });
    } catch {
      clearWalletSession();
      this.setState({ coinosUser: null });
    }
  };

  private handleConnect = async () => {
    this.setState({ error: '' });
    const ok = await this.connectWithNostr();
    if (ok) await this.loadWalletData();
  };

  private handleLogout = () => {
    clearWalletSession();
    this.setState({ coinosUser: null, payments: [] });
  };

  private handleSend = async () => {
    const { sendTo, sendAmount, sendMemo } = this.state;
    const amt = parseInt(sendAmount);
    if (!sendTo.trim() || !amt) return;
    this.setState({ sending: true, sendResult: '', error: '' });
    try {
      if (sendTo.includes('@')) {
        await coinos.sendToLnAddress(sendTo.trim(), amt);
      } else if (sendTo.startsWith('ln') || sendTo.startsWith('LNBC') || sendTo.startsWith('lnbc')) {
        await coinos.sendPayment({ payreq: sendTo.trim(), amount: amt, memo: sendMemo || undefined });
      } else {
        await coinos.sendInternal({ username: sendTo.trim(), amount: amt, memo: sendMemo || undefined });
      }
      this.setState({ sendResult: 'Payment sent!', sendTo: '', sendAmount: '', sendMemo: '' });
      await this.loadWalletData();
    } catch (err: any) { this.setState({ error: err.message }); }
    this.setState({ sending: false });
  };

  private handleCreateInvoice = async () => {
    const amt = parseInt(this.state.recvAmount);
    if (!amt) return;
    this.setState({ recvCreating: true, recvInvoice: null, error: '' });
    try {
      const inv = await coinos.createInvoice({ amount: amt, memo: this.state.recvMemo || undefined, type: 'lightning' });
      this.setState({ recvInvoice: inv, recvAmount: '', recvMemo: '' });
    } catch (err: any) { this.setState({ error: err.message }); }
    this.setState({ recvCreating: false });
  };

  render() {
    const { pubkey, config, coinosUser, payments, incoming, outgoing, loading, connecting, error, btcRate, copied } = this.state;
    const { sendTo, sendAmount, sendMemo, sending, sendResult, recvAmount, recvMemo, recvCreating, recvInvoice } = this.state;

    if (loading) {
      return createElement('div', { className: 'flex justify-center py-24' },
        createElement(Loader2, { className: 'size-8 animate-spin text-muted-foreground' }),
      );
    }

    if (!pubkey) {
      return createElement('div', { className: 'flex flex-col items-center py-24 text-center' },
        createElement('div', { className: 'size-16 rounded-2xl bg-muted flex items-center justify-center mb-5' },
          createElement(WalletIcon, { className: 'size-8 text-muted-foreground/40' }),
        ),
        createElement('h2', { className: 'text-xl font-bold' }, 'Sign in to access your wallet'),
        createElement('p', { className: 'mt-2 text-sm text-muted-foreground max-w-xs' }, 'Connect your Nostr extension to access CoinOS.'),
        createElement(Button, { onClick: login, className: 'mt-4 gap-2' }, 'Sign In'),
      );
    }

    if (config && !config.coinos_enabled) {
      return createElement('div', { className: 'flex flex-col items-center py-24 text-center' },
        createElement('div', { className: 'size-16 rounded-2xl bg-muted flex items-center justify-center mb-5' },
          createElement(Bitcoin, { className: 'size-8 text-muted-foreground/40' }),
        ),
        createElement('h2', { className: 'text-xl font-bold' }, 'Wallet Not Available'),
        createElement('p', { className: 'mt-2 text-sm text-muted-foreground max-w-xs' }, 'CoinOS is not enabled on this server.'),
      );
    }

    if (!coinosUser) {
      return createElement('div', { className: 'mx-auto max-w-md py-8' },
        createElement('div', { className: 'text-center mb-8' },
          createElement('div', { className: 'size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5' },
            createElement(Zap, { className: 'size-8 text-primary' }),
          ),
          createElement('h1', { className: 'text-3xl font-extrabold tracking-tight' }, 'Wallet'),
          createElement('p', { className: 'mt-2 text-muted-foreground' }, 'Lightning payments powered by CoinOS.'),
        ),
        error ? createElement('div', { className: 'flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6' },
          createElement(AlertCircle, { className: 'size-4 shrink-0' }), error,
        ) : null,
        createElement(Button, { onClick: this.handleConnect, disabled: connecting, className: 'w-full gap-2 h-12 text-base' },
          connecting ? createElement(Loader2, { className: 'size-4 animate-spin' }) : createElement(ExternalLink, { className: 'size-4' }),
          connecting ? 'Connecting...' : 'Connect with Nostr',
        ),
      );
    }

    // Connected wallet view
    const balance = coinosUser.balance || 0;
    const usdBal = this.satsToUsd(balance);

    return createElement('div', { className: 'max-w-2xl mx-auto py-6 px-4 space-y-6' },
      // Header
      createElement('div', { className: 'flex items-center justify-between' },
        createElement('h1', { className: 'text-2xl font-extrabold tracking-tight' }, 'Wallet'),
        createElement('div', { className: 'flex items-center gap-2' },
          createElement(Button, { variant: 'ghost', size: 'sm', onClick: this.loadData, className: 'gap-1' },
            createElement(RefreshCw, { className: 'size-3.5' }), 'Refresh',
          ),
          createElement(Button, { variant: 'ghost', size: 'sm', onClick: this.handleLogout, className: 'gap-1 text-muted-foreground' },
            createElement(LogOut, { className: 'size-3.5' }), 'Disconnect',
          ),
        ),
      ),

      // Error
      error ? createElement('div', { className: 'flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive' },
        createElement(AlertCircle, { className: 'size-4 shrink-0' }), error,
      ) : null,

      // Balance
      createElement(Card, { className: 'border-border/50 bg-gradient-to-br from-primary/5 to-transparent' },
        createElement(CardContent, { className: 'p-6 text-center' },
          createElement('p', { className: 'text-xs text-muted-foreground uppercase tracking-wider mb-1' }, 'Balance'),
          createElement('p', { className: 'text-4xl font-extrabold font-mono tabular-nums' }, fmtSats(balance)),
          createElement('p', { className: 'text-sm text-muted-foreground' }, 'sats'),
          usdBal ? createElement('p', { className: 'text-lg font-semibold text-primary mt-1' }, '\u2248 ' + usdBal) : null,
        ),
      ),

      // Quick stats
      createElement('div', { className: 'grid grid-cols-2 gap-3' },
        createElement(Card, { className: 'border-border/50' },
          createElement(CardContent, { className: 'p-4 flex items-center gap-3' },
            createElement('div', { className: 'size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0' },
              createElement(ArrowDownLeft, { className: 'size-4 text-emerald-400' }),
            ),
            createElement('div', null,
              createElement('p', { className: 'text-[10px] text-muted-foreground' }, 'Received'),
              createElement('p', { className: 'text-sm font-bold font-mono' }, fmtSats(incoming) + ' sats'),
            ),
          ),
        ),
        createElement(Card, { className: 'border-border/50' },
          createElement(CardContent, { className: 'p-4 flex items-center gap-3' },
            createElement('div', { className: 'size-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0' },
              createElement(ArrowUpRight, { className: 'size-4 text-red-400' }),
            ),
            createElement('div', null,
              createElement('p', { className: 'text-[10px] text-muted-foreground' }, 'Sent'),
              createElement('p', { className: 'text-sm font-bold font-mono' }, fmtSats(outgoing) + ' sats'),
            ),
          ),
        ),
      ),

      // Send
      createElement(Card, { className: 'border-border/50' },
        createElement(CardContent, { className: 'p-5 space-y-3' },
          createElement('h3', { className: 'text-sm font-semibold flex items-center gap-2' },
            createElement(Send, { className: 'size-4 text-primary' }), 'Send',
          ),
          createElement(Input, {
            placeholder: 'Username, Lightning address, or invoice...',
            value: sendTo,
            onInput: (e: Event) => this.setState({ sendTo: (e.target as HTMLInputElement).value }),
          }),
          createElement(Input, {
            placeholder: 'Amount (sats)', type: 'number', value: sendAmount,
            onInput: (e: Event) => this.setState({ sendAmount: (e.target as HTMLInputElement).value }),
          }),
          createElement(Button, { onClick: this.handleSend, disabled: sending || !sendTo.trim() || !sendAmount, className: 'w-full gap-2', size: 'sm' },
            sending ? createElement(Loader2, { className: 'size-4 animate-spin' }) : createElement(Send, { className: 'size-4' }),
            sending ? 'Sending...' : 'Send',
          ),
          sendResult ? createElement('p', { className: 'text-sm text-emerald-400' }, sendResult) : null,
        ),
      ),

      // Receive
      createElement(Card, { className: 'border-border/50' },
        createElement(CardContent, { className: 'p-5 space-y-3' },
          createElement('h3', { className: 'text-sm font-semibold flex items-center gap-2' },
            createElement(ArrowDownLeft, { className: 'size-4 text-primary' }), 'Receive',
          ),
          createElement(Input, {
            placeholder: 'Amount (sats)', type: 'number', value: recvAmount,
            onInput: (e: Event) => this.setState({ recvAmount: (e.target as HTMLInputElement).value }),
          }),
          createElement(Input, {
            placeholder: 'Memo (optional)', value: recvMemo,
            onInput: (e: Event) => this.setState({ recvMemo: (e.target as HTMLInputElement).value }),
          }),
          createElement(Button, { onClick: this.handleCreateInvoice, disabled: recvCreating || !recvAmount, className: 'w-full gap-2', size: 'sm' },
            recvCreating ? createElement(Loader2, { className: 'size-4 animate-spin' }) : createElement(Zap, { className: 'size-4' }),
            'Create Invoice',
          ),
          recvInvoice ? createElement('div', { className: 'rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1' },
            createElement('p', { className: 'text-xs font-semibold text-emerald-400' }, 'Invoice Created'),
            createElement('p', { className: 'text-xs' }, 'Amount: ', createElement('span', { className: 'font-mono font-bold' }, fmtSats(recvInvoice.amount) + ' sats')),
            (recvInvoice.bolt11 || recvInvoice.text) ? createElement('div', { className: 'flex items-center gap-1.5' },
              createElement('code', { className: 'text-[10px] font-mono truncate flex-1' }, (recvInvoice.bolt11 || recvInvoice.text || '').slice(0, 50) + '...'),
              createElement('button', {
                onClick: () => this.copyText(recvInvoice!.bolt11 || recvInvoice!.text || '', 'inv'),
                className: 'shrink-0 cursor-pointer',
              }, copied === 'inv' ? createElement(Check, { className: 'size-3.5 text-emerald-400' }) : createElement(Copy, { className: 'size-3.5' })),
            ) : null,
          ) : null,
        ),
      ),

      // Recent activity
      payments.length > 0 ? createElement('div', { className: 'space-y-3' },
        createElement('h3', { className: 'text-sm font-semibold' }, 'Recent Activity'),
        createElement('div', { className: 'rounded-lg border border-border/50 divide-y divide-border/30' },
          ...payments.slice(0, 10).map((p) => {
            const isIn = p.amount > 0;
            return createElement('div', { key: p.id || p.hash || String(p.created), className: 'flex items-center gap-3 px-4 py-3' },
              createElement('div', { className: 'size-8 rounded-full flex items-center justify-center shrink-0 ' + (isIn ? 'bg-emerald-500/10' : 'bg-red-500/10') },
                isIn ? createElement(ArrowDownLeft, { className: 'size-4 text-emerald-400' }) : createElement(ArrowUpRight, { className: 'size-4 text-red-400' }),
              ),
              createElement('div', { className: 'flex-1 min-w-0' },
                createElement('p', { className: 'text-sm font-medium truncate' }, p.type || 'Payment'),
                createElement('p', { className: 'text-[10px] text-muted-foreground' }, fmtDate(p.created)),
              ),
              createElement('p', { className: 'text-sm font-bold font-mono tabular-nums ' + (isIn ? 'text-emerald-400' : 'text-red-400') },
                (isIn ? '+' : '-') + fmtSats(p.amount),
              ),
            );
          }),
        ),
      ) : null,
    );
  }
}
