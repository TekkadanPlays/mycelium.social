import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { Chart, registerables } from 'chart.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../ui/Card';
import { Badge } from '../../../../ui/Badge';
import { Button } from '../../../../ui/Button';
import { Input } from '../../../../ui/Input';
import { Label } from '../../../../ui/Label';
import { Separator } from '../../../../ui/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../ui/Table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../ui/Select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../../../ui/Sheet';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../ui/Avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../../../../ui/DropdownMenu';

Chart.register(...registerables);

// ---------------------------------------------------------------------------
// SVG icon helpers
// ---------------------------------------------------------------------------

function TrendUpIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
        createElement('polyline', { points: '16 7 22 7 22 13' }),
    );
}

function TrendDownIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('polyline', { points: '22 17 13.5 8.5 8.5 13.5 2 7' }),
        createElement('polyline', { points: '16 17 22 17 22 11' }),
    );
}

function DashboardIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('rect', { width: '7', height: '9', x: '3', y: '3', rx: '1' }),
        createElement('rect', { width: '7', height: '5', x: '14', y: '3', rx: '1' }),
        createElement('rect', { width: '7', height: '9', x: '14', y: '12', rx: '1' }),
        createElement('rect', { width: '7', height: '5', x: '3', y: '16', rx: '1' }),
    );
}

function ChartIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
        createElement('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
        createElement('line', { x1: '6', y1: '20', x2: '6', y2: '14' }),
    );
}

function UsersIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
        createElement('circle', { cx: '9', cy: '7', r: '4' }),
        createElement('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
        createElement('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
    );
}

function FolderIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('path', { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' }),
    );
}

function SettingsIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
        createElement('circle', { cx: '12', cy: '12', r: '3' }),
    );
}

function SearchIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('circle', { cx: '11', cy: '11', r: '8' }),
        createElement('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
    );
}

function MenuIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-5',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('line', { x1: '4', y1: '12', x2: '20', y2: '12' }),
        createElement('line', { x1: '4', y1: '6', x2: '20', y2: '6' }),
        createElement('line', { x1: '4', y1: '18', x2: '20', y2: '18' }),
    );
}

function DotsIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('circle', { cx: '12', cy: '12', r: '1' }),
        createElement('circle', { cx: '12', cy: '5', r: '1' }),
        createElement('circle', { cx: '12', cy: '19', r: '1' }),
    );
}

function CheckIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: className || 'size-4 text-green-500',
        viewBox: '0 0 24 24', fill: 'currentColor',
    },
        createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' }),
    );
}

