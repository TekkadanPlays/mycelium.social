import { createElement } from 'inferno-create-element';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../ui/Card';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Label } from '../../../ui/Label';
import { PageHeader, DemoBox, SectionHeading, CodeBlock } from '../_helpers';
import { Dashboard01Demo } from './blocks/Dashboard01';

// ---------------------------------------------------------------------------
// SVG icon helpers (reused across blocks)
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
    return createElement('div', { className: 'flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground' },
        createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', className: 'size-4' },
            createElement('path', { d: 'M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' }),
        ),
    );
}

function OrDivider({ bg = 'bg-card' }: { bg?: string }) {
    return createElement('div', { className: 'relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border' },
        createElement('span', { className: `relative z-10 ${bg} px-2 text-muted-foreground` }, 'Or continue with'),
    );
}

function ImagePanel() {
    return createElement('div', { className: 'relative hidden lg:block bg-muted rounded-r-xl overflow-hidden' },
        createElement('div', {
            className: 'absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center',
        },
            createElement('div', { className: 'text-6xl opacity-20' }, '\u26A1'),
        ),
    );
}

// ---------------------------------------------------------------------------
// Login blocks
// ---------------------------------------------------------------------------

function Login01Demo() {
    return createElement(Card, { className: 'w-full max-w-sm mx-auto' },
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
                    createElement(Label, { htmlFor: 'l01-email' }, 'Email'),
                    createElement(Input, { id: 'l01-email', type: 'email', placeholder: 'm@example.com' }),
                ),
                createElement('div', { className: 'grid gap-2' },
                    createElement('div', { className: 'flex items-center' },
                        createElement(Label, { htmlFor: 'l01-pass' }, 'Password'),
                        createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot your password?'),
                    ),
                    createElement(Input, { id: 'l01-pass', type: 'password' }),
                ),
                createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
            ),
        ),
        createElement(CardFooter, { className: 'justify-center text-sm' },
            'Don\u2019t have an account? ',
            createElement('a', { href: '#', className: 'underline underline-offset-4 ml-1' }, 'Sign up'),
        ),
    );
}

function Login02Demo() {
    return createElement('div', { className: 'grid lg:grid-cols-2 min-h-[500px] rounded-xl border overflow-hidden' },
        createElement('div', { className: 'flex flex-col gap-4 p-6' },
            createElement('div', { className: 'flex items-center gap-2 font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', { className: 'flex flex-1 items-center justify-center' },
                createElement('div', { className: 'w-full max-w-xs' },
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'grid gap-2 text-center' },
                            createElement('h1', { className: 'text-2xl font-bold' }, 'Login'),
                            createElement('p', { className: 'text-sm text-muted-foreground' }, 'Enter your email below to login'),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'l02-email' }, 'Email'),
                            createElement(Input, { id: 'l02-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement('div', { className: 'flex items-center' },
                                createElement(Label, { htmlFor: 'l02-pass' }, 'Password'),
                                createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot?'),
                            ),
                            createElement(Input, { id: 'l02-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                        createElement(Button, { variant: 'outline', className: 'w-full' }, 'Login with Google'),
                    ),
                    createElement('div', { className: 'text-center text-sm mt-4' },
                        'Don\u2019t have an account? ',
                        createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign up'),
                    ),
                ),
            ),
        ),
        createElement(ImagePanel, null),
    );
}

