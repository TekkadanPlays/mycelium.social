import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { getAuthState, subscribeAuth, login } from '../store/auth';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Separator } from '../ui/Separator';
import {
  Shield, Globe, Users, BarChart3, Lock, Bitcoin, Loader2, Check, Copy,
  AlertCircle, Zap, Server, Settings, RefreshCw, Play,
} from '../lib/icons';

type Section = 'myrelays' | 'overview' | 'relays' | 'users' | 'orders' | 'coinos' | 'directory';

interface MyRelay {
  id: string;
  name: string;
  domain: string | null;
  status: string | null;
  description: string | null;
}

interface AdminRelay {
  id: string;
  name: string;
  domain: string | null;
  status: string | null;
  ownerId: string;
  createdAt: string;
}

interface AdminUser {
  id: string;
  pubkey: string;
  admin: boolean;
  createdAt: string;
  _count?: { relays: number };
}

interface AdminOrder {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  relay?: { name: string };
}

interface OverviewData {
  totalRelays: number;
  totalUsers: number;
  totalOrders: number;
  activeRelays: number;
  revenue: number;
}

interface AdminState {
  pubkey: string | null;
  isAdmin: boolean;
  section: Section;
  domain: string;

  overview: OverviewData | null;
  overviewLoading: boolean;

  myRelays: MyRelay[];
  moderatedRelays: MyRelay[];
  myRelaysLoading: boolean;
  copiedId: string | null;

  relays: AdminRelay[];
  relaysLoading: boolean;
  relaySearch: string;

  users: AdminUser[];
  usersLoading: boolean;
  userSearch: string;

  orders: AdminOrder[];
  ordersLoading: boolean;

  coinosEnabled: boolean;
  coinosHealthy: boolean;
  coinosLoading: boolean;

  directoryRelays: MyRelay[];
  directoryLoading: boolean;
}

const NAV_ITEMS: { id: Section; label: string; icon: any; adminOnly?: boolean }[] = [
  { id: 'myrelays', label: 'My Relays', icon: Globe },
  { id: 'overview', label: 'Overview', icon: Shield, adminOnly: true },
  { id: 'relays', label: 'All Relays', icon: Server, adminOnly: true },
  { id: 'users', label: 'Users', icon: Users, adminOnly: true },
  { id: 'orders', label: 'Orders', icon: BarChart3, adminOnly: true },
  { id: 'coinos', label: 'Lightning', icon: Bitcoin },
  { id: 'directory', label: 'Directory', icon: Play },
];

export class Admin extends Component<{}, AdminState> {
  private unsub: (() => void) | null = null;
  declare state: AdminState;

  constructor(props: {}) {
    super(props);
    const auth = getAuthState();
    this.state = {
      pubkey: auth.pubkey,
      isAdmin: false,
      section: 'myrelays',
      domain: '',
      overview: null, overviewLoading: false,
      myRelays: [], moderatedRelays: [], myRelaysLoading: false, copiedId: null,
      relays: [], relaysLoading: false, relaySearch: '',
      users: [], usersLoading: false, userSearch: '',
      orders: [], ordersLoading: false,
      coinosEnabled: false, coinosHealthy: false, coinosLoading: false,
      directoryRelays: [], directoryLoading: false,
    };
  }

  componentDidMount() {
    this.unsub = subscribeAuth(() => {
      const auth = getAuthState();
      this.setState({ pubkey: auth.pubkey });
      this.checkAdmin();
    });
    this.loadConfig();
    this.checkAdmin();
  }

  componentWillUnmount() { this.unsub?.(); }

  private async loadConfig() {
    try {
      const cfg = await api.get<{ domain: string }>('/config');
      this.setState({ domain: cfg.domain || '' });
    } catch {}
  }

  private async checkAdmin() {
    try {
      const d = await api.get<{ admin?: boolean }>('/auth/me');
      const isAdmin = !!(d as any)?.admin || !!(d as any)?.user?.admin;
      this.setState({ isAdmin });
      if (isAdmin && this.state.section === 'myrelays') {
        this.switchSection('overview');
      } else {
        this.loadSectionData(this.state.section);
      }
    } catch {
      this.loadSectionData(this.state.section);
    }
  }

  private switchSection = (section: Section) => {
    this.setState({ section });
    this.loadSectionData(section);
  };

  private loadSectionData(section: Section) {
    switch (section) {
      case 'overview': return this.loadOverview();
      case 'myrelays': return this.loadMyRelays();
      case 'relays': return this.loadRelays();
      case 'users': return this.loadUsers();
      case 'orders': return this.loadOrders();
      case 'coinos': return this.loadCoinos();
      case 'directory': return this.loadDirectory();
    }
  }

