import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { cn } from '@/lib/utils';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Calendar, CreditCard, DollarSign, Eye, Wallet } from 'lucide-react';
import { FinancingInstallment } from '../../types/sale.types';

interface CreatePaymentScheduleColumnsProps {
  currency: string;
  onViewPayments?: (installmentId: string) => void;
}

export function createPaymentScheduleColumns({
  currency,
  onViewPayments,
}: CreatePaymentScheduleColumnsProps): ColumnDef<FinancingInstallment>[] {
  return [
    {
      id: 'installmentNumber',
      header: 'Nº',
      cell: ({ row }) => {
        const index = row.index + 1;
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {index}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'couteAmount',
      header: 'Cuota a Pagar',
      cell: ({ row }) => {
        const amount = row.getValue('couteAmount') as string;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {formatCurrency(Number(amount), currency)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'coutePaid',
      header: 'Cuota Pagada',
      cell: ({ row }) => {
        const paidAmount = row.getValue('coutePaid') as string;
        const numericPaid = Number(paidAmount);
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-500" />
            <span
              className={cn(
                'font-medium',
                numericPaid > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              {formatCurrency(numericPaid, currency)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'coutePending',
      header: 'Cuota Pendiente',
      cell: ({ row }) => {
        const pendingAmount = row.getValue('coutePending') as string;
        const numericPending = Number(pendingAmount);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span
              className={cn(
                'font-medium',
                numericPending > 0
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              {formatCurrency(numericPending, currency)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'mora',
      header: 'Mora',
      cell: ({ row }) => {
        const moraPaid = Number(row.original.lateFeeAmountPaid) || 0;
        const moraPending = Number(row.original.lateFeeAmountPending) || 0;
        return (
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Pagado:</span>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(moraPaid, currency)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Pendiente:</span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    moraPending > 0 ? 'text-red-500' : 'text-gray-400',
                  )}
                >
                  {formatCurrency(moraPending, currency)}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      accessorKey: 'expectedPaymentDate',
      header: 'Fecha Estimada',
      cell: ({ row }) => {
        const date = row.getValue('expectedPaymentDate') as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{formatDate(date)}</span>
          </div>
        );
      },
    },
    ...(onViewPayments
      ? [
          {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }: { row: Row<FinancingInstallment> }) => {
              const installment = row.original;
              const hasPayments =
                installment.payments && installment.payments.length > 0;

              return (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewPayments(installment.id)}
                    disabled={!hasPayments}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver pagos</span>
                  </Button>
                </div>
              );
            },
          },
        ]
      : []),
  ];
}
