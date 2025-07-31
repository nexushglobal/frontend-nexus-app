import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { Item } from '../../types/points-response';

export function transactionPaymentsColumns(): ColumnDef<Item>[] {
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
      accessorKey: 'amount',
      header: 'Cantidad',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('amount')}</span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Metodo de pago',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('paymentMethod') ?? '--'}</span>
      ),
    },
    {
      accessorKey: 'paymentReference',
      header: 'Referencia',
      cell: ({ row }) => (
        <span className="text-sm">
          <StatusBadge status={row.getValue('paymentReference') ?? '--'} />
        </span>
      ),
    },
    {
      accessorKey: 'notes',
      header: 'Notas',
      cell: ({ row }) => (
        <span className="text-sm">
          <StatusBadge status={row.getValue('notes') ?? '--'} />
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
  ];
}
