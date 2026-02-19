import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader } from '../_helpers';
import { Link } from 'inferno-router';

interface NipDef {
  num: string;
  old: string;
  title: string;
  deprecated?: boolean;
  kaji?: boolean | 'partial';
  mycelium?: boolean | 'partial';
}

interface CategoryDef {
  range: string;
  title: string;
  description: string;
  nips: NipDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    range: '1xx', title: 'Core Protocol',
    description: 'Foundational protocol mechanics: event structure, wire format, encoding, threading, and base behaviors.',
    nips: [
      { num: '100', old: '01', title: 'Basic protocol flow description', kaji: true, mycelium: true },
      { num: '101', old: '10', title: 'Conventions for e and p tags in text events', kaji: true, mycelium: true },
      { num: '102', old: '19', title: 'bech32-encoded entities', kaji: true, mycelium: true },
      { num: '103', old: '21', title: 'nostr: URI scheme' },
      { num: '104', old: '13', title: 'Proof of Work' },
      { num: '105', old: '31', title: 'Dealing with unknown event kinds' },
      { num: '106', old: '40', title: 'Expiration Timestamp' },
      { num: '107', old: '70', title: 'Protected Events' },
      { num: '108', old: '03', title: 'OpenTimestamps Attestations for Events' },
    ],
  },
  {
    range: '2xx', title: 'Identity & Keys',
    description: 'User identity, profiles, key management, and social graph.',
    nips: [
      { num: '200', old: '02', title: 'Follow List', kaji: true, mycelium: true },
      { num: '201', old: '05', title: 'Mapping Nostr keys to DNS-based internet identifiers', mycelium: true },
      { num: '202', old: '06', title: 'Basic key derivation from mnemonic seed phrase' },
      { num: '203', old: '24', title: 'Extra metadata fields and tags', mycelium: true },
      { num: '204', old: '38', title: 'User Statuses' },
      { num: '205', old: '39', title: 'External Identities in Profiles' },
      { num: '206', old: '49', title: 'Private Key Encryption' },
      { num: '207', old: '51', title: 'Lists' },
      { num: '208', old: '58', title: 'Badges' },
    ],
  },
  {
    range: '3xx', title: 'Relay Infrastructure',
    description: 'Relay discovery, configuration, authentication, and capabilities.',
    nips: [
      { num: '300', old: '11', title: 'Relay Information Document' },
      { num: '301', old: '42', title: 'Authentication of clients to relays', kaji: 'partial', mycelium: true },
      { num: '302', old: '45', title: 'Event Counts' },
      { num: '303', old: '50', title: 'Search Capability' },
      { num: '304', old: '65', title: 'Relay List Metadata', kaji: true, mycelium: true },
      { num: '305', old: '48', title: 'Proxy Tags' },
    ],
  },
  {
    range: '4xx', title: 'Signing & Encryption',
    description: 'Key signing interfaces, remote signing, encryption schemes, and message wrapping.',
    nips: [
      { num: '400', old: '07', title: 'window.nostr capability for web browsers', kaji: true, mycelium: true },
      { num: '401', old: '26', title: 'Delegated Event Signing' },
      { num: '402', old: '44', title: 'Encrypted Payloads (Versioned)' },
      { num: '403', old: '46', title: 'Nostr Remote Signing' },
      { num: '404', old: '55', title: 'Android Signer Application', mycelium: true },
      { num: '405', old: '59', title: 'Gift Wrap' },
    ],
  },
  {
    range: '5xx', title: 'Social & Content',
    description: 'Notes, reactions, reposts, long-form content, labeling, moderation, and media references.',
    nips: [
      { num: '500', old: '09', title: 'Event Deletion Request', mycelium: true },
      { num: '501', old: '14', title: 'Subject tag in text events' },
      { num: '502', old: '18', title: 'Reposts', mycelium: true },
      { num: '503', old: '23', title: 'Long-form Content' },
      { num: '504', old: '25', title: 'Reactions', kaji: true, mycelium: true },
      { num: '505', old: '27', title: 'Text Note References' },
      { num: '506', old: '30', title: 'Custom Emoji' },
      { num: '507', old: '32', title: 'Labeling' },
      { num: '508', old: '36', title: 'Sensitive Content / Content Warning' },
      { num: '509', old: '56', title: 'Reporting' },
      { num: '510', old: '84', title: 'Highlights' },
      { num: '511', old: '92', title: 'Media Attachments' },
      { num: '512', old: '73', title: 'External Content IDs' },
    ],
  },
  {
    range: '6xx', title: 'Messaging & Groups',
    description: 'Direct messages, public chat, and relay-based group communication.',
    nips: [
      { num: '600', old: '17', title: 'Private Direct Messages' },
      { num: '601', old: '28', title: 'Public Chat' },
      { num: '602', old: '29', title: 'Relay-based Groups', kaji: true, mycelium: true },
      { num: '699', old: '04', title: 'Encrypted Direct Message', deprecated: true },
    ],
  },
  {
    range: '7xx', title: 'Payments & Zaps',
    description: 'Lightning payments, wallet integrations, Cashu, and payment goals.',
    nips: [
      { num: '700', old: '57', title: 'Lightning Zaps' },
      { num: '701', old: '47', title: 'Nostr Wallet Connect' },
      { num: '702', old: '60', title: 'Cashu Wallet' },
      { num: '703', old: '61', title: 'Nut Zaps' },
      { num: '704', old: '75', title: 'Zap Goals' },
    ],
  },
  {
    range: '8xx', title: 'Media & Files',
    description: 'Video, file metadata, file storage, and HTTP authentication for media.',
    nips: [
      { num: '800', old: '71', title: 'Video Events' },
      { num: '801', old: '94', title: 'File Metadata' },
      { num: '802', old: '96', title: 'HTTP File Storage Integration' },
      { num: '803', old: '98', title: 'HTTP Auth' },
    ],
  },
  {
    range: '9xx', title: 'Applications & Specialized',
    description: 'Marketplaces, developer tools, calendars, communities, and domain-specific applications.',
    nips: [
      { num: '900', old: '15', title: 'Nostr Marketplace' },
      { num: '901', old: '34', title: 'git stuff' },
      { num: '902', old: '35', title: 'Torrents' },
      { num: '903', old: '52', title: 'Calendar Events' },
      { num: '904', old: '53', title: 'Live Activities' },
      { num: '905', old: '54', title: 'Wiki' },
      { num: '906', old: '64', title: 'Chess (PGN)' },
      { num: '907', old: '72', title: 'Moderated Communities' },
      { num: '908', old: '78', title: 'Arbitrary custom app data' },
      { num: '909', old: '82', title: 'Medical Data' },
      { num: '910', old: '89', title: 'Recommended Application Handlers' },
      { num: '911', old: '90', title: 'Data Vending Machine' },
      { num: '912', old: '99', title: 'Classified Listings' },
    ],
  },
];