function Login03Demo() {
    return createElement('div', { className: 'flex flex-col items-center justify-center gap-6 bg-muted rounded-xl p-6 min-h-[500px]' },
        createElement('div', { className: 'flex w-full max-w-sm flex-col gap-6' },
            createElement('a', { href: '#', className: 'flex items-center gap-2 self-center font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement(Card, null,
                createElement(CardHeader, { className: 'text-center' },
                    createElement(CardTitle, { className: 'text-xl' }, 'Welcome back'),
                    createElement(CardDescription, null, 'Login with your Apple or Google account'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'flex flex-col gap-4' },
                            createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(AppleIcon, null), 'Login with Apple'),
                            createElement('div', { className: 'grid grid-cols-2 gap-4' },
                                createElement(Button, { variant: 'outline' }, createElement(GoogleIcon, null), 'Google'),
                                createElement(Button, { variant: 'outline' }, createElement(GitHubIcon, null), 'GitHub'),
                            ),
                        ),
                        createElement(OrDivider, null),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'l03-email' }, 'Email'),
                            createElement(Input, { id: 'l03-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement('div', { className: 'flex items-center' },
                                createElement(Label, { htmlFor: 'l03-pass' }, 'Password'),
                                createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot?'),
                            ),
                            createElement(Input, { id: 'l03-pass', type: 'password' }),
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
        createElement('div', { className: 'text-center text-xs text-muted-foreground' },
            'By clicking continue, you agree to our Terms of Service and Privacy Policy.',
        ),
    );
}

function Login04Demo() {
    return createElement('div', { className: 'grid lg:grid-cols-2 min-h-[500px] rounded-xl border overflow-hidden' },
        createElement('div', { className: 'flex flex-col gap-4 p-6' },
            createElement('div', { className: 'flex items-center gap-2 font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', { className: 'flex flex-1 items-center justify-center' },
                createElement('div', { className: 'w-full max-w-sm' },
                    createElement(Card, null,
                        createElement(CardHeader, null,
                            createElement(CardTitle, { className: 'text-2xl' }, 'Login'),
                            createElement(CardDescription, null, 'Enter your email below to login'),
                        ),
                        createElement(CardContent, null,
                            createElement('div', { className: 'grid gap-6' },
                                createElement('div', { className: 'grid gap-2' },
                                    createElement(Label, { htmlFor: 'l04-email' }, 'Email'),
                                    createElement(Input, { id: 'l04-email', type: 'email', placeholder: 'm@example.com' }),
                                ),
                                createElement('div', { className: 'grid gap-2' },
                                    createElement('div', { className: 'flex items-center' },
                                        createElement(Label, { htmlFor: 'l04-pass' }, 'Password'),
                                        createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot?'),
                                    ),
                                    createElement(Input, { id: 'l04-pass', type: 'password' }),
                                ),
                                createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                                createElement(Button, { variant: 'outline', className: 'w-full' }, 'Login with Google'),
                            ),
                        ),
                    ),
                    createElement('div', { className: 'mt-4 text-center text-sm' },
                        'Don\u2019t have an account? ',
                        createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign up'),
                    ),
                ),
            ),
        ),
        createElement(ImagePanel, null),
    );
}

function Login05Demo() {
    return createElement('div', { className: 'flex flex-col items-center justify-center gap-6 rounded-xl border p-6 min-h-[500px]' },
        createElement('div', { className: 'flex w-full max-w-sm flex-col gap-6' },
            createElement('a', { href: '#', className: 'flex items-center gap-2 self-center font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', null,
                createElement('div', { className: 'grid gap-6' },
                    createElement('div', { className: 'grid gap-2 text-center' },
                        createElement('h1', { className: 'text-2xl font-bold' }, 'Login to your account'),
                        createElement('p', { className: 'text-sm text-muted-foreground' }, 'Enter your email below to login'),
                    ),
                    createElement('div', { className: 'grid grid-cols-3 gap-4' },
                        createElement(Button, { variant: 'outline' }, createElement(AppleIcon, null)),
                        createElement(Button, { variant: 'outline' }, createElement(GoogleIcon, null)),
                        createElement(Button, { variant: 'outline' }, createElement(GitHubIcon, null)),
                    ),
                    createElement(OrDivider, { bg: 'bg-background' }),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 'l05-email' }, 'Email'),
                        createElement(Input, { id: 'l05-email', type: 'email', placeholder: 'm@example.com' }),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement('div', { className: 'flex items-center' },
                            createElement(Label, { htmlFor: 'l05-pass' }, 'Password'),
                            createElement('a', { href: '#', className: 'ml-auto text-sm underline-offset-4 hover:underline' }, 'Forgot?'),
                        ),
                        createElement(Input, { id: 'l05-pass', type: 'password' }),
                    ),
                    createElement(Button, { type: 'submit', className: 'w-full' }, 'Login'),
                ),
                createElement('div', { className: 'text-center text-sm mt-4' },
                    'Don\u2019t have an account? ',
                    createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign up'),
                ),
            ),
        ),
        createElement('div', { className: 'text-center text-xs text-muted-foreground' },
            'By clicking continue, you agree to our Terms of Service and Privacy Policy.',
        ),
    );
}