function LoaderIcon({ className }: { className?: string }) {
    return createElement('svg', {
        className: (className || 'size-4') + ' animate-spin text-muted-foreground',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    },
        createElement('path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }),
    );
}

// ---------------------------------------------------------------------------
// Helper: read CSS variable
// ---------------------------------------------------------------------------

function getCSSVar(name: string): string {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function resolveHSL(varName: string): string {
    const val = getCSSVar(varName);
    if (!val) return 'hsl(0 0% 50%)';
    // If already hsl(…) or oklch(…), return as-is
    if (val.startsWith('hsl') || val.startsWith('oklch') || val.startsWith('rgb') || val.startsWith('#')) return val;
    // Otherwise treat as "H S% L%" shorthand
    return `hsl(${val})`;
}

// ---------------------------------------------------------------------------
// Chart data
// ---------------------------------------------------------------------------

const CHART_DATA = [
    { date: '2024-04-01', desktop: 222, mobile: 150 },
    { date: '2024-04-05', desktop: 373, mobile: 290 },
    { date: '2024-04-10', desktop: 261, mobile: 190 },
    { date: '2024-04-15', desktop: 120, mobile: 170 },
    { date: '2024-04-20', desktop: 89, mobile: 150 },
    { date: '2024-04-25', desktop: 215, mobile: 250 },
    { date: '2024-04-30', desktop: 454, mobile: 380 },
    { date: '2024-05-05', desktop: 481, mobile: 390 },
    { date: '2024-05-10', desktop: 293, mobile: 330 },
    { date: '2024-05-15', desktop: 473, mobile: 380 },
    { date: '2024-05-20', desktop: 177, mobile: 230 },
    { date: '2024-05-25', desktop: 201, mobile: 250 },
    { date: '2024-05-30', desktop: 340, mobile: 280 },
    { date: '2024-06-05', desktop: 88, mobile: 140 },
    { date: '2024-06-10', desktop: 155, mobile: 200 },
    { date: '2024-06-15', desktop: 307, mobile: 350 },
    { date: '2024-06-20', desktop: 408, mobile: 450 },
    { date: '2024-06-25', desktop: 141, mobile: 190 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
];

// ---------------------------------------------------------------------------
// Table data
// ---------------------------------------------------------------------------

const TABLE_DATA = [
    { id: 1, header: 'Cover Page', type: 'Cover Page', status: 'Done', target: '2', limit: '1', reviewer: 'Eddie Lake' },
    { id: 2, header: 'Table of Contents', type: 'Table of Contents', status: 'Done', target: '6', limit: '4', reviewer: 'Jamik Tashpulatov' },
    { id: 3, header: 'Executive Summary', type: 'Executive Summary', status: 'Done', target: '20', limit: '15', reviewer: 'Emily Whalen' },
    { id: 4, header: 'Technical Approach', type: 'Technical Approach', status: 'In Progress', target: '50', limit: '40', reviewer: 'Eddie Lake' },
    { id: 5, header: 'Design Narrative', type: 'Narrative', status: 'In Progress', target: '15', limit: '12', reviewer: 'Jamik Tashpulatov' },
    { id: 6, header: 'Capabilities Overview', type: 'Capabilities', status: 'Not Started', target: '10', limit: '8', reviewer: 'Emily Whalen' },
    { id: 7, header: 'Focus Documents', type: 'Focus Documents', status: 'Done', target: '8', limit: '6', reviewer: 'Eddie Lake' },
    { id: 8, header: 'Past Performance', type: 'Narrative', status: 'In Progress', target: '30', limit: '25', reviewer: 'Jamik Tashpulatov' },
];

// ---------------------------------------------------------------------------
// SectionCards
// ---------------------------------------------------------------------------

function SectionCards() {
    const cards = [
        { desc: 'Total Revenue', value: '$1,250.00', change: '+12.5%', up: true, foot: 'Trending up this month', sub: 'Visitors for the last 6 months' },
        { desc: 'New Customers', value: '1,234', change: '-20%', up: false, foot: 'Down 20% this period', sub: 'Acquisition needs attention' },
        { desc: 'Active Accounts', value: '45,678', change: '+12.5%', up: true, foot: 'Strong user retention', sub: 'Engagement exceeds targets' },
        { desc: 'Growth Rate', value: '4.5%', change: '+4.5%', up: true, foot: 'Steady performance increase', sub: 'Meets growth projections' },
    ];

    return createElement('div', { className: 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4' },
        ...cards.map((c) =>
            createElement(Card, { key: c.desc },
                createElement(CardHeader, null,
                    createElement(CardDescription, null, c.desc),
                    createElement('div', { className: 'flex items-center justify-between' },
                        createElement(CardTitle, { className: 'text-2xl font-semibold tabular-nums' }, c.value),
                        createElement(Badge, { variant: 'outline', className: 'gap-1' },
                            c.up ? createElement(TrendUpIcon, { className: 'size-3' }) : createElement(TrendDownIcon, { className: 'size-3' }),
                            c.change,
                        ),
                    ),
                ),
                createElement(CardFooter, { className: 'flex-col items-start gap-1 text-sm' },
                    createElement('div', { className: 'flex gap-2 font-medium leading-none' },
                        c.foot,
                        c.up ? createElement(TrendUpIcon, { className: 'size-4' }) : createElement(TrendDownIcon, { className: 'size-4' }),
                    ),
                    createElement('div', { className: 'text-muted-foreground' }, c.sub),
                ),
            ),
        ),
    );
}

// ---------------------------------------------------------------------------
// ChartAreaInteractive — Chart.js area chart
// ---------------------------------------------------------------------------

interface ChartState {
    timeRange: string;
}

class ChartAreaInteractive extends Component<{}, ChartState> {
    declare state: ChartState;
    private canvasRef: HTMLCanvasElement | null = null;
    private chart: Chart | null = null;
    private observer: MutationObserver | null = null;

    constructor(props: {}) {
        super(props);
        this.state = { timeRange: '90d' };
    }

    componentDidMount() {
        this.renderChart();
        // Watch for theme changes on <html> class/style
        this.observer = new MutationObserver(() => {
            setTimeout(() => this.renderChart(), 50);
        });
        this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    }

    componentDidUpdate(_: {}, prevState: ChartState) {
        if (prevState.timeRange !== this.state.timeRange) {
            this.renderChart();
        }
    }

    componentWillUnmount() {
        this.chart?.destroy();
        this.observer?.disconnect();
    }

    private getFilteredData() {
        const ref = new Date('2024-06-30');
        const days = this.state.timeRange === '30d' ? 30 : this.state.timeRange === '7d' ? 7 : 90;
        const start = new Date(ref);
        start.setDate(start.getDate() - days);
        return CHART_DATA.filter((d) => new Date(d.date) >= start);
    }

    private renderChart() {
        if (!this.canvasRef) return;
        this.chart?.destroy();

        const data = this.getFilteredData();
        const primary = resolveHSL('--primary');
        const border = resolveHSL('--border');
        const mutedFg = resolveHSL('--muted-foreground');

        const ctx = this.canvasRef.getContext('2d')!;

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, primary.replace(')', ' / 0.3)').replace('hsl(', 'hsla(').replace('oklch(', 'oklch('));
        // fallback: use rgba approach
        gradient.addColorStop(1, 'transparent');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((d) => {
                    const dt = new Date(d.date);
                    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [
                    {
                        label: 'Desktop',
                        data: data.map((d) => d.desktop),
                        borderColor: primary,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        borderWidth: 2,
                    },
                    {
                        label: 'Mobile',
                        data: data.map((d) => d.mobile),
                        borderColor: primary,
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        borderWidth: 2,
                        borderDash: [5, 5],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'hsl(0 0% 10%)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: border,
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 10,
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: mutedFg, maxTicksLimit: 8, font: { size: 11 } },
                        border: { display: false },
                    },
                    y: {
                        grid: { color: border + '40' },
                        ticks: { color: mutedFg, font: { size: 11 } },
                        border: { display: false },
                    },
                },
            },
        });
    }

    render() {
        const { timeRange } = this.state;
        const ranges = [
            { value: '90d', label: 'Last 3 months' },
            { value: '30d', label: 'Last 30 days' },
            { value: '7d', label: 'Last 7 days' },
        ];

        return createElement(Card, null,
            createElement(CardHeader, null,
                createElement('div', { className: 'flex items-center justify-between' },
                    createElement('div', null,
                        createElement(CardTitle, null, 'Total Visitors'),
                        createElement(CardDescription, null, 'Total for the last 3 months'),
                    ),
                    createElement('div', { className: 'flex gap-1' },
                        ...ranges.map((r) =>
                            createElement('button', {
                                key: r.value,
                                type: 'button',
                                onClick: () => this.setState({ timeRange: r.value }),
                                className: `inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${timeRange === r.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
                                    }`,
                            }, r.label),
                        ),
                    ),
                ),
            ),
            createElement(CardContent, null,
                createElement('div', { style: { height: '250px' } },
                    createElement('canvas', {
                        ref: (el: any) => { this.canvasRef = el; },
                    } as any),
                ),
            ),
        );
    }
}

// ---------------------------------------------------------------------------
// DataTable — manual Table with sort and pagination
// ---------------------------------------------------------------------------

interface DataTableState {
    sortKey: string;
    sortDir: 'asc' | 'desc';
    page: number;
    pageSize: number;
    tabValue: string;
}

class DataTableBlock extends Component<{}, DataTableState> {
    declare state: DataTableState;

    constructor(props: {}) {
        super(props);
        this.state = { sortKey: 'id', sortDir: 'asc', page: 0, pageSize: 5, tabValue: 'outline' };
    }

    private getSorted() {
        const { sortKey, sortDir } = this.state;
        const sorted = [...TABLE_DATA].sort((a, b) => {
            const av = (a as any)[sortKey];
            const bv = (b as any)[sortKey];
            if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
            return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });
        return sorted;
    }

    private toggleSort(key: string) {
        this.setState((s: DataTableState) => ({
            sortKey: key,
            sortDir: s.sortKey === key && s.sortDir === 'asc' ? 'desc' : 'asc',
            page: 0,
        }));
    }

    render() {
        const { page, pageSize, tabValue, sortKey, sortDir } = this.state;
        const sorted = this.getSorted();
        const totalPages = Math.ceil(sorted.length / pageSize);
        const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

        const sortArrow = (key: string) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

        const tabs = [
            { value: 'outline', label: 'Outline' },
            { value: 'past-performance', label: 'Past Performance' },
            { value: 'key-personnel', label: 'Key Personnel' },
            { value: 'focus-documents', label: 'Focus Documents' },
        ];

        return createElement('div', { className: 'space-y-4' },
            // Tab header
            createElement('div', { className: 'flex items-center justify-between flex-wrap gap-2' },
                createElement(Tabs, null,
                    createElement(TabsList, null,
                        ...tabs.map((t) =>
                            createElement(TabsTrigger, {
                                key: t.value,
                                value: t.value,
                                active: tabValue === t.value,
                                onClick: () => this.setState({ tabValue: t.value }),
                            }, t.label),
                        ),
                    ),
                ),
                createElement('div', { className: 'flex items-center gap-2' },
                    createElement(Button, { variant: 'outline', size: 'sm' }, '+ Add Section'),
                ),
            ),

            // Table content (only for outline tab)
            tabValue === 'outline'
                ? createElement('div', { className: 'rounded-lg border overflow-hidden' },
                    createElement(Table, null,
                        createElement(TableHeader, { className: 'bg-muted' },
                            createElement(TableRow, null,
                                createElement(TableHead, null,
                                    createElement('button', { type: 'button', className: 'cursor-pointer font-medium', onClick: () => this.toggleSort('header') }, 'Header' + sortArrow('header')),
                                ),
                                createElement(TableHead, null,
                                    createElement('button', { type: 'button', className: 'cursor-pointer font-medium', onClick: () => this.toggleSort('type') }, 'Section Type' + sortArrow('type')),
                                ),
                                createElement(TableHead, null,
                                    createElement('button', { type: 'button', className: 'cursor-pointer font-medium', onClick: () => this.toggleSort('status') }, 'Status' + sortArrow('status')),
                                ),
                                createElement(TableHead, { className: 'text-right' }, 'Target'),
                                createElement(TableHead, { className: 'text-right' }, 'Limit'),
                                createElement(TableHead, null, 'Reviewer'),
                                createElement(TableHead, { className: 'w-8' }, ''),
                            ),
                        ),
                        createElement(TableBody, null,
                            ...paged.map((row) =>
                                createElement(TableRow, { key: row.id },
                                    createElement(TableCell, { className: 'font-medium' }, row.header),
                                    createElement(TableCell, null,
                                        createElement(Badge, { variant: 'outline', className: 'text-muted-foreground' }, row.type),
                                    ),
                                    createElement(TableCell, null,
                                        createElement(Badge, { variant: 'outline', className: 'gap-1' },
                                            row.status === 'Done'
                                                ? createElement(CheckIcon, { className: 'size-3.5' })
                                                : createElement(LoaderIcon, { className: 'size-3.5' }),
                                            row.status,
                                        ),
                                    ),
                                    createElement(TableCell, { className: 'text-right tabular-nums' }, row.target),
                                    createElement(TableCell, { className: 'text-right tabular-nums' }, row.limit),
                                    createElement(TableCell, null, row.reviewer),
                                    createElement(TableCell, null,
                                        createElement(DropdownMenu, null,
                                            createElement(DropdownMenuTrigger, null,
                                                createElement(Button, { variant: 'ghost', size: 'icon', className: 'size-7' },
                                                    createElement(DotsIcon, null),
                                                ),
                                            ),
                                            createElement(DropdownMenuContent, null,
                                                createElement(DropdownMenuItem, null, 'Edit'),
                                                createElement(DropdownMenuItem, null, 'Make a copy'),
                                                createElement(DropdownMenuItem, null, 'Favorite'),
                                                createElement(DropdownMenuSeparator, null),
                                                createElement(DropdownMenuItem, { className: 'text-destructive' }, 'Delete'),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                )
                : createElement('div', { className: 'aspect-video w-full rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm' },
                    'Content for ', tabValue,
                ),

            // Pagination
            tabValue === 'outline'
                ? createElement('div', { className: 'flex items-center justify-between text-sm' },
                    createElement('span', { className: 'text-muted-foreground' },
                        `${sorted.length} row(s) total`,
                    ),
                    createElement('div', { className: 'flex items-center gap-2' },
                        createElement('span', { className: 'text-muted-foreground' },
                            `Page ${page + 1} of ${totalPages}`,
                        ),
                        createElement(Button, {
                            variant: 'outline',
                            size: 'sm',
                            disabled: page === 0,
                            onClick: () => this.setState({ page: page - 1 }),
                        }, '←'),
                        createElement(Button, {
                            variant: 'outline',
                            size: 'sm',
                            disabled: page >= totalPages - 1,
                            onClick: () => this.setState({ page: page + 1 }),
                        }, '→'),
                    ),
                )
                : null,
        );
    }
}

// ---------------------------------------------------------------------------
// AppSidebar — Sheet-based sidebar
// ---------------------------------------------------------------------------

interface SidebarState {
    open: boolean;
}

class AppSidebarBlock extends Component<{}, SidebarState> {
    declare state: SidebarState;

    constructor(props: {}) {
        super(props);
        this.state = { open: false };
    }

    render() {
        const { open } = this.state;

        const navMain = [
            { icon: DashboardIcon, label: 'Dashboard' },
            { icon: ChartIcon, label: 'Analytics' },
            { icon: FolderIcon, label: 'Projects' },
            { icon: UsersIcon, label: 'Team' },
        ];

        const navSecondary = [
            { icon: SettingsIcon, label: 'Settings' },
            { icon: SearchIcon, label: 'Search' },
        ];

        return createElement('div', null,
            // Sidebar toggle
            createElement(Button, {
                variant: 'ghost',
                size: 'icon',
                onClick: () => this.setState({ open: true }),
                className: 'lg:hidden',
            }, createElement(MenuIcon, null)),

            // Desktop sidebar always visible
            createElement('div', { className: 'hidden lg:flex lg:flex-col lg:w-56 shrink-0 border-r bg-card h-full' },
                this.renderSidebarContent(),
            ),

            // Mobile sidebar via Sheet
            createElement(Sheet, { open, onOpenChange: (o: boolean) => this.setState({ open: o }) },
                createElement(SheetContent, { side: 'left', onClose: () => this.setState({ open: false }) },
                    createElement(SheetHeader, null,
                        createElement(SheetTitle, null, 'Acme Inc.'),
                        createElement(SheetDescription, null, 'Dashboard navigation'),
                    ),
                    this.renderSidebarContent(),
                ),
            ),
        );
    }

    private renderSidebarContent() {
        const navMain = [
            { icon: DashboardIcon, label: 'Dashboard', active: true },
            { icon: ChartIcon, label: 'Analytics', active: false },
            { icon: FolderIcon, label: 'Projects', active: false },
            { icon: UsersIcon, label: 'Team', active: false },
        ];

        const navSecondary = [
            { icon: SettingsIcon, label: 'Settings' },
            { icon: SearchIcon, label: 'Search' },
        ];

        return createElement('div', { className: 'flex flex-col gap-4 py-4' },
            // Logo area
            createElement('div', { className: 'px-4 flex items-center gap-2' },
                createElement('div', { className: 'flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground' },
                    createElement('svg', {
                        className: 'size-4', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
                        'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                    }, createElement('path', { d: 'M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' })),
                ),
                createElement('span', { className: 'font-semibold text-sm' }, 'Acme Inc.'),
            ),

            createElement(Separator, null),

            // Main nav
            createElement('nav', { className: 'flex flex-col gap-0.5 px-2' },
                ...navMain.map((item) =>
                    createElement('a', {
                        key: item.label,
                        href: '#',
                        className: `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${item.active
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            }`,
                    },
                        createElement(item.icon, { className: 'size-4' }),
                        item.label,
                    ),
                ),
            ),

            // Spacer
            createElement('div', { className: 'flex-1' }),

            // Secondary nav
            createElement(Separator, null),
            createElement('nav', { className: 'flex flex-col gap-0.5 px-2' },
                ...navSecondary.map((item) =>
                    createElement('a', {
                        key: item.label,
                        href: '#',
                        className: 'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors',
                    },
                        createElement(item.icon, { className: 'size-4' }),
                        item.label,
                    ),
                ),
            ),

            createElement(Separator, null),

            // User
            createElement('div', { className: 'px-4 flex items-center gap-2' },
                createElement(Avatar, { className: 'size-7' },
                    createElement(AvatarFallback, { className: 'text-[10px]' }, 'CN'),
                ),
                createElement('div', { className: 'flex-1 min-w-0' },
                    createElement('div', { className: 'text-sm font-medium truncate' }, 'shadcn'),
                    createElement('div', { className: 'text-xs text-muted-foreground truncate' }, 'm@example.com'),
                ),
            ),
        );
    }
}

// ---------------------------------------------------------------------------
// SiteHeader — dashboard header bar
// ---------------------------------------------------------------------------

function SiteHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
    return createElement('header', {
        className: 'flex h-12 items-center gap-2 border-b px-4',
    },
        createElement(Button, {
            variant: 'ghost',
            size: 'icon',
            className: 'lg:hidden size-8',
            onClick: onToggleSidebar,
        }, createElement(MenuIcon, { className: 'size-4' })),
        createElement(Separator, { orientation: 'vertical', className: 'mx-2 h-4 hidden lg:block' }),
        createElement('div', { className: 'flex-1' }),
        createElement(Button, { variant: 'ghost', size: 'icon', className: 'size-8' },
            createElement(SearchIcon, { className: 'size-4' }),
        ),
    );
}

// ---------------------------------------------------------------------------
// Dashboard01Demo — composite full dashboard
// ---------------------------------------------------------------------------

interface Dashboard01State {
    sidebarOpen: boolean;
}

export class Dashboard01Demo extends Component<{}, Dashboard01State> {
    declare state: Dashboard01State;

    constructor(props: {}) {
        super(props);
        this.state = { sidebarOpen: false };
    }

    render() {
        const { sidebarOpen } = this.state;

        return createElement('div', { className: 'rounded-xl border overflow-hidden bg-background' },
            createElement('div', { className: 'flex min-h-[700px]' },
                // Desktop sidebar
                createElement('div', { className: 'hidden lg:block w-56 shrink-0 border-r' },
                    createElement(AppSidebarBlock, null),
                ),

                // Mobile sheet sidebar
                createElement(Sheet, {
                    open: sidebarOpen,
                    onOpenChange: (o: boolean) => this.setState({ sidebarOpen: o }),
                },
                    createElement(SheetContent, {
                        side: 'left',
                        onClose: () => this.setState({ sidebarOpen: false }),
                    },
                        createElement(SheetHeader, null,
                            createElement(SheetTitle, null, 'Navigation'),
                        ),
                        createElement(AppSidebarBlock, null),
                    ),
                ),

                // Main content
                createElement('div', { className: 'flex-1 flex flex-col min-w-0' },
                    // Header
                    createElement(SiteHeader, {
                        onToggleSidebar: () => this.setState({ sidebarOpen: true }),
                    }),

                    // Dashboard content
                    createElement('div', { className: 'flex-1 flex flex-col gap-4 p-4 md:gap-6 md:p-6' },
                        createElement(SectionCards, null),
                        createElement(ChartAreaInteractive, null),
                        createElement(DataTableBlock, null),
                    ),
                ),
            ),
        );
    }
}
