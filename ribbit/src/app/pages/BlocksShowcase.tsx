import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Dashboard01Demo } from './docs/blazecn/blocks/Dashboard01';

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

function AppleIcon() {
    return createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', className: 'size-5' },
        createElement('path', {
            d: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701',
            fill: 'currentColor',
        }),
    );
}

function GoogleIcon() {
    return createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', className: 'size-5' },
        createElement('path', {
            d: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
            fill: 'currentColor',
        }),
    );
}

function GitHubIcon() {
    return createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', className: 'size-5', fill: 'currentColor' },
        createElement('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' }),
    );
}

function LogoIcon() {
    return createElement('div', {
        className: 'flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground',
    },
        createElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
            'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', className: 'size-4',
        },
            createElement('path', { d: 'M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' }),
        ),
    );
}

function ExternalLinkIcon() {
    return createElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', className: 'size-3.5',
    },
        createElement('path', { d: 'M15 3h6v6' }),
        createElement('path', { d: 'M10 14 21 3' }),
        createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
    );
}

function OrDivider() {
    return createElement('div', {
        className: 'relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border',
    },
        createElement('span', { className: 'relative z-10 bg-card px-2 text-muted-foreground' }, 'Or continue with'),
    );
}

// ---------------------------------------------------------------------------
// Block preview wrapper — matches shadcn's block container style
// ---------------------------------------------------------------------------

function BlockPreview({ id, title, children }: { id: string; title: string; children?: any }) {
    return createElement('div', { id, className: 'space-y-4' },
        createElement('div', { className: 'flex items-center justify-between' },
            createElement('div', { className: 'space-y-1' },
                createElement('h3', { className: 'font-semibold leading-none tracking-tight' }, title),
            ),
            createElement('div', { className: 'flex items-center gap-2' },
                createElement(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    className: 'h-7 gap-1 text-xs text-muted-foreground',
                    onClick: () => {
                        const el = document.getElementById(id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },
                },
                    createElement(ExternalLinkIcon, null),
                    'Open in New Tab',
                ),
            ),
        ),
        createElement('div', { className: 'rounded-xl border bg-background overflow-hidden' },
            children,
        ),
    );
}

// ---------------------------------------------------------------------------
// Login blocks
// ---------------------------------------------------------------------------

function Login01() {
    return createElement('div', { className: 'flex min-h-[600px] items-center justify-center p-6 md:p-10' },
        createElement('div', { className: 'w-full max-w-sm' },
            createElement(Card, null,
                createElement(CardHeader, { className: 'text-center' },
                    createElement(CardTitle, { className: 'text-xl' }, 'Welcome back'),
                    createElement(CardDescription, null, 'Login with your Apple or Google account'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'flex flex-col gap-4' },
                            createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(AppleIcon, null), 'Login with Apple'),
                            createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GoogleIcon, null), 'Login with Google'),
                        ),
                        createElement(OrDivider, null),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'bs-l01-email' }, 'Email'),
                            createElement(Input, { id: 'bs-l01-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement('div', { className: 'flex items-center' },
                                createElement(Label, { htmlFor: 'bs-l01-pass' }, 'Password'),
                                createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot your password?'),
                            ),
                            createElement(Input, { id: 'bs-l01-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                    ),
                ),
                createElement(CardFooter, { className: 'justify-center text-sm' },
                    'Don\u2019t have an account? ',
                    createElement('a', { href: '#', className: 'underline underline-offset-4 ml-1' }, 'Sign up'),
                ),
            ),
        ),
    );
}

