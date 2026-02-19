import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Kind, createEvent } from '../../nostr/event';
import { signWithExtension } from '../../nostr/nip07';
import { getAuthState } from '../store/auth';
import { getPool } from '../store/relay';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface ComposeState {
  content: string;
  isPublishing: boolean;
  error: string | null;
}

export class Compose extends Component<{ onPublished?: () => void }, ComposeState> {
  declare state: ComposeState;

  constructor(props: { onPublished?: () => void }) {
    super(props);
    this.state = {
      content: '',
      isPublishing: false,
      error: null,
    };
  }

  handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    this.setState({ ...this.state, content: target.value, error: null });
  };

  handleSubmit = async () => {
    const auth = getAuthState();
    if (!auth.pubkey || !this.state.content.trim()) return;

    this.setState({ ...this.state, isPublishing: true, error: null });
    try {
      const unsigned = createEvent(Kind.Text, this.state.content.trim(), [], auth.pubkey);
      const signed = await signWithExtension(unsigned);
      const pool = getPool();
      const results = await pool.publish(signed);

      const anyAccepted = Array.from(results.values()).some((r) => r.accepted);
      if (anyAccepted) {
        this.setState({ content: '', isPublishing: false, error: null });
        this.props.onPublished?.();
      } else {
        const msgs = Array.from(results.values()).map((r) => r.message).filter(Boolean);
        this.setState({ ...this.state, isPublishing: false, error: msgs[0] || 'Relay rejected the event' });
      }
    } catch (err) {
      this.setState({ ...this.state, isPublishing: false, error: String(err) });
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  render() {
    const auth = getAuthState();
    const { content, isPublishing, error } = this.state;

    if (!auth.pubkey) return null;

    return createElement('div', {
      className: 'rounded-2xl border border-border bg-card p-5 shadow-sm',
    },
      createElement(Textarea, {
        value: content,
        onInput: this.handleInput,
        onKeyDown: this.handleKeyDown,
        placeholder: "What's on your mind?",
        rows: 3,
        className: 'resize-none min-h-[80px] border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-muted-foreground/50',
      }),
      createElement('div', { className: 'flex items-center justify-between mt-4 pt-3 border-t border-border/40' },
        createElement('div', { className: 'flex items-center gap-3' },
          createElement('span', { className: 'text-[11px] text-muted-foreground/40 tabular-nums' },
            content.length > 0 ? content.length + ' chars' : '',
          ),
          createElement('span', { className: 'text-[11px] text-muted-foreground/30' },
            '\u2318\u21A9 to post',
          ),
        ),
        createElement(Button, {
          onClick: this.handleSubmit,
          disabled: isPublishing || !content.trim(),
        }, isPublishing ? 'Publishing...' : 'Post'),
      ),
      error
        ? createElement('p', { className: 'text-xs text-destructive mt-3' }, error)
        : null,
    );
  }
}
