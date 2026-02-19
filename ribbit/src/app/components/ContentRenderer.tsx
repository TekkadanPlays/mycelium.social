import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { RelayLink } from './RelayLink';

// Image extensions to detect
const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(\?[^\s]*)?$/i;
// Video extensions
const VIDEO_EXTS = /\.(mp4|webm|mov|ogg)(\?[^\s]*)?$/i;
// URL regex (http/https + wss/ws)
const URL_RE = /(?:https?|wss?):\/\/[^\s<>"')\]]+/g;
// Hashtag regex (must be preceded by whitespace or start of string)
const HASHTAG_RE = /(?:^|\s)#(\w{1,64})/g;
// Nostr entity regex (npub, note, nprofile, nevent, naddr)
const NOSTR_RE = /nostr:(npub1[a-z0-9]{58}|note1[a-z0-9]{58}|nprofile1[a-z0-9]+|nevent1[a-z0-9]+|naddr1[a-z0-9]+)/g;

interface ContentRendererProps {
  content: string;
  className?: string;
}

interface ContentPart {
  type: 'text' | 'url' | 'image' | 'video' | 'hashtag' | 'nostr' | 'relay';
  value: string;
  display?: string;
}

function parseContent(content: string): ContentPart[] {
  // Collect all matches with positions
  const matches: { start: number; end: number; part: ContentPart }[] = [];

  // URLs
  let m: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(content)) !== null) {
    const url = m[0];
    let type: ContentPart['type'] = 'url';
    if (url.startsWith('wss://') || url.startsWith('ws://')) type = 'relay';
    else if (IMAGE_EXTS.test(url)) type = 'image';
    else if (VIDEO_EXTS.test(url)) type = 'video';
    matches.push({ start: m.index, end: m.index + url.length, part: { type, value: url } });
  }

  // Hashtags
  HASHTAG_RE.lastIndex = 0;
  while ((m = HASHTAG_RE.exec(content)) !== null) {
    const tag = m[1];
    const fullMatch = m[0];
    const offset = fullMatch.startsWith(' ') || fullMatch.startsWith('\n') ? 1 : 0;
    const start = m.index + offset;
    // Check this doesn't overlap with a URL
    const overlaps = matches.some((x) => start >= x.start && start < x.end);
    if (!overlaps) {
      matches.push({ start, end: start + 1 + tag.length, part: { type: 'hashtag', value: tag, display: `#${tag}` } });
    }
  }

  // Nostr entities
  NOSTR_RE.lastIndex = 0;
  while ((m = NOSTR_RE.exec(content)) !== null) {
    const entity = m[1];
    const overlaps = matches.some((x) => m!.index >= x.start && m!.index < x.end);
    if (!overlaps) {
      const short = entity.slice(0, 12) + '...' + entity.slice(-4);
      matches.push({ start: m.index, end: m.index + m[0].length, part: { type: 'nostr', value: entity, display: short } });
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start);

  // Build parts array
  const parts: ContentPart[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) {
      parts.push({ type: 'text', value: content.slice(cursor, match.start) });
    }
    parts.push(match.part);
    cursor = match.end;
  }
  if (cursor < content.length) {
    parts.push({ type: 'text', value: content.slice(cursor) });
  }

  return parts;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const parts = parseContent(content);

  // Separate inline parts from block-level media
  const inlineParts: ContentPart[] = [];
  const mediaParts: ContentPart[] = [];

  for (const part of parts) {
    if (part.type === 'image' || part.type === 'video') {
      mediaParts.push(part);
    } else {
      inlineParts.push(part);
    }
  }

  return createElement('div', { className: className || '' },
    // Text content with inline links
    inlineParts.length > 0
      ? createElement('p', {
          className: 'text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words',
        },
          ...inlineParts.map((part, i) => {
            switch (part.type) {
              case 'relay':
                return createElement(RelayLink, {
                  key: i,
                  url: part.value,
                  className: 'text-primary hover:underline break-all font-mono text-xs',
                });

              case 'url':
                return createElement('a', {
                  key: i,
                  href: part.value,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'text-primary hover:underline break-all',
                }, truncateUrl(part.value));

              case 'hashtag':
                return createElement(Link, {
                  key: i,
                  to: `/t/${part.value}`,
                  className: 'text-primary hover:underline',
                }, part.display);

              case 'nostr':
                if (part.value.startsWith('npub1')) {
                  return createElement(Link, {
                    key: i,
                    to: `/u/${part.value}`,
                    className: 'text-secondary hover:underline font-mono text-xs',
                  }, part.display);
                }
                if (part.value.startsWith('note1')) {
                  return createElement(Link, {
                    key: i,
                    to: `/post/${part.value}`,
                    className: 'text-secondary hover:underline font-mono text-xs',
                  }, part.display);
                }
                return createElement('span', {
                  key: i,
                  className: 'text-secondary font-mono text-xs',
                }, part.display);

              default:
                return part.value;
            }
          }),
        )
      : null,

    // Media (images/videos) rendered as blocks below text
    mediaParts.length > 0
      ? createElement('div', { className: 'mt-3 space-y-2' },
          ...mediaParts.map((part, i) => {
            if (part.type === 'image') {
              return createElement('a', {
                key: `media-${i}`,
                href: part.value,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'block',
              },
                createElement('img', {
                  src: part.value,
                  alt: '',
                  className: 'rounded-lg max-h-96 max-w-full object-contain border border-border',
                  loading: 'lazy',
                }),
              );
            }
            if (part.type === 'video') {
              return createElement('video', {
                key: `media-${i}`,
                src: part.value,
                controls: true,
                preload: 'metadata',
                className: 'rounded-lg max-h-96 max-w-full border border-border',
              });
            }
            return null;
          }),
        )
      : null,
  );
}

function truncateUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + '...' : u.pathname;
    return u.hostname + (path === '/' ? '' : path);
  } catch {
    return url.length > 50 ? url.slice(0, 50) + '...' : url;
  }
}
