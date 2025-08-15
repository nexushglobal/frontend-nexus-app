'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from '@/features/point/constants';
import { PointTransactionBase } from '@/features/point/types/points.types';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  CircleDollarSign,
  Clock,
  Download,
  Eye,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PointTransactionsCardsProps {
  data: PointTransactionBase[];
}

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

export function PointTransactionsCards({ data }: PointTransactionsCardsProps) {
  const [selectedMetadata, setSelectedMetadata] = useState<{
    metadata: Record<string, unknown> | undefined;
    isOpen: boolean;
  }>({
    metadata: undefined,
    isOpen: false,
  });

  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground">
            No se encontraron transacciones
          </p>
        </CardContent>
      </Card>
    );
  }

  const openMetadataModal = (metadata: Record<string, unknown> | undefined) => {
    setSelectedMetadata({ metadata, isOpen: true });
  };

  const closeMetadataModal = () => {
    setSelectedMetadata({ metadata: undefined, isOpen: false });
  };

  return (
    <div className="space-y-4">
      {data.map((transaction) => {
        const hasMetadata =
          transaction.metadata && Object.keys(transaction.metadata).length > 0;

        return (
          <Card key={transaction.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header con tipo y estado */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={typeVariants[transaction.type]}
                    className={typeColors[transaction.type]}
                  >
                    {TRANSACTION_TYPES[transaction.type]}
                  </Badge>
                  <Badge
                    variant={statusVariants[transaction.status]}
                    className={statusColors[transaction.status]}
                  >
                    {TRANSACTION_STATUS[transaction.status]}
                  </Badge>
                </div>

                <Separator />

                {/* Fecha */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">
                      {format(new Date(transaction.createdAt), 'dd/MM/yyyy', {
                        locale: es,
                      })}
                    </div>
                    <div className="text-xs">
                      {format(new Date(transaction.createdAt), 'HH:mm', {
                        locale: es,
                      })}
                    </div>
                  </div>
                </div>

                {/* Montos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <CircleDollarSign className="h-4 w-4 text-blue-500" />
                      <span>
                        {transaction.type === 'WITHDRAWAL' ||
                        transaction.amount === 0
                          ? 'Monto:'
                          : 'Monto total:'}
                      </span>
                    </div>
                    <div className="font-mono font-semibold">
                      {formatCurrency(transaction.amount, 'PEN')}
                    </div>
                  </div>

                  {transaction.type !== 'WITHDRAWAL' &&
                    transaction.amount > 0 &&
                    transaction.pendingAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>Pendiente:</span>
                        </div>
                        <div className="font-mono text-yellow-700 dark:text-yellow-400">
                          {formatCurrency(transaction.pendingAmount, 'PEN')}
                        </div>
                      </div>
                    )}

                  {transaction.type !== 'WITHDRAWAL' &&
                    transaction.amount > 0 &&
                    transaction.withdrawnAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Download className="h-4 w-4 text-green-500" />
                          <span>Retirado:</span>
                        </div>
                        <div className="font-mono text-green-700 dark:text-green-400">
                          {formatCurrency(transaction.withdrawnAmount, 'PEN')}
                        </div>
                      </div>
                    )}
                </div>

                <Separator />

                {/* Acciones */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMetadataModal(transaction.metadata)}
                    disabled={!hasMetadata}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Metadata
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <Link
                      href={`/dashboard/cli-puntos/historial-puntos/detalle-transaccion/${transaction.id}`}
                    >
                      <Eye className="h-4 w-4" />
                      Detalle
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <MetadataModal
        isOpen={selectedMetadata.isOpen}
        onClose={closeMetadataModal}
        metadata={selectedMetadata.metadata}
      />
    </div>
  );
}