  private async loadOverview() {
    this.setState({ overviewLoading: true });
    try {
      const d = await api.get<OverviewData>('/admin/overview');
      this.setState({ overview: d, overviewLoading: false });
    } catch { this.setState({ overviewLoading: false }); }
  }

  private async loadMyRelays() {
    this.setState({ myRelaysLoading: true });
    try {
      const d = await api.get<{ myRelays: MyRelay[]; moderatedRelays: MyRelay[] }>('/relays/mine');
      this.setState({ myRelays: d?.myRelays || [], moderatedRelays: d?.moderatedRelays || [], myRelaysLoading: false });
    } catch { this.setState({ myRelaysLoading: false }); }
  }

  private async loadRelays() {
    this.setState({ relaysLoading: true });
    try {
      const d = await api.get<{ relays: AdminRelay[] }>('/admin/relays');
      this.setState({ relays: d?.relays || [], relaysLoading: false });
    } catch { this.setState({ relaysLoading: false }); }
  }

  private async loadUsers() {
    this.setState({ usersLoading: true });
    try {
      const d = await api.get<{ users: AdminUser[] }>('/admin/users');
      this.setState({ users: d?.users || [], usersLoading: false });
    } catch { this.setState({ usersLoading: false }); }
  }

  private async loadOrders() {
    this.setState({ ordersLoading: true });
    try {
      const d = await api.get<{ orders: AdminOrder[] }>('/admin/orders');
      this.setState({ orders: d?.orders || [], ordersLoading: false });
    } catch { this.setState({ ordersLoading: false }); }
  }

  private async loadCoinos() {
    this.setState({ coinosLoading: true });
    try {
      const cfg = await api.get<{ coinos_enabled: boolean }>('/config');
      this.setState({ coinosEnabled: !!cfg.coinos_enabled });
      if (cfg.coinos_enabled) {
        const status = await api.get<{ healthy: boolean }>('/coinos/status').catch(() => ({ healthy: false }));
        this.setState({ coinosHealthy: !!(status as any).healthy });
      }
    } catch {}
    this.setState({ coinosLoading: false });
  }

  private async loadDirectory() {
    this.setState({ directoryLoading: true });
    try {
      const d = await api.get<{ relays: MyRelay[] }>('/relays/directory');
      this.setState({ directoryRelays: d?.relays || [], directoryLoading: false });
    } catch { this.setState({ directoryLoading: false }); }
  }

  private copyWss = (relay: MyRelay) => {
    const domain = relay.domain || this.state.domain;
    navigator.clipboard.writeText(`wss://${relay.name}.${domain}`);
    this.setState({ copiedId: relay.id });
    setTimeout(() => this.setState({ copiedId: null }), 2000);
  };

  // ─── Render helpers ─────────────────────────────────────────────────────

  private renderLoading() {
    return createElement('div', { className: 'flex justify-center py-16' },
      createElement(Loader2, { className: 'size-6 animate-spin text-muted-foreground' }),
    );
  }

