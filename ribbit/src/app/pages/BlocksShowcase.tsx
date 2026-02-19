import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
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

function CopyLinkIcon() {
    return createElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', className: 'size-3.5',
    },
        createElement('path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }),
        createElement('path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }),
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
// Block preview wrapper
// ---------------------------------------------------------------------------

function BlockPreview({ id, title, children }: { id: string; title: string; children?: any }) {
    return createElement('div', { id, className: 'scroll-mt-24 space-y-4' },
        createElement('div', { className: 'flex items-center justify-between' },
            createElement('a', {
                href: `#${id}`,
                className: 'font-semibold leading-none tracking-tight underline-offset-2 hover:underline',
            }, title),
            createElement('div', { className: 'flex items-center gap-2' },
                createElement(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    className: 'h-7 gap-1 text-xs text-muted-foreground',
                    onClick: () => {
                        const url = `${window.location.origin}/blocks#${id}`;
                        navigator.clipboard.writeText(url).catch(() => {});
                    },
                },
                    createElement(CopyLinkIcon, null),
                    'Copy Link',
                ),
                createElement(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    className: 'h-7 gap-1 text-xs text-muted-foreground',
                    onClick: () => {
                        window.open(`/blocks#${id}`, '_blank');
                    },
                },
                    createElement(ExternalLinkIcon, null),
                    'Open in New Tab',
                ),
            ),
        ),
        createElement('div', {
            className: 'relative rounded-xl border bg-background overflow-hidden',
        },
            createElement('div', {
                className: 'absolute inset-0 -z-10',
                style: {
                    backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                },
            }),
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
        createElement('div', { className: 'relative hidden bg-muted lg:block min-h-full' },
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
                    createElement('div', { className: 'relative hidden bg-muted md:flex items-center justify-center min-h-full' },
                        createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent' }),
                        createElement('div', { className: 'relative text-8xl opacity-10 select-none' }, '\u{1F512}'),
                    ),
                ),
            ),
        ),
    );
}

