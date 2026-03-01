import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { PageHeader, SectionHeading, CodeBlock } from '../_helpers';

// ---------------------------------------------------------------------------
// Block catalog entry — description + link to full-width /blocks showcase
// ---------------------------------------------------------------------------

function BlockEntry({ title, description, category }: { title: string; description: string; category: string }) {
    return createElement('div', { className: 'flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/30' },
        createElement('div', { className: 'flex-1 min-w-0' },
            createElement('div', { className: 'flex items-center gap-2 mb-1' },
                createElement('h3', { className: 'text-sm font-semibold' }, title),
                createElement(Badge, { variant: 'outline', className: 'text-[10px]' }, category),
            ),
            createElement('p', { className: 'text-sm text-muted-foreground' }, description),
        ),
    );
}

// ---------------------------------------------------------------------------
// BlocksPage — catalog view (docs sidebar-friendly)
// ---------------------------------------------------------------------------

export function BlocksPage() {
    const blocks = [
        { title: 'dashboard-01', category: 'Dashboard', description: 'Full dashboard layout with sidebar navigation, stat cards, interactive Chart.js area chart, and sortable data table.' },
        { title: 'login-01', category: 'Login', description: 'Classic centered card with social login providers, email/password, and a forgot password link.' },
        { title: 'login-02', category: 'Login', description: 'Split-screen layout with the form on the left and a decorative panel on the right.' },
        { title: 'login-03', category: 'Login', description: 'Card form on a muted background with Apple, Google, and GitHub social providers.' },
        { title: 'login-04', category: 'Login', description: 'Split-screen with a card-wrapped login form on the left and decorative panel on the right.' },
        { title: 'login-05', category: 'Login', description: 'Minimal login form with logo, icon-only social providers, and no card wrapper.' },
        { title: 'signup-01', category: 'Signup', description: 'Classic centered card with first/last name, email, password, and a GitHub social button.' },
    ];

    return createElement('div', { className: 'space-y-12' },
        createElement(PageHeader, {
            title: 'Blocks',
            description: 'Pre-built page layouts composed from blazecn components. Copy and paste into your apps.',
        }),

        // CTA to full-width showcase
        createElement('div', { className: 'flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4' },
            createElement('div', { className: 'flex-1' },
                createElement('p', { className: 'text-sm font-medium' }, 'Blocks are best viewed full-width.'),
                createElement('p', { className: 'text-xs text-muted-foreground mt-0.5' }, 'The showcase page renders each block at its intended size with no sidebar constraints.'),
            ),
            createElement(Link, { to: '/blocks' },
                createElement(Button, { size: 'sm' }, 'Open Showcase \u2192'),
            ),
        ),

        // Block catalog
        createElement(SectionHeading, { id: 'catalog' }, 'All Blocks'),

        createElement('div', { className: 'space-y-2' },
            ...blocks.map((b) =>
                createElement(BlockEntry, { key: b.title, ...b }),
            ),
        ),

        // Usage code
        createElement(SectionHeading, { id: 'usage' }, 'Usage'),
        createElement(CodeBlock, {
            code: `// Import blocks from blazecn
import { LoginForm01 } from 'blazecn/blocks/login-01';
import { SignupForm01 } from 'blazecn/blocks/signup-01';

// Render directly — each block is a self-contained component
createElement(LoginForm01, null)
createElement(SignupForm01, { className: 'my-custom-class' })`,
        }),
    );
}
