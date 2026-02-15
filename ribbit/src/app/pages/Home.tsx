import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Feed } from '../components/Feed';
import { Compose } from '../components/Compose';
import { getAuthState, subscribeAuth, login } from '../store/auth';
import { loadFeed } from '../store/feed';
import { Button } from '../ui/Button';

interface HomeState {
  isAuthenticated: boolean;
}

export class Home extends Component<{}, HomeState> {
  private unsub: (() => void) | null = null;
  declare state: HomeState;

  constructor(props: {}) {
    super(props);
    this.state = { isAuthenticated: !!getAuthState().pubkey };
  }

  componentDidMount() {
    this.unsub = subscribeAuth(() => {
      this.setState({ isAuthenticated: !!getAuthState().pubkey });
    });
  }

  componentWillUnmount() {
    this.unsub?.();
  }

  handlePublished = () => {
    loadFeed();
  };

  render() {
    const { isAuthenticated } = this.state;

    return createElement('div', { className: 'space-y-4' },
      // Login prompt for logged-out users
      !isAuthenticated
        ? createElement('div', {
            className: 'rounded-xl border border-border bg-muted/30 p-5 flex items-center justify-between gap-4 flex-wrap',
          },
            createElement('div', null,
              createElement('p', { className: 'text-sm font-semibold' },
                '\u{1F438} Welcome to ribbit',
              ),
              createElement('p', { className: 'text-xs text-muted-foreground mt-1' },
                'Sign in with your Nostr extension to post, react, and reply.',
              ),
            ),
            createElement(Button, {
              onClick: login,
              size: 'sm',
            }, 'Sign In'),
          )
        : null,

      // Compose box for logged-in users
      isAuthenticated
        ? createElement(Compose, { onPublished: this.handlePublished })
        : null,

      // Feed for everyone
      createElement(Feed, null),
    );
  }
}