function Login05() {
    return createElement('div', { className: 'grid min-h-[600px] lg:grid-cols-2' },
        createElement('div', { className: 'relative hidden bg-muted lg:block min-h-full' },
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
// Sidebar blocks — self-contained inline sidebars (no fixed positioning)
// ---------------------------------------------------------------------------

function SidebarIcon(name: string, cls?: string) {
    const c = cls || 'size-4';
    const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', className: c };
    switch (name) {
        case 'home': return createElement('svg', p, createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }), createElement('polyline', { points: '9 22 9 12 15 12 15 22' }));
        case 'inbox': return createElement('svg', p, createElement('polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }), createElement('path', { d: 'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' }));
        case 'calendar': return createElement('svg', p, createElement('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }), createElement('line', { x1: '16', y1: '2', x2: '16', y2: '6' }), createElement('line', { x1: '8', y1: '2', x2: '8', y2: '6' }), createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' }));
        case 'search': return createElement('svg', p, createElement('circle', { cx: '11', cy: '11', r: '8' }), createElement('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }));
        case 'settings': return createElement('svg', p, createElement('circle', { cx: '12', cy: '12', r: '3' }), createElement('path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }));
        case 'users': return createElement('svg', p, createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }), createElement('circle', { cx: '9', cy: '7', r: '4' }), createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }), createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }));
        case 'chart': return createElement('svg', p, createElement('line', { x1: '18', y1: '20', x2: '18', y2: '10' }), createElement('line', { x1: '12', y1: '20', x2: '12', y2: '4' }), createElement('line', { x1: '6', y1: '20', x2: '6', y2: '14' }));
        case 'folder': return createElement('svg', p, createElement('path', { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' }));
        case 'mail': return createElement('svg', p, createElement('rect', { width: '20', height: '16', x: '2', y: '4', rx: '2' }), createElement('path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }));
        case 'music': return createElement('svg', p, createElement('path', { d: 'M9 18V5l12-2v13' }), createElement('circle', { cx: '6', cy: '18', r: '3' }), createElement('circle', { cx: '18', cy: '16', r: '3' }));
        case 'bell': return createElement('svg', p, createElement('path', { d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }), createElement('path', { d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' }));
        case 'panel': return createElement('svg', p, createElement('rect', { x: '3', y: '3', width: '7', height: '18', rx: '1' }), createElement('rect', { x: '14', y: '3', width: '7', height: '18', rx: '1' }));
        default: return createElement('svg', p, createElement('circle', { cx: '12', cy: '12', r: '10' }));
    }
}

function SbNavBtn({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
    return createElement('button', {
        type: 'button',
        className: `flex w-full items-center gap-2 rounded-md px-2 h-8 text-sm transition-colors cursor-pointer ${active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`,
    }, SidebarIcon(icon, 'size-4 shrink-0'), createElement('span', { className: 'truncate' }, label));
}

function Sidebar01() {
    return createElement('div', { className: 'flex h-[600px]' },
        // Sidebar
        createElement('div', { className: 'w-64 bg-card border-r flex flex-col shrink-0' },
            createElement('div', { className: 'p-4 flex items-center gap-2' },
                createElement('div', { className: 'size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold' }, 'A'),
                createElement('span', { className: 'text-sm font-semibold' }, 'Acme Inc'),
            ),
            createElement('div', { className: 'px-2 mb-2' },
                createElement(Input, { placeholder: 'Search...', className: 'h-8 text-sm' }),
            ),
            createElement('nav', { className: 'flex-1 overflow-auto px-2 space-y-1' },
                createElement('div', { className: 'text-xs font-medium text-muted-foreground px-2 h-6 flex items-center' }, 'Platform'),
                createElement(SbNavBtn, { icon: 'home', label: 'Dashboard', active: true }),
                createElement(SbNavBtn, { icon: 'inbox', label: 'Inbox' }),
                createElement(SbNavBtn, { icon: 'chart', label: 'Analytics' }),
                createElement(SbNavBtn, { icon: 'users', label: 'Team' }),
                createElement(SbNavBtn, { icon: 'folder', label: 'Projects' }),
                createElement('div', { className: 'text-xs font-medium text-muted-foreground px-2 h-6 flex items-center mt-4' }, 'Settings'),
                createElement(SbNavBtn, { icon: 'settings', label: 'General' }),
                createElement(SbNavBtn, { icon: 'bell', label: 'Notifications' }),
            ),
            createElement('div', { className: 'border-t p-3 flex items-center gap-2' },
                createElement('div', { className: 'size-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold' }, 'JD'),
                createElement('div', { className: 'flex-1 min-w-0' },
                    createElement('p', { className: 'text-sm font-medium truncate' }, 'John Doe'),
                    createElement('p', { className: 'text-xs text-muted-foreground truncate' }, 'john@acme.com'),
                ),
            ),
        ),
        // Content
        createElement('div', { className: 'flex-1 flex flex-col min-w-0' },
            createElement('div', { className: 'h-12 border-b flex items-center px-4 gap-2' },
                createElement('button', { type: 'button', className: 'h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center cursor-pointer' }, SidebarIcon('panel', 'size-4')),
                createElement('span', { className: 'text-sm font-medium' }, 'Dashboard'),
            ),
            createElement('div', { className: 'flex-1 p-6' },
                createElement('div', { className: 'grid gap-4 md:grid-cols-3' },
                    ...[{ t: 'Total Revenue', v: '$45,231', c: '+20.1%' }, { t: 'Subscriptions', v: '+2,350', c: '+180.1%' }, { t: 'Active Now', v: '+573', c: '+201' }].map((s) =>
                        createElement(Card, { key: s.t },
                            createElement(CardHeader, { className: 'pb-2' }, createElement(CardDescription, null, s.t)),
                            createElement(CardContent, null,
                                createElement('div', { className: 'text-2xl font-bold' }, s.v),
                                createElement('p', { className: 'text-xs text-muted-foreground' }, s.c),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
}

function Sidebar02() {
    const nav = [
        { icon: 'home', label: 'Home', active: false },
        { icon: 'mail', label: 'Mail', active: true },
        { icon: 'calendar', label: 'Calendar', active: false },
        { icon: 'music', label: 'Music', active: false },
    ];
    const playlists = ['Recently Added', 'Recently Played', 'Top Songs', 'Top Albums', 'Favorites'];
    return createElement('div', { className: 'flex h-[600px]' },
        createElement('div', { className: 'w-64 bg-card border-r flex flex-col shrink-0' },
            createElement('div', { className: 'p-4 flex items-center gap-2' },
                createElement('div', { className: 'size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold' }, '\u266B'),
                createElement('span', { className: 'text-sm font-semibold' }, 'Music'),
            ),
            createElement('nav', { className: 'flex-1 overflow-auto px-2 space-y-1' },
                createElement('div', { className: 'text-xs font-medium text-muted-foreground px-2 h-6 flex items-center' }, 'Discover'),
                ...nav.map((n) => createElement(SbNavBtn, { key: n.label, ...n })),
                createElement('div', { className: 'text-xs font-medium text-muted-foreground px-2 h-6 flex items-center mt-4' }, 'Library'),
                ...playlists.map((p) => createElement('button', {
                    key: p, type: 'button',
                    className: 'flex w-full items-center gap-2 rounded-md px-2 h-7 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
                }, SidebarIcon('music', 'size-3.5 shrink-0 opacity-50'), createElement('span', { className: 'truncate' }, p))),
            ),
            createElement('div', { className: 'border-t p-3' },
                createElement(Button, { variant: 'outline', className: 'w-full text-xs h-8' }, '+ New Playlist'),
            ),
        ),
        createElement('div', { className: 'flex-1 flex flex-col min-w-0' },
            createElement('div', { className: 'h-12 border-b flex items-center px-4 gap-2' },
                createElement('span', { className: 'text-sm font-medium' }, 'Listen Now'),
            ),
            createElement('div', { className: 'flex-1 p-6' },
                createElement('h3', { className: 'text-lg font-semibold mb-4' }, 'Made for You'),
                createElement('div', { className: 'grid gap-4 md:grid-cols-4' },
                    ...[{ t: 'Daily Mix 1', d: 'Your daily mix of fresh music' }, { t: 'Discover Weekly', d: 'New music picked for you' }, { t: 'Release Radar', d: 'New releases from artists you follow' }, { t: 'Chill Vibes', d: 'Relax and unwind' }].map((m) =>
                        createElement('div', { key: m.t, className: 'rounded-lg border overflow-hidden' },
                            createElement('div', { className: 'aspect-square bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center' },
                                createElement('span', { className: 'text-4xl opacity-20' }, '\u266B'),
                            ),
                            createElement('div', { className: 'p-3' },
                                createElement('p', { className: 'text-sm font-medium truncate' }, m.t),
                                createElement('p', { className: 'text-xs text-muted-foreground truncate' }, m.d),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// Dashboard-02 — simpler analytics overview
// ---------------------------------------------------------------------------

function Dashboard02() {
    return createElement('div', { className: 'p-6 md:p-8 space-y-6' },
        createElement('div', { className: 'flex items-center justify-between' },
            createElement('h2', { className: 'text-2xl font-bold tracking-tight' }, 'Analytics'),
            createElement('div', { className: 'flex items-center gap-2' },
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Last 7 days'),
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Export'),
            ),
        ),
        createElement('div', { className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-4' },
            ...[
                { t: 'Page Views', v: '128,430', c: '+12.5%', up: true },
                { t: 'Unique Visitors', v: '24,891', c: '+8.2%', up: true },
                { t: 'Bounce Rate', v: '42.3%', c: '-3.1%', up: false },
                { t: 'Avg. Session', v: '2m 34s', c: '+18.7%', up: true },
            ].map((s) =>
                createElement(Card, { key: s.t },
                    createElement(CardHeader, { className: 'pb-2' }, createElement(CardDescription, null, s.t)),
                    createElement(CardContent, null,
                        createElement('div', { className: 'text-2xl font-bold' }, s.v),
                        createElement('p', { className: `text-xs ${s.up ? 'text-green-600' : 'text-red-500'}` }, s.c),
                    ),
                ),
            ),
        ),
        createElement('div', { className: 'grid gap-4 md:grid-cols-7' },
            createElement(Card, { className: 'col-span-4' },
                createElement(CardHeader, null, createElement(CardTitle, null, 'Traffic Overview')),
                createElement(CardContent, null,
                    createElement('div', { className: 'h-[200px] flex items-end gap-1' },
                        ...[65, 45, 75, 55, 80, 60, 90, 70, 85, 50, 78, 62, 88, 72].map((h, i) =>
                            createElement('div', { key: i, className: 'flex-1 bg-primary/80 rounded-t-sm hover:bg-primary transition-all', style: { height: `${h}%` } }),
                        ),
                    ),
                ),
            ),
            createElement(Card, { className: 'col-span-3' },
                createElement(CardHeader, null, createElement(CardTitle, null, 'Top Pages')),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-3' },
                        ...[{ p: '/home', v: '12,430' }, { p: '/docs', v: '8,291' }, { p: '/pricing', v: '5,120' }, { p: '/blog', v: '3,891' }, { p: '/about', v: '2,340' }].map((r) =>
                            createElement('div', { key: r.p, className: 'flex items-center justify-between text-sm' },
                                createElement('span', { className: 'font-mono text-muted-foreground' }, r.p),
                                createElement('span', { className: 'font-medium tabular-nums' }, r.v),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// Settings-01 — settings page layout
// ---------------------------------------------------------------------------

function Settings01() {
    return createElement('div', { className: 'flex h-[600px]' },
        // Settings sidebar
        createElement('div', { className: 'w-56 bg-card border-r flex flex-col shrink-0 p-4' },
            createElement('h2', { className: 'text-lg font-semibold mb-4' }, 'Settings'),
            createElement('nav', { className: 'space-y-1' },
                ...[
                    { label: 'Profile', active: true }, { label: 'Account', active: false },
                    { label: 'Appearance', active: false }, { label: 'Notifications', active: false },
                    { label: 'Display', active: false }, { label: 'Accessibility', active: false },
                ].map((n) =>
                    createElement('button', {
                        key: n.label, type: 'button',
                        className: `flex w-full items-center rounded-md px-3 h-8 text-sm transition-colors cursor-pointer ${n.active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`,
                    }, n.label),
                ),
            ),
        ),
        // Content
        createElement('div', { className: 'flex-1 overflow-auto p-6 md:p-8' },
            createElement('div', { className: 'max-w-2xl space-y-6' },
                createElement('div', null,
                    createElement('h3', { className: 'text-lg font-medium' }, 'Profile'),
                    createElement('p', { className: 'text-sm text-muted-foreground' }, 'This is how others will see you on the site.'),
                ),
                createElement('div', { className: 'border-t pt-6 space-y-4' },
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 'bs-set-name' }, 'Display Name'),
                        createElement(Input, { id: 'bs-set-name', placeholder: 'John Doe', value: 'John Doe' }),
                        createElement('p', { className: 'text-xs text-muted-foreground' }, 'This is your public display name.'),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 'bs-set-email' }, 'Email'),
                        createElement(Input, { id: 'bs-set-email', type: 'email', placeholder: 'john@example.com', value: 'john@example.com' }),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 'bs-set-bio' }, 'Bio'),
                        createElement('textarea', {
                            id: 'bs-set-bio',
                            className: 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            placeholder: 'Tell us about yourself',
                            value: 'I build things for the web.',
                        }),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, null, 'URLs'),
                        createElement(Input, { placeholder: 'https://example.com', value: 'https://example.com' }),
                        createElement(Input, { placeholder: 'https://github.com/johndoe', value: 'https://github.com/johndoe' }),
                        createElement(Button, { variant: 'outline', size: 'sm', className: 'w-fit' }, '+ Add URL'),
                    ),
                ),
                createElement('div', { className: 'flex justify-end pt-4' },
                    createElement(Button, null, 'Update profile'),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// Charts-01 — chart overview block
// ---------------------------------------------------------------------------

function Charts01() {
    return createElement('div', { className: 'p-6 md:p-8 space-y-6' },
        createElement('div', { className: 'flex items-center justify-between' },
            createElement('h2', { className: 'text-2xl font-bold tracking-tight' }, 'Charts'),
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Download Report'),
        ),
        createElement('div', { className: 'grid gap-4 md:grid-cols-2' },
            // Bar chart
            createElement(Card, null,
                createElement(CardHeader, null, createElement(CardTitle, null, 'Revenue'), createElement(CardDescription, null, 'Monthly revenue for the current year')),
                createElement(CardContent, null,
                    createElement('div', { className: 'h-[200px] flex items-end gap-2' },
                        ...[35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 95].map((h, i) =>
                            createElement('div', { key: i, className: 'flex-1 flex flex-col items-center gap-1' },
                                createElement('div', { className: 'w-full bg-primary/80 rounded-t-sm hover:bg-primary transition-all', style: { height: `${h}%` } }),
                                createElement('span', { className: 'text-[10px] text-muted-foreground' }, ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]),
                            ),
                        ),
                    ),
                ),
            ),
            // Donut-style breakdown
            createElement(Card, null,
                createElement(CardHeader, null, createElement(CardTitle, null, 'Breakdown'), createElement(CardDescription, null, 'Revenue by category')),
                createElement(CardContent, null,
                    createElement('div', { className: 'flex items-center gap-8' },
                        // Fake donut
                        createElement('div', { className: 'relative size-32 shrink-0' },
                            createElement('div', {
                                className: 'size-full rounded-full',
                                style: { background: 'conic-gradient(var(--primary) 0% 45%, var(--accent) 45% 70%, var(--muted) 70% 100%)' },
                            }),
                            createElement('div', { className: 'absolute inset-4 rounded-full bg-card flex items-center justify-center' },
                                createElement('span', { className: 'text-lg font-bold' }, '$45K'),
                            ),
                        ),
                        createElement('div', { className: 'space-y-2' },
                            ...[{ l: 'Products', v: '$20,250', c: 'bg-primary' }, { l: 'Services', v: '$11,250', c: 'bg-accent' }, { l: 'Other', v: '$13,500', c: 'bg-muted' }].map((r) =>
                                createElement('div', { key: r.l, className: 'flex items-center gap-2 text-sm' },
                                    createElement('div', { className: `size-3 rounded-sm ${r.c}` }),
                                    createElement('span', { className: 'text-muted-foreground' }, r.l),
                                    createElement('span', { className: 'font-medium ml-auto' }, r.v),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            // Area chart placeholder
            createElement(Card, { className: 'md:col-span-2' },
                createElement(CardHeader, null, createElement(CardTitle, null, 'Visitors'), createElement(CardDescription, null, 'Unique visitors over the last 30 days')),
                createElement(CardContent, null,
                    createElement('div', { className: 'h-[160px] relative' },
                        // Fake area chart using gradient
                        createElement('div', { className: 'absolute inset-0 flex items-end' },
                            ...[30, 45, 40, 55, 50, 65, 60, 70, 55, 75, 70, 80, 65, 85, 80, 90, 75, 85, 80, 95, 88, 92, 85, 90, 88, 95, 92, 98, 90, 95].map((h, i) =>
                                createElement('div', { key: i, className: 'flex-1 bg-primary/20 hover:bg-primary/30 transition-all', style: { height: `${h}%` } }),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// Block tab content — each tab renders its blocks with BlockPreview wrappers
// ---------------------------------------------------------------------------

function FeaturedTab() {
    const blocks = [
        { id: 'dashboard-01', title: 'A dashboard with sidebar, charts and data table', component: Dashboard01Demo },
        { id: 'sidebar-01', title: 'A sidebar layout with navigation and dashboard content', component: Sidebar01 },
        { id: 'charts-01', title: 'A chart overview with bar, donut and area charts', component: Charts01 },
        { id: 'settings-01', title: 'A settings page with sidebar navigation and profile form', component: Settings01 },
    ];
    return createElement('div', { className: 'space-y-16' },
        ...blocks.map((b) => createElement(BlockPreview, { key: b.id, id: b.id, title: b.title }, createElement(b.component, null))),
    );
}

function SidebarTab() {
    const blocks = [
        { id: 'sidebar-01', title: 'A sidebar layout with navigation and dashboard content', component: Sidebar01 },
        { id: 'sidebar-02', title: 'A music app layout with sidebar playlists and library', component: Sidebar02 },
        { id: 'settings-01', title: 'A settings page with sidebar navigation and profile form', component: Settings01 },
    ];
    return createElement('div', { className: 'space-y-16' },
        ...blocks.map((b) => createElement(BlockPreview, { key: b.id, id: b.id, title: b.title }, createElement(b.component, null))),
    );
}

function LoginTab() {
    const blocks = [
        { id: 'login-01', title: 'A simple centered login card with social providers', component: Login01 },
        { id: 'login-02', title: 'A login page with form and side panel', component: Login02 },
        { id: 'login-03', title: 'A login page with a muted background color', component: Login03 },
        { id: 'login-04', title: 'A login page with form and image', component: Login04 },
        { id: 'login-05', title: 'A login page with image on the left', component: Login05 },
    ];
    return createElement('div', { className: 'space-y-16' },
        ...blocks.map((b) => createElement(BlockPreview, { key: b.id, id: b.id, title: b.title }, createElement(b.component, null))),
    );
}

function SignupTab() {
    const blocks = [
        { id: 'signup-01', title: 'A simple signup form with name, email and password', component: Signup01 },
    ];
    return createElement('div', { className: 'space-y-16' },
        ...blocks.map((b) => createElement(BlockPreview, { key: b.id, id: b.id, title: b.title }, createElement(b.component, null))),
    );
}

// ---------------------------------------------------------------------------
// BlocksShowcase — mirrors ExamplesPage layout
// ---------------------------------------------------------------------------

interface ShowcaseState {
    active: string;
}

function DashboardTab() {
    const blocks = [
        { id: 'dashboard-01', title: 'A dashboard with sidebar, charts and data table', component: Dashboard01Demo },
        { id: 'dashboard-02', title: 'An analytics overview with traffic chart and top pages', component: Dashboard02 },
    ];
    return createElement('div', { className: 'space-y-16' },
        ...blocks.map((b) => createElement(BlockPreview, { key: b.id, id: b.id, title: b.title }, createElement(b.component, null))),
    );
}

function ChartsTab() {
    const blocks = [
        { id: 'charts-01', title: 'A chart overview with bar, donut and area charts', component: Charts01 },
    ];
    return createElement('div', { className: 'space-y-16' },
        ...blocks.map((b) => createElement(BlockPreview, { key: b.id, id: b.id, title: b.title }, createElement(b.component, null))),
    );
}

const BLOCKS_TABS = [
    { value: 'featured', label: 'Featured' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'login', label: 'Login' },
    { value: 'signup', label: 'Signup' },
    { value: 'charts', label: 'Charts' },
];

export class BlocksShowcase extends Component<{}, ShowcaseState> {
    declare state: ShowcaseState;

    constructor(props: {}) {
        super(props);
        this.state = { active: 'featured' };
    }

    render() {
        const { active } = this.state;

        return createElement('div', { className: 'flex flex-1 flex-col min-h-screen' },
            // ── Hero ──
            createElement('div', { className: 'border-b border-border/40' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6 py-12 md:py-20 lg:py-24' },
                    createElement('div', { className: 'mx-auto max-w-4xl space-y-6' },
                        // Announcement pill
                        createElement('div', { className: 'flex justify-center' },
                            createElement(Link, { to: '/docs/blazecn/blocks', className: 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors' },
                                createElement('span', { className: 'size-1.5 rounded-full bg-primary animate-pulse' }),
                                'New blocks added regularly',
                                createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-3' },
                                    createElement('path', { d: 'M5 12h14' }),
                                    createElement('path', { d: 'M12 5l7 7-7 7' }),
                                ),
                            ),
                        ),
                        // Heading
                        createElement('h1', { className: 'text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl' },
                            'Building Blocks for',
                            createElement('br', null),
                            'the Web',
                        ),
                        // Description
                        createElement('p', { className: 'mx-auto max-w-2xl text-center text-lg text-muted-foreground' },
                            'Clean, modern building blocks. Copy and paste into your apps. ',
                            'Built with blazecn components. Open Source. Open Code.',
                        ),
                        // CTA buttons
                        createElement('div', { className: 'flex items-center justify-center gap-3' },
                            createElement(Link, { to: '/docs/blazecn/blocks' },
                                createElement(Button, { size: 'sm', className: 'h-8 rounded-lg' }, 'View Docs'),
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
                        ...BLOCKS_TABS.map((t) =>
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
                    active === 'featured' ? createElement(FeaturedTab, null) : null,
                    active === 'dashboard' ? createElement(DashboardTab, null) : null,
                    active === 'sidebar' ? createElement(SidebarTab, null) : null,
                    active === 'login' ? createElement(LoginTab, null) : null,
                    active === 'signup' ? createElement(SignupTab, null) : null,
                    active === 'charts' ? createElement(ChartsTab, null) : null,
                ),
            ),
        );
    }
}
