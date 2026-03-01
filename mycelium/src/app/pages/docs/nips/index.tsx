import { createElement } from 'inferno-create-element';
import { Badge } from '../../../ui/Badge';
import { PageHeader, SectionHeading } from '../_helpers';
import { Separator } from '../../../ui/Separator';

interface NipDef {
  num: string;
  old: string;
  title: string;
  deprecated?: boolean;
  unrecommended?: boolean;
  kaji?: boolean | 'partial';
  myceliumWeb?: boolean | 'partial';
  myceliumAndroid?: boolean | 'partial';
  cybin?: boolean | 'partial';
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
      { num: '100', old: '01', title: 'Basic protocol flow description', kaji: true, myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '101', old: '10', title: 'Text Notes and Threads', kaji: true, myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '102', old: '19', title: 'bech32-encoded entities', kaji: true, myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '103', old: '21', title: 'nostr: URI scheme', myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '104', old: '13', title: 'Proof of Work' },
      { num: '105', old: '31', title: 'Dealing with Unknown Events' },
      { num: '106', old: '40', title: 'Expiration Timestamp' },
      { num: '107', old: '70', title: 'Protected Events' },
      { num: '108', old: '03', title: 'OpenTimestamps Attestations for Events' },
      { num: '109', old: '22', title: 'Comment', myceliumAndroid: 'partial' },
    ],
  },
  {
    range: '2xx', title: 'Identity & Keys',
    description: 'User identity, profiles, key management, and social graph.',
    nips: [
      { num: '200', old: '02', title: 'Follow List', kaji: true, myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '201', old: '05', title: 'Mapping Nostr keys to DNS-based internet identifiers', myceliumWeb: true, myceliumAndroid: true },
      { num: '202', old: '06', title: 'Basic key derivation from mnemonic seed phrase' },
      { num: '203', old: '24', title: 'Extra metadata fields and tags', myceliumWeb: true, myceliumAndroid: true },
      { num: '204', old: '37', title: 'Draft Events' },
      { num: '205', old: '38', title: 'User Statuses' },
      { num: '206', old: '39', title: 'External Identities in Profiles' },
      { num: '207', old: '49', title: 'Private Key Encryption' },
      { num: '208', old: '51', title: 'Lists' },
      { num: '209', old: '58', title: 'Badges' },
    ],
  },
  {
    range: '3xx', title: 'Relay Infrastructure',
    description: 'Relay discovery, configuration, authentication, and capabilities.',
    nips: [
      { num: '300', old: '11', title: 'Relay Information Document', myceliumAndroid: true },
      { num: '301', old: '42', title: 'Authentication of clients to relays', kaji: 'partial', myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '302', old: '43', title: 'Relay Access Metadata and Requests' },
      { num: '303', old: '45', title: 'Counting results' },
      { num: '304', old: '48', title: 'Proxy Tags' },
      { num: '305', old: '50', title: 'Search Capability' },
      { num: '306', old: '65', title: 'Relay List Metadata', kaji: true, myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '307', old: '66', title: 'Relay Discovery and Liveness Monitoring', myceliumWeb: true, myceliumAndroid: true },
      { num: '308', old: '77', title: 'Negentropy Syncing' },
      { num: '309', old: '86', title: 'Relay Management API', myceliumAndroid: true },
    ],
  },
  {
    range: '4xx', title: 'Signing & Encryption',
    description: 'Key signing interfaces, remote signing, encryption schemes, and message wrapping.',
    nips: [
      { num: '400', old: '07', title: 'window.nostr capability for web browsers', kaji: true, myceliumWeb: true },
      { num: '401', old: '26', title: 'Delegated Event Signing', unrecommended: true },
      { num: '402', old: '44', title: 'Encrypted Payloads (Versioned)', cybin: true },
      { num: '403', old: '46', title: 'Nostr Remote Signing' },
      { num: '404', old: '55', title: 'Android Signer Application', myceliumAndroid: true, cybin: true },
      { num: '405', old: '59', title: 'Gift Wrap' },
    ],
  },
  {
    range: '5xx', title: 'Social & Content',
    description: 'Notes, reactions, reposts, long-form content, labeling, moderation, and media references.',
    nips: [
      { num: '500', old: '09', title: 'Event Deletion Request', myceliumWeb: true, myceliumAndroid: true },
      { num: '501', old: '14', title: 'Subject tag in text events' },
      { num: '502', old: '18', title: 'Reposts', myceliumWeb: true, myceliumAndroid: true },
      { num: '503', old: '23', title: 'Long-form Content' },
      { num: '504', old: '25', title: 'Reactions', kaji: true, myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '505', old: '27', title: 'Text Note References' },
      { num: '506', old: '30', title: 'Custom Emoji' },
      { num: '507', old: '32', title: 'Labeling' },
      { num: '508', old: '36', title: 'Sensitive Content' },
      { num: '509', old: '56', title: 'Reporting' },
      { num: '510', old: '62', title: 'Request to Vanish' },
      { num: '511', old: '7D', title: 'Threads' },
      { num: '512', old: '84', title: 'Highlights' },
      { num: '513', old: '85', title: 'Trusted Assertions' },
      { num: '514', old: '88', title: 'Polls' },
      { num: '515', old: '89', title: 'Recommended Application Handlers', myceliumAndroid: 'partial' },
      { num: '516', old: '92', title: 'Media Attachments' },
      { num: '517', old: '73', title: 'External Content IDs' },
    ],
  },
  {
    range: '6xx', title: 'Messaging & Groups',
    description: 'Direct messages, public chat, and relay-based group communication.',
    nips: [
      { num: '600', old: '17', title: 'Private Direct Messages' },
      { num: '601', old: '28', title: 'Public Chat' },
      { num: '602', old: '29', title: 'Relay-based Groups', kaji: true, myceliumWeb: true, myceliumAndroid: true },
      { num: '603', old: 'C7', title: 'Chats' },
      { num: '699', old: '04', title: 'Encrypted Direct Message', deprecated: true },
    ],
  },
  {
    range: '7xx', title: 'Payments & Zaps',
    description: 'Lightning payments, wallet integrations, Cashu, and payment goals.',
    nips: [
      { num: '700', old: '57', title: 'Lightning Zaps', myceliumWeb: true, myceliumAndroid: true, cybin: true },
      { num: '701', old: '47', title: 'Nostr Wallet Connect', myceliumAndroid: true, cybin: true },
      { num: '702', old: '60', title: 'Cashu Wallet' },
      { num: '703', old: '61', title: 'Nutzaps' },
      { num: '704', old: '75', title: 'Zap Goals' },
      { num: '705', old: '87', title: 'Ecash Mint Discoverability' },
    ],
  },
  {
    range: '8xx', title: 'Media & Files',
    description: 'Video, file metadata, file storage, and HTTP authentication for media.',
    nips: [
      { num: '800', old: '68', title: 'Picture-first feeds' },
      { num: '801', old: '71', title: 'Video Events' },
      { num: '802', old: '94', title: 'File Metadata' },
      { num: '803', old: '96', title: 'HTTP File Storage Integration', unrecommended: true },
      { num: '804', old: '98', title: 'HTTP Auth', myceliumAndroid: true },
      { num: '805', old: 'A0', title: 'Voice Messages' },
      { num: '806', old: 'B7', title: 'Blossom' },
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
      { num: '904', old: '53', title: 'Live Activities', myceliumAndroid: true },
      { num: '905', old: '54', title: 'Wiki' },
      { num: '906', old: '64', title: 'Chess (PGN)' },
      { num: '907', old: '69', title: 'Peer-to-peer Order events' },
      { num: '908', old: '72', title: 'Moderated Communities' },
      { num: '909', old: '78', title: 'Application-specific data' },
      { num: '910', old: '90', title: 'Data Vending Machines' },
      { num: '911', old: '99', title: 'Classified Listings' },
      { num: '912', old: 'A4', title: 'Public Messages' },
      { num: '913', old: 'B0', title: 'Web Bookmarks' },
      { num: '914', old: 'BE', title: 'Nostr BLE Communications Protocol' },
      { num: '915', old: 'C0', title: 'Code Snippets' },
    ],
  },
];

