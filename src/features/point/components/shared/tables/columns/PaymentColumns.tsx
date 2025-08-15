'use client';

import { Badge } from '@/components/ui/badge';
import { PAYMENT_METHODS } from '@/features/point/constants';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const paymentMethodVariants = {
  VOUCHER: 'secondary' as const,
  POINTS: 'outline' as const,
  PAYMENT_GATEWAY: 'default' as const,
};

const paymentMethodColors = {
  VOUCHER:
    'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20',
  POINTS:
    'text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-600',
  PAYMENT_GATEWAY: 'text-gray-700 dark:text-gray-400',
};

export const paymentColumns: ColumnDef<PaymentItem>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return <div className="font-mono text-sm">#{row.getValue('id')}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Monto',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return (
        <div className="font-semibold">{formatCurrency(amount, 'PEN')}</div>
      );
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Método de Pago',
    cell: ({ row }) => {
      const method = row.getValue(
        'paymentMethod',
      ) as keyof typeof PAYMENT_METHODS;
      return (
        <Badge
          variant={paymentMethodVariants[method]}
          className={paymentMethodColors[method]}
        >
          {PAYMENT_METHODS[method]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'paymentReference',
    header: 'Referencia',
    cell: ({ row }) => {
      const reference = row.getValue('paymentReference') as string;
      return (
        <div
          className="font-mono text-sm max-w-[150px] truncate"
          title={reference}
        >
          {reference}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de Pago',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return (
        <div className="text-sm space-y-1">
          <div className="font-medium">
            {format(date, 'dd/MM/yyyy', { locale: es })}
          </div>
          <div className="text-muted-foreground text-xs">
            {format(date, 'HH:mm', { locale: es })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notas',
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string | undefined;
      if (!notes) {
        return (
          <span className="text-muted-foreground text-sm italic">
            Sin notas
          </span>
        );
      }
      return (
        <div className="max-w-[200px] truncate text-sm" title={notes}>
          {notes}
        </div>
      );
    },
  },
];