function Login02() {
    return createElement('div', { className: 'grid min-h-[600px] lg:grid-cols-2' },
        createElement('div', { className: 'flex flex-col gap-4 p-6 md:p-10' },
            createElement('div', { className: 'flex items-center gap-2 font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', { className: 'flex flex-1 items-center justify-center' },
                createElement('div', { className: 'w-full max-w-xs' },
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'grid gap-2 text-center' },
                            createElement('h1', { className: 'text-2xl font-bold' }, 'Login'),
                            createElement('p', { className: 'text-balance text-sm text-muted-foreground' }, 'Enter your email below to login to your account'),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'bs-l02-email' }, 'Email'),
                            createElement(Input, { id: 'bs-l02-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement('div', { className: 'flex items-center' },
                                createElement(Label, { htmlFor: 'bs-l02-pass' }, 'Password'),
                                createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot your password?'),
                            ),
                            createElement(Input, { id: 'bs-l02-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                        createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GoogleIcon, null), 'Login with Google'),
                    ),
                    createElement('div', { className: 'text-center text-sm mt-4' },
                        'Don\u2019t have an account? ',
                        createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign up'),
                    ),
                ),
            ),
        ),
        createElement('div', { className: 'relative hidden bg-muted lg:block' },
            createElement('div', { className: 'absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center' },
                createElement('div', { className: 'text-8xl opacity-10 select-none' }, '\u26A1'),
            ),
        ),
    );
}

function Login03() {
    return createElement('div', { className: 'bg-muted flex min-h-[600px] flex-col items-center justify-center gap-6 p-6 md:p-10' },
        createElement('div', { className: 'flex w-full max-w-sm flex-col gap-6' },
            createElement('a', { href: '#', className: 'flex items-center gap-2 self-center font-medium' },
                createElement(LogoIcon, null),
                'Acme Inc.',
            ),
            createElement(Card, null,
                createElement(CardHeader, { className: 'text-center' },
                    createElement(CardTitle, { className: 'text-xl' }, 'Welcome back'),
                    createElement(CardDescription, null, 'Login with your Apple or Google account'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'flex flex-col gap-4' },
                            createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(AppleIcon, null), 'Login with Apple'),
                            createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GoogleIcon, null), 'Login with Google'),
                        ),
                        createElement(OrDivider, null),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'bs-l03-email' }, 'Email'),
                            createElement(Input, { id: 'bs-l03-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement('div', { className: 'flex items-center' },
                                createElement(Label, { htmlFor: 'bs-l03-pass' }, 'Password'),
                                createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot your password?'),
                            ),
                            createElement(Input, { id: 'bs-l03-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                    ),
                ),
                createElement(CardFooter, { className: 'justify-center text-sm' },
                    'Don\u2019t have an account? ',
                    createElement('a', { href: '#', className: 'underline underline-offset-4 ml-1' }, 'Sign up'),
                ),
            ),
        ),
    );
}

function Login04() {
    return createElement('div', { className: 'bg-muted flex min-h-[600px] flex-col items-center justify-center p-6 md:p-10' },
        createElement('div', { className: 'w-full max-w-sm md:max-w-4xl' },
            createElement(Card, { className: 'overflow-hidden' },
                createElement(CardContent, { className: 'grid p-0 md:grid-cols-2' },
                    createElement('div', { className: 'p-6 md:p-8' },
                        createElement('div', { className: 'flex flex-col gap-6' },
                            createElement('div', { className: 'flex flex-col items-center text-center' },
                                createElement('h1', { className: 'text-2xl font-bold' }, 'Welcome back'),
                                createElement('p', { className: 'text-balance text-muted-foreground' }, 'Login to your Acme Inc account'),
                            ),
                            createElement('div', { className: 'grid gap-2' },
                                createElement(Label, { htmlFor: 'bs-l04-email' }, 'Email'),
                                createElement(Input, { id: 'bs-l04-email', type: 'email', placeholder: 'm@example.com' }),
                            ),
                            createElement('div', { className: 'grid gap-2' },
                                createElement('div', { className: 'flex items-center' },
                                    createElement(Label, { htmlFor: 'bs-l04-pass' }, 'Password'),
                                    createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot your password?'),
                                ),
                                createElement(Input, { id: 'bs-l04-pass', type: 'password' }),
                            ),
                            createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                            createElement(OrDivider, null),
                            createElement('div', { className: 'grid grid-cols-2 gap-4' },
                                createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(AppleIcon, null), 'Apple'),
                                createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GoogleIcon, null), 'Google'),
                            ),
                            createElement('div', { className: 'text-center text-sm' },
                                'Don\u2019t have an account? ',
                                createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign up'),
                            ),
                        ),
                    ),
                    createElement('div', { className: 'relative hidden bg-muted md:block' },
                        createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent flex items-center justify-center' },
                            createElement('div', { className: 'text-8xl opacity-10 select-none' }, '\u{1F512}'),
                        ),
                    ),
                ),
            ),
        ),
    );
}