// ---------------------------------------------------------------------------
// Signup blocks
// ---------------------------------------------------------------------------

function Signup01Demo() {
    return createElement(Card, { className: 'w-full max-w-sm mx-auto' },
        createElement(CardHeader, null,
            createElement(CardTitle, { className: 'text-xl' }, 'Sign Up'),
            createElement(CardDescription, null, 'Enter your information to create an account'),
        ),
        createElement(CardContent, null,
            createElement('div', { className: 'grid gap-6' },
                createElement('div', { className: 'grid grid-cols-2 gap-4' },
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 's01-fn' }, 'First name'),
                        createElement(Input, { id: 's01-fn', placeholder: 'Max' }),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 's01-ln' }, 'Last name'),
                        createElement(Input, { id: 's01-ln', placeholder: 'Robinson' }),
                    ),
                ),
                createElement('div', { className: 'grid gap-2' },
                    createElement(Label, { htmlFor: 's01-email' }, 'Email'),
                    createElement(Input, { id: 's01-email', type: 'email', placeholder: 'm@example.com' }),
                ),
                createElement('div', { className: 'grid gap-2' },
                    createElement(Label, { htmlFor: 's01-pass' }, 'Password'),
                    createElement(Input, { id: 's01-pass', type: 'password' }),
                ),
                createElement(Button, { type: 'submit', className: 'w-full' }, 'Create an account'),
                createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GitHubIcon, null), 'Sign up with GitHub'),
            ),
        ),
        createElement(CardFooter, { className: 'justify-center text-sm' },
            'Already have an account? ',
            createElement('a', { href: '#', className: 'underline underline-offset-4 ml-1' }, 'Sign in'),
        ),
    );
}

function Signup02Demo() {
    return createElement('div', { className: 'grid lg:grid-cols-2 min-h-[500px] rounded-xl border overflow-hidden' },
        createElement('div', { className: 'flex flex-col gap-4 p-6' },
            createElement('div', { className: 'flex items-center gap-2 font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', { className: 'flex flex-1 items-center justify-center' },
                createElement('div', { className: 'w-full max-w-xs' },
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'grid gap-2 text-center' },
                            createElement('h1', { className: 'text-2xl font-bold' }, 'Create an account'),
                            createElement('p', { className: 'text-sm text-muted-foreground' }, 'Enter your details below'),
                        ),
                        createElement('div', { className: 'grid grid-cols-2 gap-4' },
                            createElement(Button, { variant: 'outline' }, createElement(GoogleIcon, null), 'Google'),
                            createElement(Button, { variant: 'outline' }, createElement(GitHubIcon, null), 'GitHub'),
                        ),
                        createElement(OrDivider, { bg: 'bg-background' }),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 's02-email' }, 'Email'),
                            createElement(Input, { id: 's02-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 's02-pass' }, 'Password'),
                            createElement(Input, { id: 's02-pass', type: 'password' }),
                        ),
                        createElement(Button, { type: 'submit', className: 'w-full' }, 'Create account'),
                    ),
                    createElement('div', { className: 'text-center text-sm mt-4' },
                        'Already have an account? ',
                        createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign in'),
                    ),
                ),
            ),
        ),
        createElement(ImagePanel, null),
    );
}

