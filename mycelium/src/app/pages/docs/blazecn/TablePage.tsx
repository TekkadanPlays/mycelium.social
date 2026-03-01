import { createElement } from 'inferno-create-element';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../ui/Table';
import { PageHeader, DemoBox, CodeBlock } from '../_helpers';

export function TablePage() {
  return createElement('div', { className: 'space-y-8' },
    createElement(PageHeader, {
      title: 'Table',
      description: 'A responsive table component with composable header, body, and row slots.',
    }),
    createElement(DemoBox, { className: 'block p-0 overflow-hidden' },
      createElement(Table, null,
        createElement(TableHeader, null,
          createElement(TableRow, null,
            createElement(TableHead, null, 'Invoice'),
            createElement(TableHead, null, 'Status'),
            createElement(TableHead, null, 'Method'),
            createElement(TableHead, { className: 'text-right' }, 'Amount'),
          ),
        ),
        createElement(TableBody, null,
          ...([
            { inv: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
            { inv: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
            { inv: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
          ] as const).map((row) =>
            createElement(TableRow, { key: row.inv },
              createElement(TableCell, { className: 'font-medium' }, row.inv),
              createElement(TableCell, null, row.status),
              createElement(TableCell, null, row.method),
              createElement(TableCell, { className: 'text-right' }, row.amount),
            ),
          ),
        ),
      ),
    ),
    createElement(CodeBlock, { code: "import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/ui/Table'\n\ncreateElement(Table, null,\n  createElement(TableHeader, null,\n    createElement(TableRow, null,\n      createElement(TableHead, null, 'Name'),\n      createElement(TableHead, null, 'Amount'),\n    ),\n  ),\n  createElement(TableBody, null,\n    createElement(TableRow, null,\n      createElement(TableCell, null, 'Item'),\n      createElement(TableCell, null, '$100'),\n    ),\n  ),\n)" }),
  );
}
