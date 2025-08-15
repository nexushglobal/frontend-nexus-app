'use client';

import { Badge } from '@/components/ui/badge';
import {
  LOT_TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} from '@/features/point/constants';
import { PointLotTransactionBase } from '@/features/point/types/points.types';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusVariants = {
  PENDING: 'outline' as const,
  COMPLETED: 'secondary' as const,
  CANCELLED: 'outline' as const,
  FAILED: 'destructive' as const,
};

const statusColors = {
  PENDING:
    'text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600',
  COMPLETED:
    'text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-600',
  CANCELLED:
    'text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600',
  FAILED: 'text-red-700 dark:text-red-400',
};

const typeVariants = {
  LOT_BINARY_COMMISSION: 'secondary' as const,
  LOT_DIRECT_BONUS: 'secondary' as const,
  LOT_WITHDRAWAL: 'outline' as const,
};

const typeColors = {
  LOT_BINARY_COMMISSION:
    'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600',
  LOT_DIRECT_BONUS: 'text-purple-700 dark:text-purple-400',
  LOT_WITHDRAWAL: 'text-orange-700 dark:text-orange-400',
};

export const pointLotTransactionColumns: ColumnDef<PointLotTransactionBase>[] =
  [
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
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
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.getValue('type') as keyof typeof LOT_TRANSACTION_TYPES;
        return (
          <Badge variant={typeVariants[type]} className={typeColors[type]}>
            {LOT_TRANSACTION_TYPES[type]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Montos',
      cell: ({ row }) => {
        const transaction = row.original;
        const isWithdrawal = transaction.type === 'LOT_WITHDRAWAL';
        const isZeroAmount = transaction.amount === 0;
        const shouldShowOnlyTotal = isWithdrawal || isZeroAmount;

        if (shouldShowOnlyTotal) {
          return (
            <div className="font-semibold">
              <span className="font-mono">
                {formatCurrency(transaction.amount, 'PEN')}
              </span>
            </div>
          );
        }

        return (
          <div className="space-y-1">
            <div className="font-semibold">
              <span className="text-xs text-muted-foreground">Total: </span>
              <span className="font-mono">
                {formatCurrency(transaction.amount, 'PEN')}
              </span>
            </div>
            {transaction.pendingAmount > 0 && (
              <div className="text-sm">
                <span className="text-xs text-muted-foreground">
                  Pendiente:{' '}
                </span>
                <span className="font-mono text-yellow-700 dark:text-yellow-400">
                  {formatCurrency(transaction.pendingAmount, 'PEN')}
                </span>
              </div>
            )}
            {transaction.withdrawnAmount > 0 && (
              <div className="text-sm">
                <span className="text-xs text-muted-foreground">
                  Retirado:{' '}
                </span>
                <span className="font-mono text-green-700 dark:text-green-400">
                  {formatCurrency(transaction.withdrawnAmount, 'PEN')}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue(
          'status',
        ) as keyof typeof TRANSACTION_STATUS;
        return (
          <Badge
            variant={statusVariants[status]}
            className={statusColors[status]}
          >
            {TRANSACTION_STATUS[status]}
          </Badge>
        );
      },
    },
  ];
