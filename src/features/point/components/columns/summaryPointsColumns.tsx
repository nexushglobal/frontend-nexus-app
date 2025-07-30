import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from '../../types/points.types';
import TransactionActionsButton from '../TransactionActiosButton';

export function summaryPointsColumns(): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          #{row.getValue('id')}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => (
        <span className="text-sm">
          <StatusBadge status={row.getValue('type')} />
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Cantidad',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('amount')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <span className="text-sm">
          <StatusBadge status={row.getValue('status')} />
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.getValue('createdAt'))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const transaction = row.original;

        return <TransactionActionsButton transaction={transaction} />;
      },
    },
  ];
}
