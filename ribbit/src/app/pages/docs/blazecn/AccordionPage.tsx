import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../ui/Accordion';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export class AccordionPage extends Component<{}, { open: string }> {
  declare state: { open: string };
  constructor(props: {}) {
    super(props);
    this.state = { open: '' };
  }
  render() {
    const items = [
      { value: 'item-1', title: 'Is it accessible?', content: 'Yes. It follows WAI-ARIA design patterns with proper aria-expanded attributes.' },
      { value: 'item-2', title: 'Is it styled?', content: 'Yes. It comes with default styles that match the other Blazecn components.' },
      { value: 'item-3', title: 'Is it animated?', content: 'Uses CSS grid-rows animation for smooth expand and collapse with opacity transitions.' },
    ];
    return createElement('div', { className: 'space-y-8' },
      createElement(PageHeader, {
        title: 'Accordion',
        description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
      }),
      createElement(DemoBox, { className: 'block h-[340px] overflow-hidden' },
        createElement('div', { className: 'max-w-lg mx-auto px-6 py-12' },
          createElement(Accordion, null,
            ...items.map((item) =>
              createElement(AccordionItem, { key: item.value, value: item.value },
                createElement(AccordionTrigger, {
                  open: this.state.open === item.value,
                  onClick: () => this.setState({ open: this.state.open === item.value ? '' : item.value }),
                }, item.title),
                createElement(AccordionContent, { open: this.state.open === item.value }, item.content),
              ),
            ),
          ),
        ),
      ),
      createElement(CodeBlock, { code: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/ui/Accordion'\n\ncreateElement(Accordion, null,\n  createElement(AccordionItem, { value: 'a' },\n    createElement(AccordionTrigger, { open: val === 'a', onClick: toggle }, 'Title'),\n    createElement(AccordionContent, { open: val === 'a' }, 'Content'),\n  ),\n)" }),
    );
  }
}
