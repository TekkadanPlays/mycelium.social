import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { PageHeader, SectionHeading, DemoBox, CodeBlock, PropTable } from '../_helpers';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../../ui/HoverCard';
import { Avatar, AvatarImage, AvatarFallback } from '../../../ui/Avatar';

interface HoverCardPageState {
  open: boolean;
}

export class HoverCardPage extends Component<{}, HoverCardPageState> {
  declare state: HoverCardPageState;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: {}) {
    super(props);
    this.state = { open: false };
  }

  componentWillUnmount() {
    if (this.openTimer) clearTimeout(this.openTimer);
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  private handleEnter = () => {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.openTimer = setTimeout(() => this.setState({ open: true }), 200);
  };

  private handleLeave = () => {
    if (this.openTimer) { clearTimeout(this.openTimer); this.openTimer = null; }
    this.closeTimer = setTimeout(() => this.setState({ open: false }), 300);
  };

  render() {
    const { open } = this.state;

    return createElement('div', { className: 'space-y-10' },
      createElement(PageHeader, {
        title: 'Hover Card',
        description: 'Displays rich content in a card that appears on hover. Useful for user profile previews, link previews, and contextual information.',
      }),

      // Demo
      createElement(SectionHeading, { id: 'demo' }, 'Demo'),
      createElement(DemoBox, null,
        createElement(HoverCard, {
          onMouseEnter: this.handleEnter,
          onMouseLeave: this.handleLeave,
        },
          createElement(HoverCardTrigger, null,
            createElement('a', {
              href: '#',
              className: 'text-sm font-medium text-primary underline underline-offset-4',
            }, '@tinkerbell'),
          ),
          createElement(HoverCardContent, { open, align: 'start' },
            createElement('div', { className: 'flex justify-between space-x-4' },
              createElement(Avatar, null,
                createElement(AvatarImage, { src: '/tink.gif', alt: 'Tink' }),
                createElement(AvatarFallback, null, 'TK'),
              ),
              createElement('div', { className: 'space-y-1' },
                createElement('h4', { className: 'text-sm font-semibold' }, '@tinkerbell'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                  'Pixie dust engineer. Sprinkling magic across the Nostr protocol.',
                ),
                createElement('div', { className: 'flex items-center pt-2' },
                  createElement('span', { className: 'text-xs text-muted-foreground' }, 'Joined December 2021'),
                ),
              ),
            ),
          ),
        ),
      ),

      // Usage
      createElement(SectionHeading, { id: 'usage' }, 'Usage'),
      createElement(CodeBlock, { code: `import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/HoverCard'

// Manage hover state with timers for open/close delay
<HoverCard onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
  <HoverCardTrigger>
    <a href="#">@username</a>
  </HoverCardTrigger>
  <HoverCardContent open={open} align="start">
    <p>Rich preview content</p>
  </HoverCardContent>
</HoverCard>` }),

      // Stateful wrapper
      createElement(SectionHeading, { id: 'wrapper' }, 'HoverCardWrapper'),
      createElement('p', { className: 'text-sm text-muted-foreground mb-3' },
        'For convenience, a HoverCardWrapper component is also exported that manages the hover state internally with configurable open/close delays:',
      ),
      createElement(CodeBlock, { code: `import { HoverCardWrapper } from './ui/HoverCard'

<HoverCardWrapper
  openDelay={200}
  closeDelay={300}
  align="start"
  trigger={<a href="#">@username</a>}
>
  <p>Card content shown on hover</p>
</HoverCardWrapper>` }),

      // Props
      createElement(SectionHeading, { id: 'props' }, 'Props'),
      createElement('h3', { className: 'text-sm font-semibold mb-2' }, 'HoverCardContent'),
      createElement(PropTable, {
        rows: [
          { prop: 'open', type: 'boolean', default: 'false' },
          { prop: 'align', type: "'start' | 'center' | 'end'", default: "'center'" },
          { prop: 'side', type: "'top' | 'bottom'", default: "'bottom'" },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
      createElement('h3', { className: 'text-sm font-semibold mb-2 mt-4' }, 'HoverCardWrapper'),
      createElement(PropTable, {
        rows: [
          { prop: 'openDelay', type: 'number (ms)', default: '200' },
          { prop: 'closeDelay', type: 'number (ms)', default: '300' },
          { prop: 'align', type: "'start' | 'center' | 'end'", default: "'center'" },
          { prop: 'side', type: "'top' | 'bottom'", default: "'bottom'" },
          { prop: 'trigger', type: 'any (ReactNode)', default: '\u2014' },
          { prop: 'className', type: 'string', default: '\u2014' },
        ],
      }),
    );
  }
}