function statusIcon(val?: boolean | 'partial') {
  if (val === true) return '\u2705';
  if (val === 'partial') return '\u26A0\uFE0F';
  return '\u2014';
}

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
    createElement(SectionHeading, { id: 'what' }, 'What is this?'),
    createElement('p', { className: 'text-sm text-muted-foreground leading-relaxed' },
      'The upstream NIPs repository uses sequential numbering (NIP-01 through NIP-99+, now extending into hex like NIP-A0, NIP-B7, NIP-C7) which makes it hard to discover related specifications. This fork reorganizes the same content into categorical 100-number ranges while preserving all original event kinds, tags, and wire formats.',
    ),
    createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
      createElement('p', { className: 'text-sm font-medium mb-2' }, 'Key principle'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'No protocol changes. Event kinds, tags, and wire formats are unchanged. Only the NIP document numbering and organization has been restructured.',
      ),
    ),

    // Implementation Status legend
    createElement(SectionHeading, { id: 'status' }, 'Implementation Status'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'The feature matrix below tracks implementation status across four projects:',
    ),
    createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-2 my-3' },
      ...[
        { label: 'Kaji', desc: 'Kotlin Multiplatform Nostr protocol library' },
        { label: 'Cybin', desc: 'Kotlin Multiplatform Nostr protocol library (custom)' },
        { label: 'Mycelium Web', desc: 'mycelium.social web client' },
        { label: 'Mycelium Android', desc: 'Native Android client' },
      ].map((p) =>
        createElement('div', { key: p.label, className: 'rounded-md border border-border px-3 py-2' },
          createElement('p', { className: 'text-xs font-semibold' }, p.label),
          createElement('p', { className: 'text-[10px] text-muted-foreground' }, p.desc),
        ),
      ),
    ),
    createElement('div', { className: 'flex flex-wrap gap-4 text-sm' },
      createElement('span', null, '\u2705 Implemented'),
      createElement('span', null, '\u26A0\uFE0F Partial'),
      createElement('span', { className: 'text-muted-foreground' }, '\u2014 Not yet'),
    ),

    // Numbering scheme
    createElement(SectionHeading, { id: 'scheme' }, 'Numbering Scheme'),
    createElement('div', { className: 'rounded-lg border border-border p-4 bg-muted/30' },
      createElement('div', { className: 'space-y-1.5 text-sm font-mono' },
        ...([
          { range: '1xx', label: 'Core Protocol', note: 'event structure, wire format, encoding, threading' },
          { range: '2xx', label: 'Identity & Keys', note: 'profiles, follow lists, key management, badges' },
          { range: '3xx', label: 'Relay Infrastructure', note: 'relay info, auth, search, relay lists, discovery' },
          { range: '4xx', label: 'Signing & Encryption', note: 'NIP-07, remote signing, gift wrap, NIP-55' },
          { range: '5xx', label: 'Social & Content', note: 'notes, reactions, reposts, long-form, polls' },
          { range: '6xx', label: 'Messaging & Groups', note: 'DMs, public chat, relay-based groups, chats' },
          { range: '7xx', label: 'Payments & Zaps', note: 'lightning, wallets, cashu, ecash' },
          { range: '8xx', label: 'Media & Files', note: 'video, pictures, file metadata, blossom' },
          { range: '9xx', label: 'Applications', note: 'marketplace, git, calendar, wiki, BLE' },
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

    createElement(Separator, null),

    // Feature matrix — all categories inline
    createElement(SectionHeading, { id: 'matrix' }, 'Feature Matrix'),
    ...CATEGORIES.map((cat) =>
      createElement('div', { key: cat.range, className: 'space-y-2' },
        createElement('h3', { className: 'text-sm font-bold' }, cat.range + ' \u2014 ' + cat.title),
        createElement('p', { className: 'text-xs text-muted-foreground mb-2' }, cat.description),
        createElement('div', { className: 'rounded-lg border border-border overflow-x-auto' },
          createElement('table', { className: 'w-full text-sm' },
            createElement('thead', null,
              createElement('tr', { className: 'border-b border-border bg-muted/30' },
                createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-14' }, 'New'),
                createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-14' }, 'Old'),
                createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Title'),
                createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-12' }, 'Kaji'),
                createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-12' }, 'Cybin'),
                createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-12' }, 'Web'),
                createElement('th', { className: 'px-3 py-2 text-center font-medium text-muted-foreground w-14' }, 'Android'),
              ),
            ),
            createElement('tbody', null,
              ...cat.nips.map((nip) =>
                createElement('tr', {
                  key: nip.num,
                  className: 'border-b border-border/50 last:border-0' + (nip.deprecated ? ' opacity-50 line-through' : '') + (nip.unrecommended ? ' opacity-60' : ''),
                },
                  createElement('td', { className: 'px-3 py-1.5 font-mono text-xs text-primary' }, nip.num),
                  createElement('td', { className: 'px-3 py-1.5 font-mono text-xs text-muted-foreground' }, nip.old),
                  createElement('td', { className: 'px-3 py-1.5 text-xs' },
                    nip.title,
                    nip.deprecated ? createElement('span', { className: 'ml-1.5 text-[10px] text-destructive' }, '(deprecated)') : null,
                    nip.unrecommended ? createElement('span', { className: 'ml-1.5 text-[10px] text-muted-foreground' }, '(unrecommended)') : null,
                  ),
                  createElement('td', { className: 'px-3 py-1.5 text-center text-xs' }, statusIcon(nip.kaji)),
                  createElement('td', { className: 'px-3 py-1.5 text-center text-xs' }, statusIcon(nip.cybin)),
                  createElement('td', { className: 'px-3 py-1.5 text-center text-xs' }, statusIcon(nip.myceliumWeb)),
                  createElement('td', { className: 'px-3 py-1.5 text-center text-xs' }, statusIcon(nip.myceliumAndroid)),
                ),
              ),
            ),
          ),
        ),
      ),
    ),

    createElement(Separator, null),

    // Deprecated / Merged summary
    createElement(SectionHeading, { id: 'deprecated' }, 'Deprecated / Merged'),
    createElement('p', { className: 'text-sm text-muted-foreground' },
      'These NIPs have been absorbed into other NIPs or deprecated: ',
      ...['NIP-04', 'NIP-08', 'NIP-12', 'NIP-16', 'NIP-20', 'NIP-26', 'NIP-33', 'NIP-96', 'NIP-EE'].map((n, i, arr) =>
        createElement('span', { key: n, className: 'font-mono text-xs' },
          n + (i < arr.length - 1 ? ', ' : '.'),
        ),
      ),
    ),

    // Reference files
    createElement(SectionHeading, { id: 'reference' }, 'Reference Files'),
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
  );
}

// Export CATEGORIES for use by other pages if needed
export { CATEGORIES };
export type { NipDef, CategoryDef };
