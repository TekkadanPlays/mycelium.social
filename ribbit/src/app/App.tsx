import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Route, Switch, Link } from 'inferno-router';
import { MainLayout } from './components/Layout';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { UserProfile } from './pages/UserProfile';
import { Login } from './components/Login';
import { RawEvents } from './pages/RawEvents';
import { RelaySettings } from './pages/RelaySettings';
import { Notifications } from './pages/Notifications';
import { HashtagFeed } from './pages/HashtagFeed';
import { Docs } from './pages/Docs';
import { getAuthState, subscribeAuth, restoreSession } from './store/auth';
import { connectRelays, getPool } from './store/relay';
import { loadContacts } from './store/contacts';
import { signWithExtension } from '../nostr/nip07';

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

  componentDidMount() {
    this.unsub = subscribeAuth(() => {
      this.setState({
        ...this.state,
        isAuthenticated: !!getAuthState().pubkey,
      });
      this.updateAuthSigner();
    });

    // Initialize — don't block render on relay connection
    restoreSession();
    this.updateAuthSigner();
    connectRelays().then(() => {
      loadContacts();
    }).catch((err) => console.warn('Relay connect error:', err));
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  render() {
    return createElement(MainLayout, null,
      createElement(Switch, null,
        createElement(Route, { exact: true, path: '/', component: Home }),
        createElement(Route, { path: '/post/:id', component: PostDetail }),
        createElement(Route, { path: '/u/:pubkey', component: UserProfile }),
        createElement(Route, { path: '/login', component: Login }),
        createElement(Route, { path: '/notifications', component: Notifications }),
        createElement(Route, { path: '/relays', component: RelaySettings }),
        createElement(Route, { path: '/t/:tag', component: HashtagFeed }),
        createElement(Route, { path: '/raw', component: RawEvents }),
        createElement(Route, { path: '/docs', component: Docs }),
        createElement(Route, {
          path: '*',
          component: () => createElement('div', { className: 'text-center py-16' },
            createElement('div', { className: 'text-4xl mb-3' }, '\u{1F438}'),
            createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, '404 — Page not found'),
            createElement(Link, { to: '/', className: 'inline-block mt-3 text-xs text-primary hover:underline' }, '\u2190 Back to feed'),
          ),
        }),
      ),
    );
  }
}