  private renderOverview() {
    const { overview, overviewLoading } = this.state;
    if (overviewLoading) return this.renderLoading();
    if (!overview) return createElement('p', { className: 'text-sm text-muted-foreground py-8 text-center' }, 'No data available');

    const stats = [
      { label: 'Total Relays', value: overview.totalRelays, icon: Globe },
      { label: 'Active Relays', value: overview.activeRelays, icon: Zap },
      { label: 'Total Users', value: overview.totalUsers, icon: Users },
      { label: 'Total Orders', value: overview.totalOrders, icon: BarChart3 },
    ];

    return createElement('div', { className: 'space-y-6' },
      createElement('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' },
        ...stats.map((s) =>
          createElement(Card, { key: s.label, className: 'border-border/50' },
            createElement(CardContent, { className: 'p-4' },
              createElement('div', { className: 'flex items-center gap-3' },
                createElement('div', { className: 'size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0' },
                  createElement(s.icon, { className: 'size-5 text-primary' }),
                ),
                createElement('div', null,
                  createElement('p', { className: 'text-2xl font-extrabold font-mono' }, String(s.value)),
                  createElement('p', { className: 'text-[10px] text-muted-foreground uppercase tracking-wider' }, s.label),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  private renderMyRelays() {
    const { myRelays, moderatedRelays, myRelaysLoading, copiedId, domain } = this.state;
    if (myRelaysLoading) return this.renderLoading();

    const allRelays = [...myRelays, ...moderatedRelays];
    if (allRelays.length === 0) {
      return createElement('div', { className: 'text-center py-16 space-y-4' },
        createElement(Globe, { className: 'size-12 text-muted-foreground/30 mx-auto' }),
        createElement('h3', { className: 'text-lg font-semibold' }, 'No relays yet'),
        createElement('p', { className: 'text-sm text-muted-foreground' }, 'Deploy your first relay to get started.'),
        createElement(Link, { to: '/signup' },
          createElement(Button, { className: 'gap-2 mt-2' },
            createElement(Zap, { className: 'size-4' }), 'Deploy a Relay',
          ),
        ),
      );
    }

    return createElement('div', { className: 'space-y-4' },
      myRelays.length > 0
        ? createElement('div', { className: 'space-y-2' },
          createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider' }, 'Owned'),
          ...myRelays.map((r) => this.renderRelayCard(r, domain, copiedId, true)),
        )
        : null,
      moderatedRelays.length > 0
        ? createElement('div', { className: 'space-y-2' },
          createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider' }, 'Moderated'),
          ...moderatedRelays.map((r) => this.renderRelayCard(r, domain, copiedId, false)),
        )
        : null,
    );
  }

  private renderRelayCard(relay: MyRelay, domain: string, copiedId: string | null, isOwner: boolean) {
    const d = relay.domain || domain;
    const wss = `wss://${relay.name}.${d}`;
    return createElement(Card, { key: relay.id, className: 'border-border/50' },
      createElement(CardContent, { className: 'p-4 flex items-center justify-between gap-4' },
        createElement('div', { className: 'min-w-0' },
          createElement('div', { className: 'flex items-center gap-2' },
            createElement('p', { className: 'font-semibold text-sm' }, relay.name),
            createElement(Badge, {
              variant: 'secondary',
              className: relay.status === 'running'
                ? 'text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'text-[10px]',
            }, relay.status || 'unknown'),
            !isOwner ? createElement(Badge, { variant: 'outline', className: 'text-[10px]' }, 'Moderator') : null,
          ),
          createElement('p', { className: 'text-xs text-muted-foreground font-mono mt-0.5 truncate' }, wss),
        ),
        createElement('div', { className: 'flex items-center gap-1.5 shrink-0' },
          createElement(Button, {
            variant: 'ghost', size: 'sm',
            onClick: () => this.copyWss(relay),
            className: 'gap-1 text-xs',
          },
            copiedId === relay.id
              ? createElement(Check, { className: 'size-3.5 text-emerald-400' })
              : createElement(Copy, { className: 'size-3.5' }),
            copiedId === relay.id ? 'Copied' : 'Copy',
          ),
          createElement(Link, { to: `/relay/${relay.name}` },
            createElement(Button, { variant: 'outline', size: 'sm', className: 'text-xs' }, 'Manage'),
          ),
        ),
      ),
    );
  }

  private renderAllRelays() {
    const { relays, relaysLoading, relaySearch, domain } = this.state;
    if (relaysLoading) return this.renderLoading();

    const filtered = relaySearch
      ? relays.filter((r) => r.name.toLowerCase().includes(relaySearch.toLowerCase()))
      : relays;

    return createElement('div', { className: 'space-y-4' },
      createElement(Input, {
        placeholder: 'Search relays...',
        value: relaySearch,
        onInput: (e: Event) => this.setState({ relaySearch: (e.target as HTMLInputElement).value }),
        className: 'max-w-sm',
      }),
      createElement('div', { className: 'rounded-lg border border-border/50 divide-y divide-border/30' },
        ...filtered.map((r) =>
          createElement('div', { key: r.id, className: 'flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors' },
            createElement('div', { className: 'min-w-0' },
              createElement('p', { className: 'font-medium text-sm' }, r.name),
              createElement('p', { className: 'text-xs text-muted-foreground font-mono' }, `${r.name}.${r.domain || domain}`),
            ),
            createElement(Badge, {
              variant: 'secondary',
              className: r.status === 'running' ? 'text-[10px] bg-emerald-500/10 text-emerald-400' : 'text-[10px]',
            }, r.status || 'unknown'),
          ),
        ),
        filtered.length === 0
          ? createElement('div', { className: 'px-4 py-8 text-center text-sm text-muted-foreground' }, 'No relays found')
          : null,
      ),
    );
  }

  private renderUsers() {
    const { users, usersLoading, userSearch } = this.state;
    if (usersLoading) return this.renderLoading();

    const filtered = userSearch
      ? users.filter((u) => u.pubkey.toLowerCase().includes(userSearch.toLowerCase()))
      : users;

    return createElement('div', { className: 'space-y-4' },
      createElement(Input, {
        placeholder: 'Search by pubkey...',
        value: userSearch,
        onInput: (e: Event) => this.setState({ userSearch: (e.target as HTMLInputElement).value }),
        className: 'max-w-sm',
      }),
      createElement('div', { className: 'rounded-lg border border-border/50 divide-y divide-border/30' },
        ...filtered.map((u) =>
          createElement('div', { key: u.id, className: 'flex items-center justify-between px-4 py-3' },
            createElement('div', { className: 'min-w-0' },
              createElement('p', { className: 'text-sm font-mono truncate max-w-[300px]' }, u.pubkey),
              createElement('p', { className: 'text-[10px] text-muted-foreground' },
                `${u._count?.relays || 0} relays \u00B7 joined ${new Date(u.createdAt).toLocaleDateString()}`,
              ),
            ),
            u.admin ? createElement(Badge, { variant: 'default', className: 'text-[10px]' }, 'Admin') : null,
          ),
        ),
        filtered.length === 0
          ? createElement('div', { className: 'px-4 py-8 text-center text-sm text-muted-foreground' }, 'No users found')
          : null,
      ),
    );
  }

  private renderOrders() {
    const { orders, ordersLoading } = this.state;
    if (ordersLoading) return this.renderLoading();

    return createElement('div', { className: 'space-y-4' },
      orders.length === 0
        ? createElement('div', { className: 'py-12 text-center text-sm text-muted-foreground' }, 'No orders yet')
        : createElement('div', { className: 'rounded-lg border border-border/50 divide-y divide-border/30' },
          ...orders.map((o) =>
            createElement('div', { key: o.id, className: 'flex items-center justify-between px-4 py-3' },
              createElement('div', null,
                createElement('p', { className: 'text-sm font-medium' }, o.relay?.name || o.id),
                createElement('p', { className: 'text-[10px] text-muted-foreground' }, new Date(o.createdAt).toLocaleDateString()),
              ),
              createElement('div', { className: 'flex items-center gap-2' },
                createElement('span', { className: 'text-sm font-mono font-bold' }, `${o.amount.toLocaleString()} sats`),
                createElement(Badge, {
                  variant: o.status === 'paid' ? 'default' : 'secondary',
                  className: 'text-[10px]' + (o.status === 'paid' ? ' bg-emerald-500/10 text-emerald-400' : ''),
                }, o.status),
              ),
            ),
          ),
        ),
    );
  }

  private renderCoinos() {
    const { coinosEnabled, coinosHealthy, coinosLoading } = this.state;
    if (coinosLoading) return this.renderLoading();

    if (!coinosEnabled) {
      return createElement('div', { className: 'text-center py-16 space-y-4' },
        createElement(Bitcoin, { className: 'size-12 text-muted-foreground/30 mx-auto' }),
        createElement('h3', { className: 'text-lg font-semibold' }, 'Lightning Not Configured'),
        createElement('p', { className: 'text-sm text-muted-foreground max-w-sm mx-auto' },
          'CoinOS is not enabled on this server. Lightning payment features will be available once configured in the install script.',
        ),
      );
    }

    return createElement('div', { className: 'space-y-6' },
      createElement(Card, { className: 'border-border/50' },
        createElement(CardContent, { className: 'p-6' },
          createElement('div', { className: 'flex items-center gap-3 mb-4' },
            createElement('div', {
              className: 'size-10 rounded-lg flex items-center justify-center ' + (coinosHealthy ? 'bg-emerald-500/10' : 'bg-destructive/10'),
            },
              createElement(Bitcoin, { className: 'size-5 ' + (coinosHealthy ? 'text-emerald-400' : 'text-destructive') }),
            ),
            createElement('div', null,
              createElement('h3', { className: 'font-semibold' }, 'CoinOS Status'),
              createElement('p', { className: 'text-xs text-muted-foreground' }, coinosHealthy ? 'Connected and healthy' : 'Service unavailable'),
            ),
          ),
          createElement('p', { className: 'text-sm text-muted-foreground' },
            'Lightning wallet management is available through the ',
            createElement(Link, { to: '/wallet', className: 'text-primary hover:underline' }, 'Wallet page'),
            '. Full CoinOS admin features (funds, invoices, NWC apps) will be available here soon.',
          ),
        ),
      ),
    );
  }

  private renderDirectory() {
    const { directoryRelays, directoryLoading, domain } = this.state;
    if (directoryLoading) return this.renderLoading();

    return createElement('div', { className: 'space-y-4' },
      directoryRelays.length === 0
        ? createElement('div', { className: 'py-12 text-center text-sm text-muted-foreground' }, 'No public relays found')
        : createElement('div', { className: 'rounded-lg border border-border/50 divide-y divide-border/30' },
          ...directoryRelays.map((r) =>
            createElement('div', { key: r.id, className: 'flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors' },
              createElement('div', { className: 'min-w-0' },
                createElement('p', { className: 'font-medium text-sm' }, r.name),
                createElement('p', { className: 'text-xs text-muted-foreground font-mono' }, `${r.name}.${r.domain || domain}`),
                r.description ? createElement('p', { className: 'text-xs text-muted-foreground mt-0.5 line-clamp-1' }, r.description) : null,
              ),
              createElement(Badge, {
                variant: 'secondary',
                className: r.status === 'running' ? 'text-[10px] bg-emerald-500/10 text-emerald-400' : 'text-[10px]',
              }, r.status || 'unknown'),
            ),
          ),
        ),
    );
  }

  private renderContent() {
    switch (this.state.section) {
      case 'overview': return this.renderOverview();
      case 'myrelays': return this.renderMyRelays();
      case 'relays': return this.renderAllRelays();
      case 'users': return this.renderUsers();
      case 'orders': return this.renderOrders();
      case 'coinos': return this.renderCoinos();
      case 'directory': return this.renderDirectory();
      default: return null;
    }
  }

  render() {
    const { pubkey, isAdmin, section } = this.state;

    if (!pubkey) {
      return createElement('div', { className: 'flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto' },
        createElement('div', { className: 'size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5' },
          createElement(Shield, { className: 'size-8 text-primary' }),
        ),
        createElement('h1', { className: 'text-3xl font-extrabold tracking-tight' }, 'Admin Panel'),
        createElement('p', { className: 'mt-2 text-muted-foreground' }, 'Sign in with your Nostr identity to access the dashboard.'),
        createElement(Button, { onClick: login, className: 'mt-6 gap-2', size: 'lg' }, 'Sign In with Nostr'),
      );
    }

    const visibleNav = NAV_ITEMS.filter((n) => !n.adminOnly || isAdmin);

    return createElement('div', { className: 'max-w-6xl mx-auto py-6 px-4' },
      createElement('div', { className: 'flex items-center justify-between mb-6' },
        createElement('div', null,
          createElement('h1', { className: 'text-2xl font-extrabold tracking-tight' },
            isAdmin ? 'Admin Panel' : 'Dashboard',
          ),
          createElement('p', { className: 'text-sm text-muted-foreground mt-0.5' },
            isAdmin ? 'Manage relays, users, and platform settings' : 'Manage your relays and account',
          ),
        ),
        createElement(Link, { to: '/signup' },
          createElement(Button, { size: 'sm', className: 'gap-1.5' },
            createElement(Zap, { className: 'size-3.5' }), 'New Relay',
          ),
        ),
      ),

      createElement('div', { className: 'flex gap-6' },
        // Sidebar nav
        createElement('nav', { className: 'hidden md:block w-48 shrink-0' },
          createElement('div', { className: 'sticky top-[80px] space-y-0.5' },
            ...visibleNav.map((item) =>
              createElement('button', {
                key: item.id,
                type: 'button',
                onClick: () => this.switchSection(item.id),
                className: 'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors cursor-pointer'
                  + (section === item.id
                    ? ' bg-accent text-foreground font-medium'
                    : ' text-muted-foreground hover:text-foreground hover:bg-accent/50'),
              },
                createElement(item.icon, { className: 'size-4' }),
                item.label,
              ),
            ),
          ),
        ),

        // Mobile nav (horizontal scroll)
        createElement('div', { className: 'md:hidden flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 mb-4 w-full' },
          ...visibleNav.map((item) =>
            createElement('button', {
              key: item.id,
              type: 'button',
              onClick: () => this.switchSection(item.id),
              className: 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer border'
                + (section === item.id
                  ? ' bg-primary text-primary-foreground border-primary'
                  : ' border-border text-muted-foreground hover:text-foreground'),
            },
              createElement(item.icon, { className: 'size-3' }),
              item.label,
            ),
          ),
        ),

        // Content
        createElement('div', { className: 'flex-1 min-w-0' },
          this.renderContent(),
        ),
      ),
    );
  }
}
