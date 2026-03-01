import { createElement } from 'inferno-create-element';
import { PageHeader, CodeBlock, PropTable } from '../_helpers';

export function KajiNip29Page() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'nip29',
      description: 'NIP-29: Relay-based Groups. Metadata parsing, member lists, join/leave request builders, and group tag helpers.',
    }),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Types'),
      createElement(CodeBlock, { code: "interface GroupMetadata {\n  id: string        // group ID from d tag\n  name: string      // from 'name' tag\n  about: string     // from 'about' tag\n  picture: string   // from 'picture' tag\n  isOpen: boolean   // has 'open' tag\n  isPublic: boolean // has 'public' tag (default true)\n}\n\ninterface GroupMember {\n  pubkey: string    // member's pubkey\n  roles: string[]   // roles from p tag (tag[2], tag[3], ...)\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'parseGroupMetadata'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Parses a kind:39000 group metadata event into a GroupMetadata object.',
      ),
      createElement(CodeBlock, { code: "import { parseGroupMetadata } from 'kaji'\n\nconst meta = parseGroupMetadata(metadataEvent)\nconsole.log(meta.name, meta.about, meta.isOpen)" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'parseGroupMembers'),
      createElement('p', { className: 'text-sm text-muted-foreground' },
        'Parses a kind:39002 group members event into an array of GroupMember objects.',
      ),
      createElement(CodeBlock, { code: "import { parseGroupMembers } from 'kaji'\n\nconst members = parseGroupMembers(membersEvent)\nfor (const m of members) {\n  console.log(m.pubkey, m.roles)\n}" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Request Builders'),
      createElement(CodeBlock, { code: "import { buildJoinRequest, buildLeaveRequest, createEvent } from 'kaji'\n\n// Join request (kind 9021)\nconst join = buildJoinRequest('my-group', 'Please let me in!', 'invite-code')\nconst joinEvent = createEvent(join.kind, join.content, join.tags)\n\n// Leave request (kind 9022)\nconst leave = buildLeaveRequest('my-group', 'Goodbye!')\nconst leaveEvent = createEvent(leave.kind, leave.content, leave.tags)" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Helpers'),
      createElement(CodeBlock, { code: "import { groupTag, getEventGroupId } from 'kaji'\n\n// Build an h tag for group events\ngroupTag('my-group') // ['h', 'my-group']\n\n// Extract group ID from any event\nconst gid = getEventGroupId(event) // 'my-group' or null" }),
    ),

    createElement('div', { className: 'space-y-3' },
      createElement('h2', { className: 'text-lg font-bold tracking-tight' }, 'Group Event Kinds'),
      createElement('div', { className: 'rounded-lg border border-border overflow-hidden' },
        createElement('table', { className: 'w-full text-sm' },
          createElement('thead', null,
            createElement('tr', { className: 'border-b border-border bg-muted/30' },
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-16' }, 'Kind'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground' }, 'Description'),
              createElement('th', { className: 'px-3 py-2 text-left font-medium text-muted-foreground w-28' }, 'Constant'),
            ),
          ),
          createElement('tbody', null,
            ...([
              { kind: '9', desc: 'Group chat message', constant: '\u2014' },
              { kind: '11', desc: 'Group thread', constant: '\u2014' },
              { kind: '9000', desc: 'Put user in group', constant: 'GroupPutUser' },
              { kind: '9001', desc: 'Remove user from group', constant: 'GroupRemoveUser' },
              { kind: '9002', desc: 'Edit group metadata', constant: 'GroupEditMetadata' },
              { kind: '9005', desc: 'Delete group event', constant: 'GroupDeleteEvent' },
              { kind: '9007', desc: 'Create group', constant: 'GroupCreateGroup' },
              { kind: '9021', desc: 'Join request', constant: 'GroupJoinRequest' },
              { kind: '9022', desc: 'Leave request', constant: 'GroupLeaveRequest' },
              { kind: '39000', desc: 'Group metadata (addressable)', constant: 'GroupMetadata' },
              { kind: '39001', desc: 'Group admins (addressable)', constant: 'GroupAdmins' },
              { kind: '39002', desc: 'Group members (addressable)', constant: 'GroupMembers' },
              { kind: '39003', desc: 'Group roles (addressable)', constant: 'GroupRoles' },
            ]).map((row, i) =>
              createElement('tr', {
                key: row.kind,
                className: i < 12 ? 'border-b border-border/50' : '',
              },
                createElement('td', { className: 'px-3 py-2 font-mono text-xs' }, row.kind),
                createElement('td', { className: 'px-3 py-2' }, row.desc),
                createElement('td', { className: 'px-3 py-2 font-mono text-xs text-muted-foreground' }, row.constant),
              ),
            ),
          ),
        ),
      ),
    ),

    createElement(PropTable, { rows: [
      { prop: 'parseGroupMetadata(event)', type: 'GroupMetadata', default: 'Parse kind:39000' },
      { prop: 'parseGroupMembers(event)', type: 'GroupMember[]', default: 'Parse kind:39002' },
      { prop: 'buildJoinRequest(groupId, reason?, code?)', type: '{kind, content, tags}', default: 'Kind 9021' },
      { prop: 'buildLeaveRequest(groupId, reason?)', type: '{kind, content, tags}', default: 'Kind 9022' },
      { prop: 'groupTag(groupId)', type: 'NostrTag', default: "['h', groupId]" },
      { prop: 'getEventGroupId(event)', type: 'string | null', default: 'First h tag value' },
    ]}),
  );
}
