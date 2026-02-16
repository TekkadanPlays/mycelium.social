import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader, CodeBlock } from '../_helpers';

interface NipDef {
  num: string;
  old: string;
  title: string;
  deprecated?: boolean;
  kaji?: boolean | 'partial';
  ribbit?: boolean | 'partial';
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
      { num: '100', old: '01', title: 'Basic protocol flow description', kaji: true, ribbit: true },
      { num: '101', old: '10', title: 'Conventions for e and p tags in text events', kaji: true, ribbit: true },
      { num: '102', old: '19', title: 'bech32-encoded entities', kaji: true, ribbit: true },
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
      { num: '200', old: '02', title: 'Follow List', kaji: true, ribbit: true },
      { num: '201', old: '05', title: 'Mapping Nostr keys to DNS-based internet identifiers', ribbit: true },
      { num: '202', old: '06', title: 'Basic key derivation from mnemonic seed phrase' },
      { num: '203', old: '24', title: 'Extra metadata fields and tags', ribbit: true },
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
      { num: '301', old: '42', title: 'Authentication of clients to relays', kaji: 'partial', ribbit: true },
      { num: '302', old: '45', title: 'Event Counts' },
      { num: '303', old: '50', title: 'Search Capability' },
      { num: '304', old: '65', title: 'Relay List Metadata', kaji: true, ribbit: true },
      { num: '305', old: '48', title: 'Proxy Tags' },
    ],
  },
  {
    range: '4xx', title: 'Signing & Encryption',
    description: 'Key signing interfaces, remote signing, encryption schemes, and message wrapping.',
    nips: [
      { num: '400', old: '07', title: 'window.nostr capability for web browsers', kaji: true, ribbit: true },
      { num: '401', old: '26', title: 'Delegated Event Signing' },
      { num: '402', old: '44', title: 'Encrypted Payloads (Versioned)' },
      { num: '403', old: '46', title: 'Nostr Remote Signing' },
      { num: '404', old: '55', title: 'Android Signer Application', ribbit: true },
      { num: '405', old: '59', title: 'Gift Wrap' },
    ],
  },
  {
    range: '5xx', title: 'Social & Content',
    description: 'Notes, reactions, reposts, long-form content, labeling, moderation, and media references.',
    nips: [
      { num: '500', old: '09', title: 'Event Deletion Request', ribbit: true },
      { num: '501', old: '14', title: 'Subject tag in text events' },
      { num: '502', old: '18', title: 'Reposts', ribbit: true },
      { num: '503', old: '23', title: 'Long-form Content' },
      { num: '504', old: '25', title: 'Reactions', kaji: true, ribbit: true },
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
      { num: '602', old: '29', title: 'Relay-based Groups', kaji: true, ribbit: true },
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
        'Each NIP table below includes two columns showing implementation status across our projects. Ribbit covers both ribbit.network (web) and Ribbit Android.',
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
      createElement(CodeBlock, { code: '1xx \u2014 Core Protocol          (event structure, wire format, encoding)\n2xx \u2014 Identity & Keys        (profiles, follow lists, key management)\n3xx \u2014 Relay Infrastructure   (relay info, auth, search, relay lists)\n4xx \u2014 Signing & Encryption   (NIP-07, remote signing, gift wrap)\n5xx \u2014 Social & Content       (notes, reactions, reposts, long-form)\n6xx \u2014 Messaging & Groups     (DMs, public chat, relay-based groups)\n7xx \u2014 Payments & Zaps        (lightning, wallets, cashu)\n8xx \u2014 Media & Files          (video, file metadata, storage)\n9xx \u2014 Applications           (marketplace, git, calendar, wiki)' }),
    ),

    // Category sections
    ...CATEGORIES.map((cat) =>
      createElement('div', { key: cat.range, className: 'space-y-3' },
        createElement('div', { className: 'flex items-center gap-3' },
          createElement('h2', { className: 'text-lg font-bold tracking-tight' }, cat.range + ' \u2014 ' + cat.title),
          createElement(Badge, { variant: 'outline' }, cat.nips.length + ' NIPs'),
        ),
        createElement('p', { className: 'text-sm text-muted-foreground' }, cat.description),
        createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
          createElement('table', { className: 'w-full text-sm' },
            createElement('thead', null,
              createElement('tr', { className: 'border-b border-border bg-muted/30' },
                createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-16' }, 'New'),
                createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-16' }, 'Old'),
                createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Title'),
                createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-14' }, 'Kaji'),
                createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-14' }, 'Ribbit'),
              ),
            ),
            createElement('tbody', null,
              ...cat.nips.map((nip, i) =>
                createElement('tr', {
                  key: nip.num,
                  className: i < cat.nips.length - 1 ? 'border-b border-border/50' : '',
                },
                  createElement('td', { className: 'px-3 py-2 font-mono text-xs' }, nip.num),
                  createElement('td', { className: 'px-3 py-2 font-mono text-xs text-muted-foreground' }, nip.old),
                  createElement('td', { className: 'px-3 py-2' },
                    createElement('span', { className: nip.deprecated ? 'line-through text-muted-foreground' : '' }, nip.title),
                    nip.deprecated ? createElement('span', { className: 'ml-2 text-xs text-destructive' }, 'deprecated') : null,
                  ),
                  createElement('td', { className: 'px-3 py-2 text-center' },
                    nip.kaji === true ? '\u2705'
                      : nip.kaji === 'partial' ? '\u26A0\uFE0F'
                      : createElement('span', { className: 'text-muted-foreground/30' }, '\u2014'),
                  ),
                  createElement('td', { className: 'px-3 py-2 text-center' },
                    nip.ribbit === true ? '\u2705'
                      : nip.ribbit === 'partial' ? '\u26A0\uFE0F'
                      : createElement('span', { className: 'text-muted-foreground/30' }, '\u2014'),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),

    // Deprecated section
    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Deprecated / Merged'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'These NIPs have been absorbed into other NIPs and exist only as redirect stubs.',
      ),
      createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
        createElement('table', { className: 'w-full text-sm' },
          createElement('thead', null,
            createElement('tr', { className: 'border-b border-border bg-muted/30' },
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-16' }, 'Old'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-20' }, 'Status'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Redirect'),
            ),
          ),
          createElement('tbody', null,
            ...([
              { old: '08', status: 'deprecated', redirect: '\u2192 NIP-505 (Text Note References)' },
              { old: '12', status: 'merged', redirect: '\u2192 NIP-100 (Generic Tag Queries)' },
              { old: '16', status: 'merged', redirect: '\u2192 NIP-100 (Event Treatment)' },
              { old: '20', status: 'merged', redirect: '\u2192 NIP-100 (Command Results)' },
              { old: '33', status: 'merged', redirect: '\u2192 NIP-100 (Parameterized Replaceable Events)' },
            ]).map((row, i) =>
              createElement('tr', {
                key: row.old,
                className: i < 4 ? 'border-b border-border/50' : '',
              },
                createElement('td', { className: 'px-3 py-2 font-mono text-xs' }, row.old),
                createElement('td', { className: 'px-3 py-2' },
                  createElement(Badge, { variant: row.status === 'deprecated' ? 'destructive' : 'secondary' }, row.status),
                ),
                createElement('td', { className: 'px-3 py-2 text-muted-foreground' }, row.redirect),
              ),
            ),
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
