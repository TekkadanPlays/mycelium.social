import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../../ui/Resizable';

export function ResizablePage() {
  return createElement('div', { className: 'space-y-10' },
    createElement(PageHeader, {
      title: 'Resizable',
      description: 'Accessible resizable panel groups and layouts with keyboard and drag support.',
    }),

    // Demo — horizontal
    createElement(SectionHeading, { id: 'demo' }, 'Demo'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-md mx-auto rounded-lg border overflow-hidden' },
        createElement(ResizablePanelGroup, { direction: 'horizontal', className: 'min-h-[200px]' },
          createElement(ResizablePanel, { defaultSize: 50 },
            createElement('div', { className: 'flex h-full items-center justify-center p-6' },
              createElement('span', { className: 'font-semibold' }, 'One'),
            ),
          ),
          createElement(ResizablePanel, { defaultSize: 50 },
            createElement('div', { className: 'flex h-full items-center justify-center p-6' },
              createElement('span', { className: 'font-semibold' }, 'Two'),
            ),
          ),
        ),
      ),
    ),

    // Three panels
    createElement(SectionHeading, { id: 'three-panels' }, 'Three Panels'),
    createElement(DemoBox, { className: 'block p-8' },
      createElement('div', { className: 'max-w-lg mx-auto rounded-lg border overflow-hidden' },
        createElement(ResizablePanelGroup, { direction: 'horizontal', className: 'min-h-[200px]' },
          createElement(ResizablePanel, { defaultSize: 30 },
            createElement('div', { className: 'flex h-full items-center justify-center p-6 text-sm' },
              createElement('span', { className: 'font-semibold' }, 'Sidebar'),
            ),
          ),
          createElement(ResizablePanel, { defaultSize: 40 },
            createElement('div', { className: 'flex h-full items-center justify-center p-6 text-sm' },
              createElement('span', { className: 'font-semibold' }, 'Content'),
            ),
          ),
          createElement(ResizablePanel, { defaultSize: 30 },
            createElement('div', { className: 'flex h-full items-center justify-center p-6 text-sm' },
              createElement('span', { className: 'font-semibold' }, 'Details'),
            ),
          ),
        ),
      ),
    ),

    // Usage
    createElement(SectionHeading, { id: 'usage' }, 'Usage'),
    createElement(CodeBlock, { code: `import { ResizablePanelGroup, ResizablePanel } from '@/ui/Resizable'

createElement(ResizablePanelGroup, { direction: 'horizontal' },
  createElement(ResizablePanel, { defaultSize: 50 },
    createElement('div', null, 'Left'),
  ),
  createElement(ResizablePanel, { defaultSize: 50 },
    createElement('div', null, 'Right'),
  ),
)` }),

    // Props
    createElement(SectionHeading, { id: 'props' }, 'Props'),
    createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'ResizablePanelGroup'),
    createElement(PropTable, {
      rows: [
        { prop: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
        { prop: 'className', type: 'string', default: '\u2014' },
      ],
    }),
    createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'ResizablePanel'),
    createElement(PropTable, {
      rows: [
        { prop: 'defaultSize', type: 'number (%)', default: 'auto (equal split)' },
        { prop: 'className', type: 'string', default: '\u2014' },
      ],
    }),
  );
}