export function NipsIntro() {
  const totalNips = CATEGORIES.reduce((sum, cat) => sum + cat.nips.length, 0);

  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'NIPs',
      description: 'Categorical reorganization of the Nostr Implementation Possibilities specification.',
    }),
    createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
      createElement(Badge, null, 'Nostr'),
      createElement(Badge, { variant: 'secondary' }, 'Protocol'),
      createElement(Badge, { variant: 'secondary' }, totalNips + ' NIPs'),
      createElement(Badge, { variant: 'secondary' }, '9 Categories'),
      createElement(Badge, { variant: 'outline' }, 'Fork'),
    ),
    // What is this?
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'What is this?'),
      createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
        'The upstream NIPs repository uses sequential numbering (NIP-01 through NIP-99+) which makes it hard to discover related specifications. This fork reorganizes the same content into categorical 100-number ranges while preserving all original event kinds, tags, and wire formats.',
      ),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('p', { className: 'text-sm font-medium mb-2' }, 'Key principle'),
        createElement('p', { className: 'text-sm text-muted-foreground' },
          'No protocol changes. Event kinds, tags, and wire formats are unchanged. Only the NIP document numbering and organization has been restructured.',
        ),
      ),
    ),

    // Support legend
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Implementation Status'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Each NIP table below includes two columns showing implementation status across our projects. Mycelium covers both mycelium.social (web) and Mycelium for Android.',
      ),
      createElement('div', { className: 'flex flex-wrap gap-4 text-sm' },
        createElement('span', null, '\u2705 Implemented'),
        createElement('span', null, '\u26A0\uFE0F Partial'),
        createElement('span', { className: 'text-muted-foreground' }, '\u2014 Not yet'),
      ),
    ),

    // Numbering scheme
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Numbering Scheme'),
      createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
        createElement('div', { className: 'space-y-1.5 text-sm font-mono' },
          ...([
            { range: '1xx', label: 'Core Protocol', note: 'event structure, wire format, encoding' },
            { range: '2xx', label: 'Identity & Keys', note: 'profiles, follow lists, key management' },
            { range: '3xx', label: 'Relay Infrastructure', note: 'relay info, auth, search, relay lists' },
            { range: '4xx', label: 'Signing & Encryption', note: 'NIP-07, remote signing, gift wrap' },
            { range: '5xx', label: 'Social & Content', note: 'notes, reactions, reposts, long-form' },
            { range: '6xx', label: 'Messaging & Groups', note: 'DMs, public chat, relay-based groups' },
            { range: '7xx', label: 'Payments & Zaps', note: 'lightning, wallets, cashu' },
            { range: '8xx', label: 'Media & Files', note: 'video, file metadata, storage' },
            { range: '9xx', label: 'Applications', note: 'marketplace, git, calendar, wiki' },
          ]).map((row) =>
            createElement('div', { key: row.range, className: 'flex items-baseline gap-2' },
              createElement('span', { className: 'text-primary font-semibold w-8 shrink-0' }, row.range),
              createElement('span', { className: 'text-muted-foreground' }, '\u2014'),
              createElement('span', { className: 'font-medium text-foreground' }, row.label),
              createElement('span', { className: 'text-muted-foreground text-xs' }, '(' + row.note + ')'),
            ),
          ),
        ),
      ),
    ),

    // Categories — link cards
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Categories'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' },
        ...CATEGORIES.map((cat) => {
          const implemented = cat.nips.filter((n) => n.kaji === true || n.mycelium === true).length;
          const slug = cat.range.replace('xx', '');
          return createElement(Link, {
            key: cat.range,
            to: '/docs/nips/' + slug + 'xx',
            className: 'group rounded-lg border border-border p-4 hover:border-primary/30 hover:bg-accent/30 transition-all block',
          },
            createElement('div', { className: 'flex items-center justify-between mb-1' },
              createElement('span', { className: 'text-sm font-bold group-hover:text-primary transition-colors' },
                cat.range + ' \u2014 ' + cat.title,
              ),
              createElement(Badge, { variant: 'outline', className: 'text-[10px]' }, cat.nips.length + ' NIPs'),
            ),
            createElement('p', { className: 'text-xs text-muted-foreground mb-2' }, cat.description),
            implemented > 0
              ? createElement('p', { className: 'text-[10px] text-primary/70' },
                  implemented + ' of ' + cat.nips.length + ' implemented',
                )
              : null,
          );
        }),
      ),
    ),

    // Deprecated / Merged summary
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Deprecated / Merged'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'These NIPs have been absorbed into other NIPs and exist only as redirect stubs: ',
        ...['NIP-08', 'NIP-12', 'NIP-16', 'NIP-20', 'NIP-33'].map((n, i, arr) =>
          createElement('span', { key: n, className: 'font-mono text-xs' },
            n + (i < arr.length - 1 ? ', ' : '.'),
          ),
        ),
      ),
    ),

    // Reference files
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Reference Files'),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-3' },
        ...[
          { file: 'CATEGORIES.md', desc: 'Full category map with old\u2192new number lookup tables.' },
          { file: 'LEGACY-MAP.md', desc: 'Quick reference for finding where old NIP numbers moved.' },
          { file: 'BREAKING.md', desc: 'List of breaking changes across NIP revisions.' },
        ].map((item) =>
          createElement('div', { key: item.file, className: 'rounded-lg border border-border p-4' },
            createElement('p', { className: 'text-sm font-mono font-semibold mb-1' }, item.file),
            createElement('p', { className: 'text-xs text-muted-foreground' }, item.desc),
          ),
        ),
      ),
    ),
  );
}

// Export CATEGORIES for use by category sub-pages
export { CATEGORIES };
export type { NipDef, CategoryDef };
