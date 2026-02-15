import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import type { NostrEvent } from '../../nostr/event';
import { Kind } from '../../nostr/event';
import { PostCard } from '../components/PostCard';
import { getPool } from '../store/relay';
import { getProfile, fetchProfile, subscribeProfiles } from '../store/profiles';
import { npubEncode, shortenNpub } from '../../nostr/utils';
import { isRootNote } from '../../nostr/nip10';
import { getAuthState } from '../store/auth';
import { isFollowing, followUser, unfollowUser, subscribeContacts } from '../store/contacts';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

interface UserProfileProps {
  match: { params: { pubkey: string } };
}

interface UserProfileState {
  profile: ReturnType<typeof getProfile>;
  posts: NostrEvent[];
  isLoading: boolean;
  isFollowed: boolean;
  followLoading: boolean;
}

export class UserProfile extends Component<UserProfileProps, UserProfileState> {
  private unsubProfiles: (() => void) | null = null;
  private unsubContacts: (() => void) | null = null;
  declare state: UserProfileState;

  constructor(props: UserProfileProps) {
    super(props);
    this.state = {
      profile: undefined,
      posts: [],
      isLoading: true,
      isFollowed: isFollowing(props.match.params.pubkey),
      followLoading: false,
    };
  }

  componentDidMount() {
    this.unsubProfiles = subscribeProfiles(() => {
      this.setState({
        ...this.state,
        profile: getProfile(this.props.match.params.pubkey),
      });
    });
    this.unsubContacts = subscribeContacts(() => {
      this.setState({ ...this.state, isFollowed: isFollowing(this.props.match.params.pubkey) });
    });
    this.loadUser();
  }

  componentWillUnmount() {
    this.unsubProfiles?.();
    this.unsubContacts?.();
  }

  handleFollow = async () => {
    const pubkey = this.props.match.params.pubkey;
    this.setState({ ...this.state, followLoading: true });
    try {
      if (this.state.isFollowed) {
        await unfollowUser(pubkey);
      } else {
        await followUser(pubkey);
      }
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
    this.setState({ ...this.state, followLoading: false });
  };

  loadUser() {
    const pubkey = this.props.match.params.pubkey;
    fetchProfile(pubkey);

    const pool = getPool();
    pool.subscribe(
      [{ kinds: [Kind.Text], authors: [pubkey], limit: 30 }],
      (event) => {
        if (!isRootNote(event)) return;
        if (this.state.posts.some((p) => p.id === event.id)) return;
        this.setState({
          ...this.state,
          posts: [...this.state.posts, event].sort((a, b) => b.created_at - a.created_at),
        });
      },
      () => {
        this.setState({ ...this.state, isLoading: false });
      },
    );
  }

  render() {
    const { profile, posts, isLoading } = this.state;
    const pubkey = this.props.match.params.pubkey;
    const npub = npubEncode(pubkey);
    const displayName = profile?.displayName || profile?.name || shortenNpub(npub);
    const initial = (displayName || '?')[0].toUpperCase();

    return createElement('div', { className: 'space-y-4' },
      createElement(Link, {
        to: '/',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2',
      }, '\u2190 Back to feed'),

      // Profile header
      createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
        // Banner
        createElement('div', { className: 'h-32 bg-muted relative overflow-hidden' },
          profile?.banner
            ? createElement('img', { src: profile.banner, alt: '', className: 'w-full h-full object-cover' })
            : createElement('div', { className: 'w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20' }),
          createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-background/90 to-transparent' }),
        ),
        // Info
        createElement('div', { className: 'px-5 pb-5 -mt-10 relative text-center' },
          // Avatar
          profile?.picture
            ? createElement('img', {
                src: profile.picture,
                alt: displayName,
                className: 'w-16 h-16 rounded-full object-cover border-4 border-background mx-auto',
              })
            : createElement('div', {
                className: 'w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background mx-auto',
              },
                createElement('span', { className: 'text-lg font-semibold text-primary' }, initial),
              ),
          createElement('h2', { className: 'font-bold text-lg mt-3' }, displayName),
          // Follow/unfollow button
          getAuthState().pubkey && getAuthState().pubkey !== pubkey
            ? createElement(Button, {
                onClick: this.handleFollow,
                disabled: this.state.followLoading,
                variant: this.state.isFollowed ? 'outline' : 'default',
                size: 'xs',
                className: this.state.isFollowed ? 'mt-2 hover:text-destructive hover:border-destructive/50' : 'mt-2',
              }, this.state.followLoading ? '...' : this.state.isFollowed ? 'Unfollow' : 'Follow')
            : null,
          profile?.nip05
            ? createElement('p', { className: 'text-xs text-primary mt-0.5' }, profile.nip05)
            : null,
          createElement('p', { className: 'text-xs font-mono text-muted-foreground/40 mt-1 break-all' }, npub),
          profile?.about
            ? createElement('p', { className: 'text-sm text-muted-foreground mt-3 leading-relaxed max-w-lg mx-auto' }, profile.about)
            : null,
        ),
      ),

      // Posts heading
      createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' },
        `Posts (${posts.length})`,
      ),

      // Posts list
      isLoading && posts.length === 0
        ? createElement('div', { className: 'flex justify-center py-16' },
            createElement(Spinner, null),
          )
        : posts.length > 0
          ? createElement('div', { className: 'space-y-3' },
              ...posts.map((event) => createElement(PostCard, { key: event.id, event })),
            )
          : createElement('div', { className: 'text-center py-8 text-xs text-muted-foreground' },
              'No posts yet',
            ),
    );
  }
}
