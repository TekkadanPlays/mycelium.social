import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { cn } from './utils';

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

interface AvatarProps {
  className?: string;
  children?: any;
}

export function Avatar({ className, children }: AvatarProps) {
  return createElement('span', {
    'data-slot': 'avatar',
    className: cn(
      'relative flex size-8 shrink-0 overflow-hidden rounded-full',
      className,
    ),
  }, children);
}

// ---------------------------------------------------------------------------
// AvatarImage
// ---------------------------------------------------------------------------

interface AvatarImageProps {
  className?: string;
  src?: string;
  alt?: string;
  onError?: (e: Event) => void;
}

export class AvatarImage extends Component<AvatarImageProps, { failed: boolean }> {
  declare state: { failed: boolean };

  constructor(props: AvatarImageProps) {
    super(props);
    this.state = { failed: false };
  }

  componentDidUpdate(prevProps: AvatarImageProps) {
    if (prevProps.src !== this.props.src) {
      this.setState({ failed: false });
    }
  }

  render() {
    if (this.state.failed || !this.props.src) return null;

    return createElement('img', {
      'data-slot': 'avatar-image',
      src: this.props.src,
      alt: this.props.alt || '',
      onError: (e: Event) => {
        this.setState({ failed: true });
        this.props.onError?.(e);
      },
      className: cn('aspect-square size-full object-cover', this.props.className),
    });
  }
}

// ---------------------------------------------------------------------------
// AvatarFallback
// ---------------------------------------------------------------------------

interface AvatarFallbackProps {
  className?: string;
  children?: any;
}

export function AvatarFallback({ className, children }: AvatarFallbackProps) {
  return createElement('span', {
    'data-slot': 'avatar-fallback',
    className: cn(
      'bg-muted flex size-full items-center justify-center rounded-full text-xs font-medium',
      className,
    ),
  }, children);
}
