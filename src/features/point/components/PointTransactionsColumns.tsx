'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../constants';
import { PointTransactionBase } from '../types/points.types';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: Record<string, unknown> | undefined;
}

function MetadataModal({ isOpen, onClose, metadata }: MetadataModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Metadata de la Transacción</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-auto">
          <pre className="bg-muted p-4 rounded-lg text-sm">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
      />
    </div>
  );
}

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
      const status = row.getValue('status') as keyof typeof TRANSACTION_STATUS;
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
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const transaction = row.original;
      return <ActionsColumn transaction={transaction} />;
    },
  },
];
