import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Feed } from '../components/Feed';
import { getAuthState, subscribeAuth, login } from '../store/auth';
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

  render() {
    const { isAuthenticated } = this.state;

    return createElement('div', { className: 'mx-auto max-w-2xl px-4 sm:px-6 py-6' },
      // Login prompt for logged-out users
      !isAuthenticated
        ? createElement('div', {
            className: 'rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-6 mb-6',
          },
            createElement('div', { className: 'flex items-center justify-between gap-4 flex-wrap' },
              createElement('div', null,
                createElement('h2', { className: 'text-base font-bold tracking-tight' },
                  '\u{1F344} Welcome to Mycelium',
                ),
                createElement('p', { className: 'text-sm text-muted-foreground mt-1' },
                  'A Nostr client built different. Sign in to post, react, and join the conversation.',
                ),
              ),
              createElement(Button, {
                onClick: login,
              }, 'Sign In'),
            ),
          )
        : null,

      // Feed for everyone
      createElement(Feed, null),
    );
  }
}