function Login05() {
    return createElement('div', { className: 'grid min-h-[600px] lg:grid-cols-2' },
        createElement('div', { className: 'relative hidden bg-muted lg:block' },
            createElement('div', { className: 'absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent flex items-center justify-center' },
                createElement('div', { className: 'text-8xl opacity-10 select-none' }, '\u{1F680}'),
            ),
        ),
        createElement('div', { className: 'flex flex-col gap-4 p-6 md:p-10' },
            createElement('div', { className: 'flex justify-center gap-2 md:justify-start' },
                createElement('a', { href: '#', className: 'flex items-center gap-2 font-medium' },
                    createElement(LogoIcon, null),
                    'Acme Inc.',
                ),
            ),
            createElement('div', { className: 'flex flex-1 items-center justify-center' },
                createElement('div', { className: 'w-full max-w-xs' },
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'grid gap-2 text-center' },
                            createElement('h1', { className: 'text-2xl font-bold' }, 'Login'),
                            createElement('p', { className: 'text-balance text-sm text-muted-foreground' }, 'Enter your email below to login to your account'),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'bs-l05-email' }, 'Email'),
                            createElement(Input, { id: 'bs-l05-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement('div', { className: 'flex items-center' },
                                createElement(Label, { htmlFor: 'bs-l05-pass' }, 'Password'),
                                createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot?'),
                            ),
                            createElement(Input, { id: 'bs-l05-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                        createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GoogleIcon, null), 'Login with Google'),
                    ),
                    createElement('div', { className: 'text-center text-sm mt-4' },
                        'Don\u2019t have an account? ',
                        createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign up'),
                    ),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// Signup blocks
// ---------------------------------------------------------------------------

function Signup01() {
    return createElement('div', { className: 'flex min-h-[600px] items-center justify-center p-6 md:p-10' },
        createElement('div', { className: 'w-full max-w-sm' },
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, { className: 'text-xl' }, 'Sign Up'),
                    createElement(CardDescription, null, 'Enter your information to create an account'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'grid grid-cols-2 gap-4' },
                            createElement('div', { className: 'grid gap-2' },
                                createElement(Label, { htmlFor: 'bs-s01-fn' }, 'First name'),
                                createElement(Input, { id: 'bs-s01-fn', placeholder: 'Max' }),
                            ),
                            createElement('div', { className: 'grid gap-2' },
                                createElement(Label, { htmlFor: 'bs-s01-ln' }, 'Last name'),
                                createElement(Input, { id: 'bs-s01-ln', placeholder: 'Robinson' }),
                            ),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'bs-s01-email' }, 'Email'),
                            createElement(Input, { id: 'bs-s01-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'bs-s01-pass' }, 'Password'),
                            createElement(Input, { id: 'bs-s01-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Create an account'),
                        createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GitHubIcon, null), 'Sign up with GitHub'),
                    ),
                ),
                createElement(CardFooter, { className: 'justify-center text-sm' },
                    'Already have an account? ',
                    createElement('a', { href: '#', className: 'underline underline-offset-4 ml-1' }, 'Sign in'),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// Category tab buttons — matching shadcn style
// ---------------------------------------------------------------------------

interface ShowcaseState {
    activeCategory: string;
}

// ---------------------------------------------------------------------------
// Block definitions
// ---------------------------------------------------------------------------

const BLOCKS = [
    { id: 'dashboard-01', category: 'dashboard', title: 'A dashboard with sidebar, charts and data table', component: Dashboard01Demo },
    { id: 'login-01', category: 'login', title: 'A simple centered login card with social providers', component: Login01 },
    { id: 'login-02', category: 'login', title: 'A login page with form and side panel', component: Login02 },
    { id: 'login-03', category: 'login', title: 'A login page with a muted background color', component: Login03 },
    { id: 'login-04', category: 'login', title: 'A login page with form and image', component: Login04 },
    { id: 'login-05', category: 'login', title: 'A login page with image on the left', component: Login05 },
    { id: 'signup-01', category: 'signup', title: 'A simple signup form with name, email and password', component: Signup01 },
];

// ---------------------------------------------------------------------------
// BlocksShowcase
// ---------------------------------------------------------------------------

export class BlocksShowcase extends Component<{}, ShowcaseState> {
    declare state: ShowcaseState;

    constructor(props: {}) {
        super(props);
        this.state = { activeCategory: 'all' };
    }

    render() {
        const { activeCategory } = this.state;

        const categories = [
            { value: 'all', label: 'All' },
            { value: 'dashboard', label: 'Dashboard' },
            { value: 'login', label: 'Login' },
            { value: 'signup', label: 'Signup' },
        ];

        const filtered = activeCategory === 'all'
            ? BLOCKS
            : BLOCKS.filter((b) => b.category === activeCategory);

        return createElement('div', { className: 'min-h-screen' },
            // ── Hero section ──
            createElement('div', { className: 'border-b border-border/40' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6 py-12 md:py-16 lg:py-20' },
                    createElement('div', { className: 'mx-auto max-w-3xl text-center space-y-4' },
                        createElement('h1', { className: 'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl' },
                            'Building Blocks for the Web',
                        ),
                        createElement('p', { className: 'text-lg text-muted-foreground' },
                            'Clean, modern building blocks. Copy and paste into your apps. ',
                            'Built with blazecn components. Open Source.',
                        ),
                        createElement('div', { className: 'flex items-center justify-center gap-3 pt-2' },
                            createElement('a', { href: '#blocks' },
                                createElement(Button, { size: 'sm' }, 'Browse Blocks'),
                            ),
                            createElement(Link, { to: '/docs/blazecn/blocks' },
                                createElement(Button, { variant: 'outline', size: 'sm' }, 'View Docs'),
                            ),
                        ),
                    ),
                ),
            ),

            // ── Category tabs + blocks ──
            createElement('div', { id: 'blocks', className: 'mx-auto max-w-[1400px] px-4 sm:px-6 py-8 md:py-12' },
                // Category bar
                createElement('div', { className: 'flex items-center gap-2 pb-8 border-b border-border/40 mb-8 overflow-x-auto' },
                    ...categories.map((cat) =>
                        createElement('button', {
                            key: cat.value,
                            type: 'button',
                            onClick: () => this.setState({ activeCategory: cat.value }),
                            className: [
                                'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                                activeCategory === cat.value
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                            ].join(' '),
                        }, cat.label),
                    ),
                    createElement('div', { className: 'flex-1' }),
                    createElement('span', { className: 'text-xs text-muted-foreground whitespace-nowrap' },
                        `${filtered.length} block${filtered.length !== 1 ? 's' : ''}`,
                    ),
                ),

                // Block list
                createElement('div', { className: 'space-y-16' },
                    ...filtered.map((block) =>
                        createElement(BlockPreview, {
                            key: block.id,
                            id: block.id,
                            title: block.title,
                        },
                            createElement(block.component, null),
                        ),
                    ),
                ),
            ),

            // ── Footer ──
            createElement('div', { className: 'border-t border-border/40' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6 py-8 flex items-center justify-between' },
                    createElement('p', { className: 'text-sm text-muted-foreground' },
                        'Built with ',
                        createElement(Link, { to: '/docs/blazecn', className: 'font-medium text-foreground hover:underline underline-offset-4' }, 'blazecn'),
                        ' components.',
                    ),
                    createElement(Link, { to: '/docs/blazecn/blocks' },
                        createElement(Button, { variant: 'ghost', size: 'sm', className: 'text-xs' }, 'Browse more blocks \u2192'),
                    ),
                ),
            ),
        );
    }
}