function Signup03Demo() {
    return createElement('div', { className: 'flex flex-col items-center justify-center gap-6 bg-muted rounded-xl p-6 min-h-[500px]' },
        createElement('div', { className: 'flex w-full max-w-sm flex-col gap-6' },
            createElement('a', { href: '#', className: 'flex items-center gap-2 self-center font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement(Card, null,
                createElement(CardHeader, { className: 'text-center' },
                    createElement(CardTitle, { className: 'text-xl' }, 'Create an account'),
                    createElement(CardDescription, null, 'Enter your details below to get started'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-6' },
                        createElement('div', { className: 'grid grid-cols-2 gap-4' },
                            createElement('div', { className: 'grid gap-2' },
                                createElement(Label, { htmlFor: 's03-fn' }, 'First name'),
                                createElement(Input, { id: 's03-fn', placeholder: 'Max' }),
                            ),
                            createElement('div', { className: 'grid gap-2' },
                                createElement(Label, { htmlFor: 's03-ln' }, 'Last name'),
                                createElement(Input, { id: 's03-ln', placeholder: 'Robinson' }),
                            ),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 's03-email' }, 'Email'),
                            createElement(Input, { id: 's03-email', type: 'email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 's03-pass' }, 'Password'),
                            createElement(Input, { id: 's03-pass', type: 'password' }),
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
        createElement('div', { className: 'text-center text-xs text-muted-foreground' },
            'By clicking continue, you agree to our Terms of Service and Privacy Policy.',
        ),
    );
}

function Signup04Demo() {
    return createElement('div', { className: 'grid lg:grid-cols-2 min-h-[500px] rounded-xl border overflow-hidden' },
        createElement('div', { className: 'flex flex-col gap-4 p-6' },
            createElement('div', { className: 'flex items-center gap-2 font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', { className: 'flex flex-1 items-center justify-center' },
                createElement('div', { className: 'w-full max-w-sm' },
                    createElement(Card, null,
                        createElement(CardHeader, null,
                            createElement(CardTitle, { className: 'text-2xl' }, 'Create an account'),
                            createElement(CardDescription, null, 'Enter your details to get started'),
                        ),
                        createElement(CardContent, null,
                            createElement('div', { className: 'grid gap-6' },
                                createElement('div', { className: 'grid grid-cols-2 gap-4' },
                                    createElement('div', { className: 'grid gap-2' },
                                        createElement(Label, { htmlFor: 's04-fn' }, 'First name'),
                                        createElement(Input, { id: 's04-fn', placeholder: 'Max' }),
                                    ),
                                    createElement('div', { className: 'grid gap-2' },
                                        createElement(Label, { htmlFor: 's04-ln' }, 'Last name'),
                                        createElement(Input, { id: 's04-ln', placeholder: 'Robinson' }),
                                    ),
                                ),
                                createElement('div', { className: 'grid gap-2' },
                                    createElement(Label, { htmlFor: 's04-email' }, 'Email'),
                                    createElement(Input, { id: 's04-email', type: 'email', placeholder: 'm@example.com' }),
                                ),
                                createElement('div', { className: 'grid gap-2' },
                                    createElement(Label, { htmlFor: 's04-pass' }, 'Password'),
                                    createElement(Input, { id: 's04-pass', type: 'password' }),
                                ),
                                createElement(Button, { type: 'submit', className: 'w-full' }, 'Create account'),
                                createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GoogleIcon, null), 'Sign up with Google'),
                            ),
                        ),
                    ),
                    createElement('div', { className: 'mt-4 text-center text-sm' },
                        'Already have an account? ',
                        createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign in'),
                    ),
                ),
            ),
        ),
        createElement(ImagePanel, null),
    );
}

function Signup05Demo() {
    return createElement('div', { className: 'flex flex-col items-center justify-center gap-6 rounded-xl border p-6 min-h-[500px]' },
        createElement('div', { className: 'flex w-full max-w-sm flex-col gap-6' },
            createElement('a', { href: '#', className: 'flex items-center gap-2 self-center font-medium' }, createElement(LogoIcon, null), 'Acme Inc.'),
            createElement('div', null,
                createElement('div', { className: 'grid gap-6' },
                    createElement('div', { className: 'grid gap-2 text-center' },
                        createElement('h1', { className: 'text-2xl font-bold' }, 'Create your account'),
                        createElement('p', { className: 'text-sm text-muted-foreground' }, 'Enter your details below'),
                    ),
                    createElement('div', { className: 'grid grid-cols-3 gap-4' },
                        createElement(Button, { variant: 'outline' }, createElement(AppleIcon, null)),
                        createElement(Button, { variant: 'outline' }, createElement(GoogleIcon, null)),
                        createElement(Button, { variant: 'outline' }, createElement(GitHubIcon, null)),
                    ),
                    createElement(OrDivider, { bg: 'bg-background' }),
                    createElement('div', { className: 'grid grid-cols-2 gap-4' },
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 's05-fn' }, 'First name'),
                            createElement(Input, { id: 's05-fn', placeholder: 'Max' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 's05-ln' }, 'Last name'),
                            createElement(Input, { id: 's05-ln', placeholder: 'Robinson' }),
                        ),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 's05-email' }, 'Email'),
                        createElement(Input, { id: 's05-email', type: 'email', placeholder: 'm@example.com' }),
                    ),
                    createElement('div', { className: 'grid gap-2' },
                        createElement(Label, { htmlFor: 's05-pass' }, 'Password'),
                        createElement(Input, { id: 's05-pass', type: 'password' }),
                    ),
                    createElement(Button, { type: 'submit', className: 'w-full' }, 'Create account'),
                ),
                createElement('div', { className: 'text-center text-sm mt-4' },
                    'Already have an account? ',
                    createElement('a', { href: '#', className: 'underline underline-offset-4' }, 'Sign in'),
                ),
            ),
        ),
        createElement('div', { className: 'text-center text-xs text-muted-foreground' },
            'By clicking continue, you agree to our Terms of Service and Privacy Policy.',
        ),
    );
}

