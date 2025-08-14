'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CircleDollarSign, Clock } from 'lucide-react';
import { LOT_TRANSACTION_TYPES, TRANSACTION_STATUS } from '../constants';
import { PointLotTransactionBase } from '../types/points.types';

interface PointLotTransactionsCardsProps {
  data: PointLotTransactionBase[];
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

export function PointLotTransactionsCards({
  data,
}: PointLotTransactionsCardsProps) {
  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground">
            No se encontraron transacciones de lote
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((transaction) => {
        const isWithdrawal = transaction.type === 'LOT_WITHDRAWAL';
        const isZeroAmount = transaction.amount === 0;
        const shouldShowOnlyTotal = isWithdrawal || isZeroAmount;

        return (
          <Card
            key={transaction.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header con fecha y tipo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">
                        {format(new Date(transaction.createdAt), 'dd/MM/yyyy', {
                          locale: es,
                        })}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(transaction.createdAt), 'HH:mm', {
                          locale: es,
                        })}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={typeVariants[transaction.type]}
                    className={typeColors[transaction.type]}
                  >
                    {LOT_TRANSACTION_TYPES[transaction.type]}
                  </Badge>
                </div>

                <Separator />

                {/* Montos */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Monto
                    </span>
                  </div>

                  {shouldShowOnlyTotal ? (
                    <div className="font-semibold text-lg">
                      <span className="font-mono">
                        {formatCurrency(transaction.amount, 'PEN')}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-semibold">
                        <span className="text-sm text-muted-foreground">
                          Total:{' '}
                        </span>
                        <span className="font-mono">
                          {formatCurrency(transaction.amount, 'PEN')}
                        </span>
                      </div>
                      {transaction.pendingAmount > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Pendiente:{' '}
                          </span>
                          <span className="font-mono text-yellow-700 dark:text-yellow-400">
                            {formatCurrency(transaction.pendingAmount, 'PEN')}
                          </span>
                        </div>
                      )}
                      {transaction.withdrawnAmount > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Retirado:{' '}
                          </span>
                          <span className="font-mono text-green-700 dark:text-green-400">
                            {formatCurrency(transaction.withdrawnAmount, 'PEN')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Estado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Estado
                    </span>
                  </div>
                  <Badge
                    variant={statusVariants[transaction.status]}
                    className={statusColors[transaction.status]}
                  >
                    {TRANSACTION_STATUS[transaction.status]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
