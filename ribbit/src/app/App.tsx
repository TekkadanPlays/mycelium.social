import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Route, Switch, Link } from 'inferno-router';
import { MainLayout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { UserProfile } from './pages/UserProfile';
import { Login } from './components/Login';
import { RawEvents } from './pages/RawEvents';
import { Settings } from './pages/Settings';
import { RelayManager } from './pages/RelayManager';
import { RelayDiscovery } from './pages/RelayDiscovery';
import { Notifications } from './pages/Notifications';
import { HashtagFeed } from './pages/HashtagFeed';
import { Docs } from './pages/docs/DocsRouter';
import { BlocksShowcase } from './pages/BlocksShowcase';
import { ExamplesPage } from './pages/ExamplesPage';
import { Toaster } from './ui/Toast';
import { getAuthState, subscribeAuth, restoreSession } from './store/auth';
import { connectRelays, getPool } from './store/relay';
import { loadContacts } from './store/contacts';
import { loadRelayList, resetRelayList } from './store/relaylist';
import { loadRelayManager, syncPoolToActiveProfile } from './store/relaymanager';
import { fetchProfile } from './store/profiles';
import { signWithExtension } from '../nostr/nip07';
import { initTheme } from './store/theme';

interface AppState {
  isAuthenticated: boolean;
}

export class App extends Component<{}, AppState> {
  private unsub: (() => void) | null = null;
  declare state: AppState;

  constructor(props: {}) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  private updateAuthSigner() {
    const auth = getAuthState();
    const pool = getPool();
    if (auth.pubkey) {
      pool.setAuthSigner((unsigned) => signWithExtension(unsigned));
    } else {
      pool.setAuthSigner(null);
    }
  }

  private onAuthChange() {
    const auth = getAuthState();
    this.setState({ isAuthenticated: !!auth.pubkey });
    this.updateAuthSigner();

    if (auth.pubkey) {
      // Fetch user data after login or session restore
      fetchProfile(auth.pubkey);
      loadContacts();
      loadRelayList();
    } else {
      resetRelayList();
    }
  }

  componentDidMount() {
    // Apply persisted theme immediately
    initTheme();

    this.unsub = subscribeAuth(() => this.onAuthChange());

    // Load relay manager from localStorage and sync pool
    loadRelayManager();
    syncPoolToActiveProfile();

    // Initialize — don't block render on relay connection
    restoreSession();
    this.updateAuthSigner();
    connectRelays().then(() => {
      // Fetch user data once relays are connected (session may already be restored)
      this.onAuthChange();
    }).catch((err) => console.warn('Relay connect error:', err));
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  render() {
    return createElement(MainLayout, null,
      createElement(Toaster, { position: 'top-center' }),
      createElement(Switch, null,
        createElement(Route, { exact: true, path: '/', component: Landing }),
        createElement(Route, { exact: true, path: '/feed', component: Home }),
        createElement(Route, { path: '/post/:id', component: PostDetail }),
        createElement(Route, { path: '/u/:pubkey', component: UserProfile }),
        createElement(Route, { path: '/login', component: Login }),
        createElement(Route, { path: '/notifications', component: Notifications }),
        createElement(Route, { exact: true, path: '/settings', component: Settings }),
        createElement(Route, { path: '/settings/relays', component: RelayManager }),
        createElement(Route, { path: '/discover', component: RelayDiscovery }),
        createElement(Route, { path: '/t/:tag', component: HashtagFeed }),
        createElement(Route, { path: '/raw', component: RawEvents }),
        createElement(Route, { path: '/blocks', component: BlocksShowcase }),
        createElement(Route, { path: '/examples', component: ExamplesPage }),
        createElement(Route, { path: '/docs', component: Docs }),
        createElement(Route, { path: '/docs/:rest*', component: Docs }),
        createElement(Route, {
          path: '*',
          component: () => createElement('div', { className: 'text-center py-16' },
            createElement('div', { className: 'text-4xl mb-3' }, '\u{1F438}'),
            createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, '404 — Page not found'),
            createElement(Link, { to: '/feed', className: 'inline-block mt-3 text-xs text-primary hover:underline' }, '\u2190 Back to feed'),
          ),
        }),
      ),
    );
  }
}