// ---------------------------------------------------------------------------
// BlocksPage — main export
// ---------------------------------------------------------------------------

export function BlocksPage() {
    return createElement('div', { className: 'space-y-12' },
        createElement(PageHeader, {
            title: 'Blocks',
            description: 'Pre-built authentication page layouts. Compose them from blazecn Card, Button, Input, Label, and Separator components.',
        }),

        // --- Login Blocks ---
        createElement(SectionHeading, { id: 'login' }, 'Login'),

        createElement('div', { className: 'space-y-8' },
            // login-01
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'login-01'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Classic centered card with social login providers, email/password, and a forgot password link.',
                ),
                createElement(DemoBox, { className: 'block py-8' }, createElement(Login01Demo, null)),
            ),

            // login-02
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'login-02'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Split-screen layout with the form on the left and a decorative panel on the right.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Login02Demo, null)),
            ),

            // login-03
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'login-03'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Card form on a muted background with Apple, Google, and GitHub social providers.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Login03Demo, null)),
            ),

            // login-04
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'login-04'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Split-screen with a card-wrapped login form on the left and decorative panel on the right.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Login04Demo, null)),
            ),

            // login-05
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'login-05'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Minimal login form with logo, icon-only social providers, and no card wrapper.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Login05Demo, null)),
            ),
        ),

        // --- Signup Blocks ---
        createElement(SectionHeading, { id: 'signup' }, 'Signup'),

        createElement('div', { className: 'space-y-8' },
            // signup-01
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'signup-01'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Classic centered card with first/last name, email, password, and a GitHub social button.',
                ),
                createElement(DemoBox, { className: 'block py-8' }, createElement(Signup01Demo, null)),
            ),

            // signup-02
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'signup-02'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Split-screen layout with Google/GitHub social providers and form on the left.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Signup02Demo, null)),
            ),

            // signup-03
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'signup-03'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Card signup with centered header on a muted background.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Signup03Demo, null)),
            ),

            // signup-04
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'signup-04'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Split-screen with a card-wrapped signup form and decorative panel.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Signup04Demo, null)),
            ),

            // signup-05
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'signup-05'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Minimal signup form with icon-only social providers, name fields, and no card wrapper.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Signup05Demo, null)),
            ),
        ),

        // --- Dashboard Blocks ---
        createElement(SectionHeading, { id: 'dashboard' }, 'Dashboard'),

        createElement('div', { className: 'space-y-8' },
            // dashboard-01
            createElement('div', { className: 'space-y-3' },
                createElement('h3', { className: 'text-lg font-semibold' }, 'dashboard-01'),
                createElement('p', { className: 'text-sm text-muted-foreground' },
                    'Full dashboard layout with stat cards, interactive Chart.js area chart, sortable data table, and sidebar navigation.',
                ),
                createElement(DemoBox, { className: 'block !p-0 overflow-hidden' }, createElement(Dashboard01Demo, null)),
            ),
        ),

        // --- Usage code ---
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
