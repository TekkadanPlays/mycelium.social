import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Link } from 'inferno-router';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Badge } from '../ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/Select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/DropdownMenu';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';

// ── Icons ──

function LogoIcon() {
    return createElement('div', { className: 'flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground' },
        createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-4' },
            createElement('path', { d: 'M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' })),
    );
}

function SearchIcon() {
    return createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-4' },
        createElement('circle', { cx: '11', cy: '11', r: '8' }),
        createElement('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
    );
}

function DotsIcon() {
    return createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-4' },
        createElement('circle', { cx: '12', cy: '12', r: '1' }),
        createElement('circle', { cx: '19', cy: '12', r: '1' }),
        createElement('circle', { cx: '5', cy: '12', r: '1' }),
    );
}

function CheckIcon() {
    return createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-4 text-green-500' },
        createElement('path', { d: 'M20 6 9 17l-5-5' }),
    );
}

function AppleIcon() {
    return createElement('svg', { viewBox: '0 0 24 24', className: 'size-5' },
        createElement('path', { fill: 'currentColor', d: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701' }),
    );
}

function GoogleIcon() {
    return createElement('svg', { viewBox: '0 0 24 24', className: 'size-5' },
        createElement('path', { fill: 'currentColor', d: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' }),
    );
}

function GitHubIcon() {
    return createElement('svg', { viewBox: '0 0 24 24', className: 'size-5', fill: 'currentColor' },
        createElement('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' }),
    );
}

// ── Example: Dashboard ──

function DashboardExample() {
    const stats = [
        { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month' },
        { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month' },
        { title: 'Sales', value: '+12,234', change: '+19% from last month' },
        { title: 'Active Now', value: '+573', change: '+201 since last hour' },
    ];

    const recent = [
        { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
        { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
        { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
        { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
        { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
    ];

    return createElement('div', { className: 'space-y-4' },
        createElement('div', { className: 'flex items-center justify-between' },
            createElement('h2', { className: 'text-3xl font-bold tracking-tight' }, 'Dashboard'),
            createElement('div', { className: 'flex items-center gap-2' },
                createElement(Button, { variant: 'outline', size: 'sm' }, 'Download'),
            ),
        ),
        createElement('div', { className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-4' },
            ...stats.map((s) =>
                createElement(Card, { key: s.title },
                    createElement(CardHeader, { className: 'pb-2' },
                        createElement(CardDescription, null, s.title),
                    ),
                    createElement(CardContent, null,
                        createElement('div', { className: 'text-2xl font-bold' }, s.value),
                        createElement('p', { className: 'text-xs text-muted-foreground' }, s.change),
                    ),
                ),
            ),
        ),
        createElement('div', { className: 'grid gap-4 md:grid-cols-2 lg:grid-cols-7' },
            createElement(Card, { className: 'col-span-4' },
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Overview'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'h-[200px] flex items-end gap-1' },
                        ...[40, 30, 55, 45, 60, 35, 70, 50, 80, 45, 65, 50].map((h, i) =>
                            createElement('div', {
                                key: i,
                                className: 'flex-1 bg-primary/80 rounded-t-sm transition-all hover:bg-primary',
                                style: { height: `${h}%` },
                            }),
                        ),
                    ),
                    createElement('div', { className: 'flex justify-between mt-2 text-xs text-muted-foreground' },
                        ...['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) =>
                            createElement('span', { key: m }, m),
                        ),
                    ),
                ),
            ),
            createElement(Card, { className: 'col-span-3' },
                createElement(CardHeader, null, createElement(CardTitle, null, 'Recent Sales'),
                    createElement(CardDescription, null, 'You made 265 sales this month.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        ...recent.map((r) =>
                            createElement('div', { key: r.email, className: 'flex items-center gap-3' },
                                createElement(Avatar, { className: 'size-9' },
                                    createElement(AvatarFallback, { className: 'text-xs' }, r.name.split(' ').map((n: string) => n[0]).join('')),
                                ),
                                createElement('div', { className: 'flex-1 min-w-0' },
                                    createElement('p', { className: 'text-sm font-medium leading-none' }, r.name),
                                    createElement('p', { className: 'text-sm text-muted-foreground truncate' }, r.email),
                                ),
                                createElement('div', { className: 'font-medium' }, r.amount),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    );
}

// ── Example: Cards — full component showcase ──

function CardsExample() {
    return createElement('div', { className: 'space-y-8' },
        // Row 1: Hero cards
        createElement('div', { className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' },
            // Create account card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Create an account'),
                    createElement(CardDescription, null, 'Enter your email below to create your account'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-4' },
                        createElement('div', { className: 'grid grid-cols-2 gap-4' },
                            createElement(Button, { variant: 'outline' }, createElement(GitHubIcon, null), 'GitHub'),
                            createElement(Button, { variant: 'outline' }, createElement(GoogleIcon, null), 'Google'),
                        ),
                        createElement('div', { className: 'relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border' },
                            createElement('span', { className: 'relative z-10 bg-card px-2 text-muted-foreground' }, 'Or continue with'),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'ex-email' }, 'Email'),
                            createElement(Input, { id: 'ex-email', placeholder: 'm@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, { htmlFor: 'ex-pass' }, 'Password'),
                            createElement(Input, { id: 'ex-pass', type: 'password' }),
                        ),
                    ),
                ),
                createElement(CardFooter, null, createElement(Button, { className: 'w-full' }, 'Create account')),
            ),

            // Payment method card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Payment Method'),
                    createElement(CardDescription, null, 'Add a new payment method to your account.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-4' },
                        createElement('div', { className: 'grid grid-cols-3 gap-3' },
                            ...['Card', 'Paypal', 'Apple'].map((m) =>
                                createElement('button', {
                                    key: m,
                                    type: 'button',
                                    className: `flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition-colors cursor-pointer ${m === 'Card' ? 'border-primary bg-primary/5' : 'hover:bg-accent'}`,
                                }, m === 'Card' ? '\uD83D\uDCB3' : m === 'Paypal' ? '\uD83C\uDF10' : '\uF8FF', m),
                            ),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Name'),
                            createElement(Input, { placeholder: 'First Last' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Card number'),
                            createElement(Input, { placeholder: '1234 5678 9012 3456' }),
                        ),
                        createElement('div', { className: 'grid grid-cols-3 gap-4' },
                            createElement('div', { className: 'grid gap-2 col-span-1' },
                                createElement(Label, null, 'Expires'),
                                createElement(Input, { placeholder: 'MM/YY' }),
                            ),
                            createElement('div', { className: 'grid gap-2 col-span-1' },
                                createElement(Label, null, 'CVC'),
                                createElement(Input, { placeholder: '123' }),
                            ),
                            createElement('div', { className: 'col-span-1' }),
                        ),
                    ),
                ),
                createElement(CardFooter, null, createElement(Button, { className: 'w-full' }, 'Continue')),
            ),

            // Team members card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Team Members'),
                    createElement(CardDescription, null, 'Invite your team members to collaborate.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        ...[{ n: 'Sofia Davis', e: 'm@example.com', r: 'Owner' },
                        { n: 'Jackson Lee', e: 'p@example.com', r: 'Member' },
                        { n: 'Isabella Nguyen', e: 'i@example.com', r: 'Member' },
                        ].map((m) =>
                            createElement('div', { key: m.e, className: 'flex items-center gap-3' },
                                createElement(Avatar, { className: 'size-8' },
                                    createElement(AvatarFallback, { className: 'text-xs' }, m.n.split(' ').map((x: string) => x[0]).join('')),
                                ),
                                createElement('div', { className: 'flex-1 min-w-0' },
                                    createElement('p', { className: 'text-sm font-medium' }, m.n),
                                    createElement('p', { className: 'text-xs text-muted-foreground' }, m.e),
                                ),
                                createElement(Badge, { variant: 'outline' }, m.r),
                            ),
                        ),
                    ),
                ),
            ),
        ),

        // Row 2: Buttons, Badges, Avatars showcase
        createElement('div', { className: 'grid gap-6 md:grid-cols-2' },
            // Buttons showcase
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Buttons'),
                    createElement(CardDescription, null, 'All button variants and sizes.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        createElement('div', { className: 'flex flex-wrap items-center gap-2' },
                            createElement(Button, null, 'Primary'),
                            createElement(Button, { variant: 'secondary' }, 'Secondary'),
                            createElement(Button, { variant: 'destructive' }, 'Destructive'),
                            createElement(Button, { variant: 'outline' }, 'Outline'),
                            createElement(Button, { variant: 'ghost' }, 'Ghost'),
                            createElement(Button, { variant: 'link' }, 'Link'),
                        ),
                        createElement('div', { className: 'flex flex-wrap items-center gap-2' },
                            createElement(Button, { size: 'lg' }, 'Large'),
                            createElement(Button, null, 'Default'),
                            createElement(Button, { size: 'sm' }, 'Small'),
                            createElement(Button, { size: 'icon' }, '\u2764'),
                        ),
                        createElement('div', { className: 'flex flex-wrap items-center gap-2' },
                            createElement(Button, { disabled: true }, 'Disabled'),
                            createElement(Button, { variant: 'outline', disabled: true }, 'Disabled'),
                        ),
                    ),
                ),
            ),

            // Badges & Avatars
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Badges & Avatars'),
                    createElement(CardDescription, null, 'Status indicators and user avatars.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        createElement('div', { className: 'flex flex-wrap items-center gap-2' },
                            createElement(Badge, null, 'Default'),
                            createElement(Badge, { variant: 'secondary' }, 'Secondary'),
                            createElement(Badge, { variant: 'destructive' }, 'Destructive'),
                            createElement(Badge, { variant: 'outline' }, 'Outline'),
                        ),
                        createElement(Separator, null),
                        createElement('div', { className: 'flex items-center gap-3' },
                            ...[
                                { f: 'OM', n: 'Olivia' }, { f: 'JL', n: 'Jackson' }, { f: 'IN', n: 'Isabella' },
                                { f: 'WK', n: 'William' }, { f: 'SD', n: 'Sofia' },
                            ].map((u) =>
                                createElement('div', { key: u.f, className: 'flex flex-col items-center gap-1' },
                                    createElement(Avatar, { className: 'size-10' },
                                        createElement(AvatarFallback, { className: 'text-xs' }, u.f),
                                    ),
                                    createElement('span', { className: 'text-[10px] text-muted-foreground' }, u.n),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),

        // Row 3: Notifications, Report, Share
        createElement('div', { className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' },
            // Notifications card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Notifications'),
                    createElement(CardDescription, null, 'Choose what you want to be notified about.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        ...[{ t: 'Everything', d: 'Email digest, mentions & all activity.' },
                        { t: 'Available', d: 'Only mentions and comments.' },
                        { t: 'Ignoring', d: 'Turn off all notifications.' },
                        ].map((n, i) =>
                            createElement('div', { key: n.t, className: 'flex items-center gap-3' },
                                createElement('div', { className: `size-4 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-primary' : 'border-muted-foreground/30'}` },
                                    i === 0 ? createElement('div', { className: 'size-2 rounded-full bg-primary' }) : null,
                                ),
                                createElement('div', null,
                                    createElement('p', { className: 'text-sm font-medium' }, n.t),
                                    createElement('p', { className: 'text-xs text-muted-foreground' }, n.d),
                                ),
                            ),
                        ),
                    ),
                ),
            ),

            // Report issue card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Report an issue'),
                    createElement(CardDescription, null, 'What area are you having problems with?'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-4' },
                        createElement('div', { className: 'grid grid-cols-2 gap-4' },
                            createElement('div', { className: 'grid gap-2' }, createElement(Label, null, 'Area'), createElement(Input, { placeholder: 'Billing' })),
                            createElement('div', { className: 'grid gap-2' }, createElement(Label, null, 'Security Level'), createElement(Input, { placeholder: 'Severity 2' })),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Subject'),
                            createElement(Input, { placeholder: 'I need help with...' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Description'),
                            createElement('textarea', { className: 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', placeholder: 'Please include all information relevant to your issue.' }),
                        ),
                    ),
                ),
                createElement(CardFooter, { className: 'justify-between' },
                    createElement(Button, { variant: 'ghost' }, 'Cancel'),
                    createElement(Button, null, 'Submit'),
                ),
            ),

            // Share document card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Share this document'),
                    createElement(CardDescription, null, 'Anyone with the link can view this document.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid gap-4' },
                        createElement('div', { className: 'flex gap-2' },
                            createElement(Input, { value: 'http://example.com/link/to/document', readOnly: true, className: 'flex-1' }),
                            createElement(Button, { variant: 'secondary', size: 'sm' }, 'Copy'),
                        ),
                        createElement(Separator, null),
                        createElement('p', { className: 'text-sm font-medium' }, 'People with access'),
                        ...[{ n: 'Olivia Martin', e: 'a@example.com', r: 'Can edit' },
                        { n: 'Isabella Nguyen', e: 'b@example.com', r: 'Can view' },
                        { n: 'Sofia Davis', e: 'c@example.com', r: 'Can view' },
                        ].map((p) =>
                            createElement('div', { key: p.e, className: 'flex items-center gap-3' },
                                createElement(Avatar, { className: 'size-8' },
                                    createElement(AvatarFallback, { className: 'text-xs' }, p.n.split(' ').map((x: string) => x[0]).join('')),
                                ),
                                createElement('div', { className: 'flex-1 min-w-0' },
                                    createElement('p', { className: 'text-sm font-medium' }, p.n),
                                    createElement('p', { className: 'text-xs text-muted-foreground' }, p.e),
                                ),
                                createElement(Badge, { variant: 'outline', className: 'text-xs' }, p.r),
                            ),
                        ),
                    ),
                ),
            ),
        ),

        // Row 4: Data display — mini chart + progress + stats
        createElement('div', { className: 'grid gap-6 md:grid-cols-2' },
            // Chart card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Overview'),
                    createElement(CardDescription, null, 'Monthly activity for the current year.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'h-[180px] flex items-end gap-1' },
                        ...[40, 30, 55, 45, 60, 35, 70, 50, 80, 45, 65, 50].map((h, i) =>
                            createElement('div', {
                                key: i,
                                className: 'flex-1 bg-primary/80 rounded-t-sm transition-all hover:bg-primary',
                                style: { height: `${h}%` },
                            }),
                        ),
                    ),
                    createElement('div', { className: 'flex justify-between mt-2 text-xs text-muted-foreground' },
                        ...['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) =>
                            createElement('span', { key: m }, m),
                        ),
                    ),
                ),
            ),

            // Progress / stats card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Goals'),
                    createElement(CardDescription, null, 'Track your weekly progress.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        ...[
                            { label: 'Calories burned', current: 562, target: 800 },
                            { label: 'Steps taken', current: 7234, target: 10000 },
                            { label: 'Active minutes', current: 45, target: 60 },
                            { label: 'Water intake', current: 6, target: 8 },
                        ].map((g) => {
                            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                            return createElement('div', { key: g.label, className: 'space-y-1' },
                                createElement('div', { className: 'flex items-center justify-between text-sm' },
                                    createElement('span', null, g.label),
                                    createElement('span', { className: 'text-muted-foreground tabular-nums' }, `${g.current.toLocaleString()} / ${g.target.toLocaleString()}`),
                                ),
                                createElement('div', { className: 'h-2 rounded-full bg-muted overflow-hidden' },
                                    createElement('div', {
                                        className: `h-full rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : pct >= 60 ? 'bg-primary' : 'bg-amber-500'}`,
                                        style: { width: `${pct}%` },
                                    }),
                                ),
                            );
                        }),
                    ),
                ),
            ),
        ),

        // Row 5: Cookie consent + Pricing + Activity
        createElement('div', { className: 'grid gap-6 md:grid-cols-3' },
            // Cookie consent
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Cookie Settings'),
                    createElement(CardDescription, null, 'Manage your cookie preferences.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-3' },
                        ...[
                            { t: 'Strictly Necessary', d: 'Essential for the website to function.', on: true },
                            { t: 'Functional', d: 'Enable personalized features.', on: true },
                            { t: 'Performance', d: 'Help us improve the site.', on: false },
                        ].map((c) =>
                            createElement('div', { key: c.t, className: 'flex items-center justify-between' },
                                createElement('div', null,
                                    createElement('p', { className: 'text-sm font-medium' }, c.t),
                                    createElement('p', { className: 'text-xs text-muted-foreground' }, c.d),
                                ),
                                createElement('div', {
                                    className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.on ? 'bg-primary' : 'bg-muted'}`,
                                },
                                    createElement('span', {
                                        className: `inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${c.on ? 'translate-x-4' : 'translate-x-0.5'}`,
                                    }),
                                ),
                            ),
                        ),
                    ),
                ),
                createElement(CardFooter, null, createElement(Button, { className: 'w-full' }, 'Save preferences')),
            ),

            // Pricing card
            createElement(Card, null,
                createElement(CardHeader, { className: 'text-center' },
                    createElement(CardTitle, null, 'Pro'),
                    createElement(CardDescription, null, 'For growing teams'),
                    createElement('div', { className: 'mt-2' },
                        createElement('span', { className: 'text-4xl font-bold' }, '$29'),
                        createElement('span', { className: 'text-muted-foreground' }, '/month'),
                    ),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-2' },
                        ...[
                            'Unlimited projects', '50GB storage', 'Priority support',
                            'Advanced analytics', 'Custom domains', 'Team collaboration',
                        ].map((f) =>
                            createElement('div', { key: f, className: 'flex items-center gap-2 text-sm' },
                                createElement(CheckIcon, null),
                                f,
                            ),
                        ),
                    ),
                ),
                createElement(CardFooter, null, createElement(Button, { className: 'w-full' }, 'Get started')),
            ),

            // Recent activity
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Recent Activity'),
                    createElement(CardDescription, null, 'Your latest actions.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-3' },
                        ...[
                            { a: 'Deployed to production', t: '2 minutes ago', i: '\uD83D\uDE80' },
                            { a: 'Merged pull request #42', t: '1 hour ago', i: '\uD83D\uDD00' },
                            { a: 'Added new team member', t: '3 hours ago', i: '\uD83D\uDC64' },
                            { a: 'Updated billing info', t: 'Yesterday', i: '\uD83D\uDCB3' },
                            { a: 'Created new project', t: '2 days ago', i: '\uD83D\uDCC1' },
                        ].map((a) =>
                            createElement('div', { key: a.a, className: 'flex items-center gap-3' },
                                createElement('span', { className: 'text-lg' }, a.i),
                                createElement('div', { className: 'flex-1 min-w-0' },
                                    createElement('p', { className: 'text-sm font-medium truncate' }, a.a),
                                    createElement('p', { className: 'text-xs text-muted-foreground' }, a.t),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),

        // Row 6: Calendar + Separator showcase
        createElement('div', { className: 'grid gap-6 md:grid-cols-2' },
            // Calendar-like card
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'February 2026'),
                    createElement(CardDescription, null, 'Your schedule at a glance.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'grid grid-cols-7 gap-1 text-center text-xs' },
                        ...['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) =>
                            createElement('div', { key: d, className: 'h-8 flex items-center justify-center font-medium text-muted-foreground' }, d),
                        ),
                        ...Array.from({ length: 28 }, (_, i) => i + 1).map((d) =>
                            createElement('button', {
                                key: d, type: 'button',
                                className: `h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${d === 18 ? 'bg-primary text-primary-foreground font-medium' : d === 14 || d === 22 ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}`,
                            }, String(d)),
                        ),
                    ),
                ),
            ),

            // Inputs & forms showcase
            createElement(Card, null,
                createElement(CardHeader, null,
                    createElement(CardTitle, null, 'Form Elements'),
                    createElement(CardDescription, null, 'Common form patterns.'),
                ),
                createElement(CardContent, null,
                    createElement('div', { className: 'space-y-4' },
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Email'),
                            createElement(Input, { type: 'email', placeholder: 'you@example.com' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Password'),
                            createElement(Input, { type: 'password', placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' }),
                        ),
                        createElement('div', { className: 'grid gap-2' },
                            createElement(Label, null, 'Message'),
                            createElement('textarea', {
                                className: 'flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                placeholder: 'Type your message...',
                            }),
                        ),
                        createElement('div', { className: 'flex items-center gap-2' },
                            createElement('div', { className: 'size-4 rounded border-2 border-primary flex items-center justify-center' },
                                createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '3', className: 'size-3 text-primary' },
                                    createElement('path', { d: 'M20 6 9 17l-5-5' }),
                                ),
                            ),
                            createElement('span', { className: 'text-sm' }, 'I agree to the terms and conditions'),
                        ),
                        createElement(Button, { className: 'w-full' }, 'Submit'),
                    ),
                ),
            ),
        ),
    );
}

// ── Example: Authentication ──

function AuthenticationExample() {
    return createElement('div', { className: 'flex min-h-[600px] items-center justify-center' },
        createElement('div', { className: 'mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]' },
            createElement('div', { className: 'flex flex-col space-y-2 text-center' },
                createElement(LogoIcon, null),
                createElement('h1', { className: 'text-2xl font-semibold tracking-tight' }, 'Create an account'),
                createElement('p', { className: 'text-sm text-muted-foreground' }, 'Enter your email below to create your account'),
            ),
            createElement('div', { className: 'grid gap-6' },
                createElement('div', { className: 'grid gap-2' },
                    createElement(Label, { htmlFor: 'auth-email' }, 'Email'),
                    createElement(Input, { id: 'auth-email', type: 'email', placeholder: 'name@example.com' }),
                ),
                createElement(Button, { className: 'w-full' }, 'Sign In with Email'),
                createElement('div', { className: 'relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border' },
                    createElement('span', { className: 'relative z-10 bg-background px-2 text-muted-foreground' }, 'Or continue with'),
                ),
                createElement(Button, { variant: 'outline', className: 'w-full' }, createElement(GitHubIcon, null), 'GitHub'),
            ),
            createElement('p', { className: 'px-8 text-center text-sm text-muted-foreground' },
                'By clicking continue, you agree to our ',
                createElement('a', { href: '#', className: 'underline underline-offset-4 hover:text-primary' }, 'Terms of Service'),
                ' and ',
                createElement('a', { href: '#', className: 'underline underline-offset-4 hover:text-primary' }, 'Privacy Policy'),
                '.',
            ),
        ),
    );
}

// ── Example: Tasks ──

function TasksExample() {
    const tasks = [
        { id: 'TASK-8782', type: 'Documentation', title: 'You can\'t compress the program without quantifying the open-source SSD...', status: 'In Progress', priority: 'Medium' },
        { id: 'TASK-7878', type: 'Documentation', title: 'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!', status: 'Backlog', priority: 'Medium' },
        { id: 'TASK-7839', type: 'Bug', title: 'We need to bypass the neural TCP card!', status: 'Todo', priority: 'High' },
        { id: 'TASK-5562', type: 'Feature', title: 'The SAS interface is down, bypass the open-source sensor so we can...', status: 'Backlog', priority: 'Medium' },
        { id: 'TASK-8686', type: 'Feature', title: 'I\'ll parse the wireless SSL protocol, that should driver the API panel!', status: 'Canceled', priority: 'Medium' },
        { id: 'TASK-1280', type: 'Bug', title: 'Use the digital TLS panel, then you can transmit the haptic system!', status: 'Done', priority: 'High' },
        { id: 'TASK-7262', type: 'Feature', title: 'The UTF8 application is down, parse the neural bandwidth so we can...', status: 'Done', priority: 'High' },
        { id: 'TASK-1138', type: 'Feature', title: 'Generating the driver won\'t do anything, we need to quantify the 1080p...', status: 'In Progress', priority: 'Medium' },
    ];

    return createElement('div', { className: 'space-y-4' },
        createElement('div', null,
            createElement('h2', { className: 'text-2xl font-bold tracking-tight' }, 'Welcome back!'),
            createElement('p', { className: 'text-muted-foreground' }, 'Here\u2019s a list of your tasks for this month!'),
        ),
        createElement('div', { className: 'flex items-center gap-2' },
            createElement(Input, { placeholder: 'Filter tasks...', className: 'max-w-sm' }),
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Status'),
            createElement(Button, { variant: 'outline', size: 'sm' }, 'Priority'),
        ),
        createElement('div', { className: 'rounded-lg border' },
            createElement(Table, null,
                createElement(TableHeader, null,
                    createElement(TableRow, null,
                        createElement(TableHead, { className: 'w-[100px]' }, 'Task'),
                        createElement(TableHead, null, 'Title'),
                        createElement(TableHead, null, 'Status'),
                        createElement(TableHead, null, 'Priority'),
                        createElement(TableHead, { className: 'w-8' }, ''),
                    ),
                ),
                createElement(TableBody, null,
                    ...tasks.map((t) =>
                        createElement(TableRow, { key: t.id },
                            createElement(TableCell, { className: 'font-medium' }, t.id),
                            createElement(TableCell, null,
                                createElement('div', { className: 'flex items-center gap-2' },
                                    createElement(Badge, { variant: 'outline', className: 'text-xs' }, t.type),
                                    createElement('span', { className: 'max-w-[400px] truncate' }, t.title),
                                ),
                            ),
                            createElement(TableCell, null,
                                createElement(Badge, {
                                    variant: t.status === 'Done' ? 'default' : t.status === 'Canceled' ? 'destructive' : 'outline',
                                    className: 'text-xs',
                                }, t.status),
                            ),
                            createElement(TableCell, null, t.priority),
                            createElement(TableCell, null,
                                createElement(Button, { variant: 'ghost', size: 'icon', className: 'size-7' }, createElement(DotsIcon, null)),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        createElement('div', { className: 'flex items-center justify-between text-sm text-muted-foreground' },
            `${tasks.length} task(s) total.`,
            createElement('div', { className: 'flex items-center gap-2' },
                createElement(Button, { variant: 'outline', size: 'sm', disabled: true }, '\u2190'),
                createElement('span', null, 'Page 1 of 1'),
                createElement(Button, { variant: 'outline', size: 'sm', disabled: true }, '\u2192'),
            ),
        ),
    );
}

// ── Main page ──

interface ExamplesState { active: string; }

const EXAMPLES_TABS = [
    { value: 'examples', label: 'Examples' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'tasks', label: 'Tasks' },
    { value: 'authentication', label: 'Authentication' },
];

export class ExamplesPage extends Component<{}, ExamplesState> {
    declare state: ExamplesState;
    constructor(props: {}) {
        super(props);
        this.state = { active: 'examples' };
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
                            createElement(Link, { to: '/docs/blazecn', className: 'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors' },
                                createElement('span', { className: 'size-1.5 rounded-full bg-primary animate-pulse' }),
                                'Introducing blazecn for InfernoJS',
                                createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', className: 'size-3' },
                                    createElement('path', { d: 'M5 12h14' }),
                                    createElement('path', { d: 'M12 5l7 7-7 7' }),
                                ),
                            ),
                        ),
                        // Heading
                        createElement('h1', { className: 'text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl' },
                            'The Foundation for your',
                            createElement('br', null),
                            'Design System',
                        ),
                        // Description
                        createElement('p', { className: 'mx-auto max-w-2xl text-center text-lg text-muted-foreground' },
                            'A set of beautifully designed components that you can customize, extend, and build on. ',
                            'Start here then make it your own. Open Source. Open Code.',
                        ),
                        // CTA buttons
                        createElement('div', { className: 'flex items-center justify-center gap-3' },
                            createElement(Link, { to: '/docs/blazecn' },
                                createElement(Button, { size: 'sm', className: 'h-8 rounded-lg' }, 'Get Started'),
                            ),
                            createElement(Link, { to: '/docs/blazecn/components' },
                                createElement(Button, { variant: 'ghost', size: 'sm', className: 'h-8 rounded-lg' }, 'View Components'),
                            ),
                        ),
                    ),
                ),
            ),

            // ── Examples nav — sticky tab bar ──
            createElement('div', { className: 'sticky top-14 z-30 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' },
                createElement('div', { className: 'mx-auto max-w-[1400px] px-4 sm:px-6' },
                    createElement('div', { className: 'flex items-center gap-4 overflow-x-auto -mb-px' },
                        ...EXAMPLES_TABS.map((t) =>
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
                    createElement('div', { className: 'rounded-xl border bg-background overflow-hidden' },
                        active === 'examples'
                            ? createElement('div', { className: 'p-6 md:p-8' }, createElement(CardsExample, null))
                            : null,
                        active === 'dashboard'
                            ? createElement('div', { className: 'p-6 md:p-8' }, createElement(DashboardExample, null))
                            : null,
                        active === 'tasks'
                            ? createElement('div', { className: 'p-6 md:p-8' }, createElement(TasksExample, null))
                            : null,
                        active === 'authentication'
                            ? createElement(AuthenticationExample, null)
                            : null,
                    ),
                ),
            ),
        );
    }
}
