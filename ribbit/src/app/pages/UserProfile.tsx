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
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
    const auth = getAuthState();
    const isOwnProfile = auth.pubkey === pubkey;

    return createElement('div', { className: 'space-y-4 max-w-2xl' },
      // Back link
      createElement(Link, {
        to: '/feed',
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors',
      }, '\u2190 Back to feed'),

      // Profile card
      createElement('div', { className: 'rounded-xl border border-border overflow-hidden' },
        // Banner
        createElement('div', { className: 'h-36 sm:h-44 bg-muted relative overflow-hidden' },
          profile?.banner
            ? createElement('img', { src: profile.banner, alt: '', className: 'w-full h-full object-cover' })
            : createElement('div', { className: 'w-full h-full bg-gradient-to-br from-primary/15 via-primary/5 to-transparent' }),
        ),

        // Profile info
        createElement('div', { className: 'px-5 pb-5 -mt-12 relative' },
          // Avatar + actions row
          createElement('div', { className: 'flex items-end justify-between mb-3' },
            createElement(Avatar, { className: 'size-20 border-4 border-background shadow-lg' },
              profile?.picture
                ? createElement(AvatarImage, { src: profile.picture, alt: displayName })
                : null,
              createElement(AvatarFallback, { className: 'text-xl' }, initial),
            ),

            // Actions
            createElement('div', { className: 'flex items-center gap-2 pt-14' },
              isOwnProfile
                ? createElement(Link, { to: '/settings' },
                    createElement(Button, { variant: 'outline', size: 'sm' }, 'Edit Profile'),
                  )
                : auth.pubkey
                  ? createElement(Button, {
                      onClick: this.handleFollow,
                      disabled: this.state.followLoading,
                      variant: this.state.isFollowed ? 'outline' : 'default',
                      size: 'sm',
                      className: this.state.isFollowed ? 'hover:text-destructive hover:border-destructive/50' : '',
                    }, this.state.followLoading ? '...' : this.state.isFollowed ? 'Unfollow' : 'Follow')
                  : null,
            ),
          ),

          // Name + NIP-05
          createElement('h1', { className: 'text-xl font-bold tracking-tight' }, displayName),
          profile?.nip05
            ? createElement('p', { className: 'text-sm text-primary mt-0.5' }, profile.nip05)
            : null,

          // Npub
          createElement('button', {
            className: 'text-xs font-mono text-muted-foreground/50 mt-1 hover:text-muted-foreground transition-colors truncate max-w-full text-left',
            onClick: () => navigator.clipboard.writeText(npub),
            title: 'Click to copy',
          }, npub),

          // Bio
          profile?.about
            ? createElement('p', { className: 'text-sm text-muted-foreground mt-3 leading-relaxed' }, profile.about)
            : null,

          // Stats row
          createElement('div', { className: 'flex items-center gap-4 mt-4 pt-3 border-t border-border' },
            createElement('div', { className: 'text-center' },
              createElement('p', { className: 'text-sm font-bold' }, String(posts.length)),
              createElement('p', { className: 'text-[11px] text-muted-foreground' }, 'Posts'),
            ),
            this.state.isFollowed
              ? createElement(Badge, { variant: 'secondary', className: 'text-[10px]' }, 'Following')
              : null,
          ),
        ),
      ),

      // Posts section
      createElement('div', { className: 'space-y-3' },
        createElement('p', { className: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground' },
          'Posts',
        ),

        isLoading && posts.length === 0
          ? createElement('div', { className: 'flex justify-center py-16' },
              createElement(Spinner, null),
            )
          : posts.length > 0
            ? createElement('div', { className: 'space-y-3' },
                ...posts.map((event) => createElement(PostCard, { key: event.id, event, compact: true })),
              )
            : createElement('div', { className: 'text-center py-12' },
                createElement('p', { className: 'text-sm text-muted-foreground' }, 'No posts yet.'),
              ),
      ),
    );
  }
}
