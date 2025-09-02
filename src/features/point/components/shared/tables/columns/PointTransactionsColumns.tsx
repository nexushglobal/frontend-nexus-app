'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TRANSACTION_TYPES,
} from '@/features/point/constants';
import { PointTransactionBase } from '@/features/point/types/points.types';
import { TransactionStatus } from '@/features/point/types/enums-transaction';
import { MetadataModal } from '@/features/shared/components/modal/MetadataModal';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';


interface ActionsColumnProps {
  transaction: PointTransactionBase;
}

function ActionsColumn({ transaction }: ActionsColumnProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const hasMetadata =
    transaction.metadata && Object.keys(transaction.metadata).length > 0;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMetadata(true)}
        disabled={!hasMetadata}
        className="h-8 w-8 p-0"
        title={hasMetadata ? 'Ver metadata' : 'Sin metadata disponible'}
      >
        <FileText className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
        title="Ver detalle"
      >
        <Link
          href={`/dashboard/cli-puntos/historial-puntos/detalle-transaccion/${transaction.id}`}
        >
          <Eye className="h-4 w-4" />
        </Link>
      </Button>

      <MetadataModal
        isOpen={showMetadata}
        onClose={() => setShowMetadata(false)}
        metadata={transaction.metadata}
        title="Metadata de la Transacción"
      />
    </div>
  );
}


const typeVariants = {
  BINARY_COMMISSION: 'secondary' as const,
  DIRECT_BONUS: 'secondary' as const,
  WITHDRAWAL: 'outline' as const,
};

const typeColors = {
  BINARY_COMMISSION:
    'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600',
  DIRECT_BONUS: 'text-purple-700 dark:text-purple-400',
  WITHDRAWAL: 'text-orange-700 dark:text-orange-400',
};

export const pointTransactionColumns: ColumnDef<PointTransactionBase>[] = [
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
      const type = row.getValue('type') as keyof typeof TRANSACTION_TYPES;
      return (
        <Badge variant={typeVariants[type]} className={typeColors[type]}>
          {TRANSACTION_TYPES[type]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Montos',
    cell: ({ row }) => {
      const transaction = row.original;
      const isWithdrawal = transaction.type === 'WITHDRAWAL';
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
              <span className="text-xs text-muted-foreground">Pendiente: </span>
              <span className="font-mono text-yellow-700 dark:text-yellow-400">
                {formatCurrency(transaction.pendingAmount, 'PEN')}
              </span>
            </div>
          )}
          {transaction.withdrawnAmount > 0 && (
            <div className="text-sm">
              <span className="text-xs text-muted-foreground">Retirado: </span>
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
      const status = row.getValue('status') as TransactionStatus;
      const statusConfig = getStatusConfig(status);
      return (
        <Badge
          variant={statusConfig.variant}
          className={statusConfig.className}
        >
          {statusConfig.label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const transaction = row.original;
      return <ActionsColumn transaction={transaction} />;
    },
  },
];
