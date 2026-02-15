# Blazecn

**A shadcn/ui-compatible component library for InfernoJS.**

Blazecn brings the design language, token system, and component patterns of [shadcn/ui](https://ui.shadcn.com) to [InfernoJS](https://infernojs.org) — the fastest JavaScript UI library. No React dependency. No Radix. Just pure `createElement` components with Tailwind CSS v4 and `class-variance-authority`.

## Why Blazecn?

- **shadcn-compatible tokens** — Same CSS custom properties (`--background`, `--foreground`, `--primary`, `--muted`, etc.)
- **Same class strings** — Button, Badge, Card, Input all use the exact Tailwind classes from shadcn
- **InfernoJS native** — Pure `createElement()` components, no JSX runtime required
- **Tiny footprint** — No Radix UI, no heavy abstractions. Each component is a single file
- **cva variants** — `class-variance-authority` for type-safe variant props
- **cn() utility** — `clsx` + `tailwind-merge` for conditional class composition
- **Accessible** — ARIA attributes, `role`, `data-slot` on every component

## Quick Start

### Install dependencies

```bash
bun add class-variance-authority clsx tailwind-merge
```

### Set up design tokens

Add to your `tailwind.css`:

```css
@import "tailwindcss";

@theme {
  --color-background: oklch(0.145 0.014 260);
  --color-foreground: oklch(0.90 0.008 260);
  --color-card: oklch(0.17 0.014 260);
  --color-card-foreground: oklch(0.90 0.008 260);
  --color-primary: oklch(0.68 0.19 150);
  --color-primary-foreground: oklch(0.13 0.02 150);
  --color-secondary: oklch(0.20 0.012 260);
  --color-secondary-foreground: oklch(0.90 0.008 260);
  --color-muted: oklch(0.20 0.012 260);
  --color-muted-foreground: oklch(0.55 0.01 260);
  --color-accent: oklch(0.22 0.014 260);
  --color-accent-foreground: oklch(0.90 0.008 260);
  --color-destructive: oklch(0.62 0.20 25);
  --color-destructive-foreground: oklch(0.97 0.01 17);
  --color-border: oklch(1 0 0 / 10%);
  --color-input: oklch(1 0 0 / 15%);
  --color-ring: oklch(0.68 0.19 150);

  --font-sans: 'Geist', system-ui, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, 'SF Mono', monospace;

  --radius-sm: calc(0.625rem - 4px);
  --radius-md: calc(0.625rem - 2px);
  --radius-lg: 0.625rem;
  --radius-xl: calc(0.625rem + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply antialiased bg-background text-foreground font-sans;
    font-synthesis-weight: none;
    text-rendering: optimizeLegibility;
  }
}
```

### Copy components

Blazecn follows the shadcn philosophy — you own the code. Copy the component files you need into your project's `ui/` directory.

## Components

### Button

6 variants × 6 sizes. Uses `cva` for type-safe variant props.

```ts
import { Button } from './ui/Button';

createElement(Button, { variant: 'default' }, 'Primary')
createElement(Button, { variant: 'destructive' }, 'Delete')
createElement(Button, { variant: 'outline' }, 'Outline')
createElement(Button, { variant: 'secondary' }, 'Secondary')
createElement(Button, { variant: 'ghost' }, 'Ghost')
createElement(Button, { variant: 'link' }, 'Link')

// Sizes
createElement(Button, { size: 'xs' }, 'Extra Small')
createElement(Button, { size: 'sm' }, 'Small')
createElement(Button, { size: 'default' }, 'Default')
createElement(Button, { size: 'lg' }, 'Large')
createElement(Button, { size: 'icon' }, '★')
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` |
| `size` | `'default' \| 'sm' \| 'xs' \| 'lg' \| 'icon' \| 'icon-sm'` | `'default'` |
| `disabled` | `boolean` | `false` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `onClick` | `(e: Event) => void` | — |
| `className` | `string` | — |

### Badge

5 variants for status indicators and labels.

```ts
import { Badge } from './ui/Badge';

createElement(Badge, null, 'Default')
createElement(Badge, { variant: 'secondary' }, 'Secondary')
createElement(Badge, { variant: 'destructive' }, 'Error')
createElement(Badge, { variant: 'outline' }, 'Outline')
createElement(Badge, { variant: 'ghost' }, 'Ghost')
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost'` | `'default'` |
| `className` | `string` | — |

### Card

Composable card with header, title, description, content, and footer slots.

```ts
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';

createElement(Card, null,
  createElement(CardHeader, null,
    createElement(CardTitle, null, 'Card Title'),
    createElement(CardDescription, null, 'Card description text'),
  ),
  createElement(CardContent, null, 'Card body content'),
  createElement(CardFooter, null, 'Footer actions'),
)
```

### Input

```ts
import { Input } from './ui/Input';

createElement(Input, {
  type: 'email',
  placeholder: 'you@example.com',
})
```

| Prop | Type | Default |
|------|------|---------|
| `type` | `string` | `'text'` |
| `placeholder` | `string` | — |
| `value` | `string` | — |
| `disabled` | `boolean` | `false` |
| `readOnly` | `boolean` | `false` |
| `onInput` | `(e: Event) => void` | — |
| `onChange` | `(e: Event) => void` | — |
| `className` | `string` | — |

### Textarea

```ts
import { Textarea } from './ui/Textarea';

createElement(Textarea, {
  placeholder: 'Write something...',
  rows: 4,
})
```

| Prop | Type | Default |
|------|------|---------|
| `placeholder` | `string` | — |
| `value` | `string` | — |
| `rows` | `number` | `3` |
| `disabled` | `boolean` | `false` |
| `className` | `string` | — |

### Label

```ts
import { Label } from './ui/Label';

createElement(Label, { htmlFor: 'email' }, 'Email')
```

### Switch

Toggle switch with ARIA `role="switch"`.

```ts
import { Switch } from './ui/Switch';

createElement(Switch, {
  checked: true,
  onChange: (checked) => console.log(checked),
})
```

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `onChange` | `(checked: boolean) => void` | — |
| `className` | `string` | — |

### Separator

```ts
import { Separator } from './ui/Separator';

createElement(Separator, null)                          // horizontal
createElement(Separator, { orientation: 'vertical' })   // vertical
```

### Spinner

Accessible loading indicator with 3 sizes.

```ts
import { Spinner } from './ui/Spinner';

createElement(Spinner, { size: 'sm' })
createElement(Spinner, null)              // default
createElement(Spinner, { size: 'lg' })
```

### Skeleton

Animated placeholder for loading states.

```ts
import { Skeleton } from './ui/Skeleton';

createElement(Skeleton, { className: 'h-4 w-48' })
createElement(Skeleton, { className: 'h-8 w-full rounded-lg' })
```

## Utilities

### cn()

Combines `clsx` and `tailwind-merge` for conditional, conflict-free class composition:

```ts
import { cn } from './ui/utils';

cn('px-4 py-2', isActive && 'bg-primary', className)
// Handles Tailwind conflicts: cn('px-4', 'px-6') → 'px-6'
```

### buttonVariants / badgeVariants

Use variant functions outside components for links or custom elements:

```ts
import { buttonVariants } from './ui/Button';

createElement('a', {
  href: '/docs',
  className: buttonVariants({ variant: 'outline', size: 'sm' }),
}, 'Read Docs')
```

## Architecture

```
ui/
├── utils.ts          # cn() utility
├── Button.tsx        # cva variants
├── Badge.tsx         # cva variants
├── Card.tsx          # Composable slots
├── Input.tsx         # Form input
├── Textarea.tsx      # Form textarea
├── Label.tsx         # Form label
├── Switch.tsx        # Toggle switch
├── Separator.tsx     # Divider line
├── Spinner.tsx       # Loading indicator
├── Skeleton.tsx      # Loading placeholder
└── index.ts          # Barrel export
```

Every component:
- Uses `data-slot` attributes for identification (matches shadcn)
- Accepts `className` for composition via `cn()`
- Is a pure function (no class components, no hooks)
- Has zero external dependencies beyond Tailwind classes

## Design Tokens

Blazecn uses the same semantic token pairs as shadcn/ui:

| Token | Purpose |
|-------|---------|
| `background` / `foreground` | Page background and default text |
| `card` / `card-foreground` | Raised surface |
| `popover` / `popover-foreground` | Dropdowns, tooltips |
| `primary` / `primary-foreground` | Primary actions |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Subdued backgrounds and text |
| `accent` / `accent-foreground` | Hover/active states |
| `destructive` / `destructive-foreground` | Errors, danger |
| `border` | Default border color |
| `input` | Input border color |
| `ring` | Focus ring color |

## License

MIT
