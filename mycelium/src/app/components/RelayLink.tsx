import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';

// ---------------------------------------------------------------------------
// RelayLink — clickable wss:// relay URL that navigates to relay detail page
// ---------------------------------------------------------------------------

interface RelayLinkProps {
  url: string;
  className?: string;
  children?: any;
}

export function RelayLink({ url, className, children }: RelayLinkProps) {
  const encoded = encodeURIComponent(url);
  return createElement(Link, {
    to: `/relay/${encoded}`,
    className: className || 'text-sm font-mono text-primary/80 hover:text-primary hover:underline truncate transition-colors',
  }, children || url);
}
