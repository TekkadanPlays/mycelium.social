import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuShortcut,
} from '../../../ui/ContextMenu';

export function ContextMenuPage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Context Menu',
      description: 'Displays a menu at the pointer position on right-click.',
    }),

    // Demo
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, null,
      createElement(ContextMenu, null,
        createElement(ContextMenuTrigger, {
          className: 'flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground',
        }, 'Right click here'),
        createElement(ContextMenuContent, null,
          createElement(ContextMenuLabel, null, 'Actions'),
          createElement(ContextMenuSeparator, null),
          createElement(ContextMenuItem, null,
            'Back',
            createElement(ContextMenuShortcut, null, '\u2318['),
          ),
          createElement(ContextMenuItem, null,
            'Forward',
            createElement(ContextMenuShortcut, null, '\u2318]'),
          ),
          createElement(ContextMenuItem, null,
            'Reload',
            createElement(ContextMenuShortcut, null, '\u2318R'),
          ),
          createElement(ContextMenuSeparator, null),
          createElement(ContextMenuItem, null, 'View Source'),
          createElement(ContextMenuItem, null, 'Inspect'),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuSeparator,
} from '@/ui/ContextMenu'

createElement(ContextMenu, null,
  createElement(ContextMenuTrigger, null, 'Right click here'),
  createElement(ContextMenuContent, null,
    createElement(ContextMenuItem, null, 'Back'),
    createElement(ContextMenuItem, null, 'Forward'),
    createElement(ContextMenuSeparator, null),
    createElement(ContextMenuItem, null, 'Inspect'),
  ),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'ContextMenuItem'),
    createElement(PropTable, {
      rows: [
        { prop: 'disabled', type: 'boolean', default: 'false' },
        { prop: 'onClick', type: '(e: Event) => void', default: '\u2014' },
      ],
    }),
  );
}
