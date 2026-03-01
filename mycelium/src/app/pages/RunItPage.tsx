import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Button } from '../ui/Button';
import { initNostr } from '../modules/marketplace/nostr';
import { MarketplacePage } from '../modules/marketplace/MarketplacePage';

// ── Tab definitions ──

const RUN_IT_TABS = [
    { value: 'marketplace', label: 'Marketplace' },
];

// ── Main page — BlocksShowcase-style layout ──

interface RunItState { active: string; initialized: boolean; }

export class RunItPage extends Component<{}, RunItState> {
    declare state: RunItState;
    constructor(props: {}) {
        super(props);
        this.state = { active: 'marketplace', initialized: false };
    }

    componentDidMount() {
        initNostr();
        this.setState({ initialized: true });
    }

    render() {
        const { active, initialized } = this.state;

        return createElement('div', { className: 'flex flex-1 flex-col min-h-screen' },
            // ── Hero ──
            createElement('div', { className: 'border-b border-border/40' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6 py-12 md:py-20 lg:py-24' },
                    createElement('div', { className: 'mx-auto max-w-4xl space-y-6' },
                        // Announcement pill
                        createElement('div', { className: 'flex justify-center' },
                            createElement(Link, { to: '/docs/blazecn', className: 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors' },
                                createElement('span', { className: 'size-1.5 rounded-full bg-primary animate-pulse' }),
                                'Built with blazecn + Kaji',
                                createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-3' },
                                    createElement('path', { d: 'M5 12h14' }),
                                    createElement('path', { d: 'M12 5l7 7-7 7' }),
                                ),
                            ),
                        ),
                        // Heading
                        createElement('h1', { className: 'text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl' },
                            'Run It',
                        ),
                        // Description
                        createElement('p', { className: 'mx-auto max-w-2xl text-center text-lg text-muted-foreground' },
                            'Live application modules built with blazecn, Kaji, and InfernoJS. ',
                            'Clone them, customize them, ship them.',
                        ),
                        // CTA buttons
                        createElement('div', { className: 'flex items-center justify-center gap-3' },
                            createElement(Link, { to: '/docs/blazecn' },
                                createElement(Button, { size: 'sm', className: 'h-8 rounded-lg' }, 'Read the Docs'),
                            ),
                            createElement(Link, { to: '/examples' },
                                createElement(Button, { variant: 'ghost', size: 'sm', className: 'h-8 rounded-lg' }, 'View Examples'),
                            ),
                        ),
                    ),
                ),
            ),

            // ── Sticky tab bar ──
            createElement('div', { className: 'sticky top-14 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6' },
                    createElement('div', { className: 'flex items-center gap-4 overflow-x-auto -mb-px' },
                        ...RUN_IT_TABS.map((t) =>
                            createElement('button', {
                                key: t.value,
                                type: 'button',
                                onClick: () => this.setState({ active: t.value }),
                                className: [
                                    'whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors cursor-pointer',
                                    active === t.value
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                                ].join(' '),
                            }, t.label),
                        ),
                    ),
                ),
            ),

            // ── Tab content ──
            createElement('div', { className: 'flex-1 bg-muted/30' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6 py-6' },
                    active === 'marketplace' && initialized
                        ? createElement(MarketplacePage, null)
                        : null,
                ),
            ),
        );
    }
}
