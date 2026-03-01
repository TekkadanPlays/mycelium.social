import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../ui/Tabs';
import { Card, CardContent } from '../../../ui/Card';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export class TabsPage extends Component<{}, { tab: string }> {
  declare state: { tab: string };
  constructor(props: {}) {
    super(props);
    this.state = { tab: 'preview' };
  }
  render() {
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Tabs',
        description: 'A set of layered sections of content, known as tab panels, displayed one at a time.',
      }),
      createElement(DemoBox, { className: 'block' },
        createElement(Tabs, null,
          createElement(TabsList, null,
            createElement(TabsTrigger, {
              value: 'preview',
              active: this.state.tab === 'preview',
              onClick: () => this.setState({ tab: 'preview' }),
            }, 'Preview'),
            createElement(TabsTrigger, {
              value: 'code',
              active: this.state.tab === 'code',
              onClick: () => this.setState({ tab: 'code' }),
            }, 'Code'),
            createElement(TabsTrigger, {
              value: 'settings',
              active: this.state.tab === 'settings',
              onClick: () => this.setState({ tab: 'settings' }),
            }, 'Settings'),
          ),
          createElement(TabsContent, { value: 'preview', active: this.state.tab === 'preview' },
            createElement(Card, null,
              createElement(CardContent, { className: 'pt-6' },
                createElement('p', { className: 'text-sm text-muted-foreground' }, 'This is the preview tab content.'),
              ),
            ),
          ),
          createElement(TabsContent, { value: 'code', active: this.state.tab === 'code' },
            createElement(Card, null,
              createElement(CardContent, { className: 'pt-6' },
                createElement('p', { className: 'text-sm font-mono text-muted-foreground' }, 'console.log("Hello from code tab")'),
              ),
            ),
          ),
          createElement(TabsContent, { value: 'settings', active: this.state.tab === 'settings' },
            createElement(Card, null,
              createElement(CardContent, { className: 'pt-6' },
                createElement('p', { className: 'text-sm text-muted-foreground' }, 'Settings panel content goes here.'),
              ),
            ),
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/Tabs'\n\ncreateElement(Tabs, null,\n  createElement(TabsList, null,\n    createElement(TabsTrigger, { value: 'a', active: tab === 'a', onClick: () => set('a') }, 'Tab A'),\n    createElement(TabsTrigger, { value: 'b', active: tab === 'b', onClick: () => set('b') }, 'Tab B'),\n  ),\n  createElement(TabsContent, { value: 'a', active: tab === 'a' }, 'Content A'),\n  createElement(TabsContent, { value: 'b', active: tab === 'b' }, 'Content B'),\n)" }),
    );
  }
}
