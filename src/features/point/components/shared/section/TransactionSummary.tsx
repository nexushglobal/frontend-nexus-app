'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from '@/features/point/constants';
import { PointTransactionDetailResponse } from '@/features/point/types/points.types';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, DollarSign, Hash } from 'lucide-react';

interface TransactionSummaryProps {
  transaction: PointTransactionDetailResponse;
}

export function TransactionSummary({ transaction }: TransactionSummaryProps) {
  const statusVariant = getStatusVariant(transaction.status);
  const statusColor = getStatusColor(transaction.status);
  const typeVariant = getTypeVariant(transaction.type);
  const typeColor = getTypeColor(transaction.type);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Información básica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">ID de Transacción</p>
            <p className="font-semibold">#{transaction.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo</p>
            <Badge variant={typeVariant} className={typeColor}>
              {TRANSACTION_TYPES[transaction.type]}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <Badge variant={statusVariant} className={statusColor}>
              {TRANSACTION_STATUS[transaction.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información de montos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Detalles de Montos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Monto Total</p>
            <p className="font-semibold text-lg">
              {formatCurrency(transaction.amount, 'PEN')}
            </p>
          </div>
          {transaction.pendingAmount > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Monto Pendiente</p>
              <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                {formatCurrency(transaction.pendingAmount, 'PEN')}
              </p>
            </div>
          )}
          {transaction.withdrawnAmount > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Monto Retirado</p>
              <p className="font-semibold text-green-700 dark:text-green-400">
                {formatCurrency(transaction.withdrawnAmount, 'PEN')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de fechas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Fechas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Fecha de Creación</p>
            <p className="font-semibold">
              {format(new Date(transaction.createdAt), 'dd/MM/yyyy', {
                locale: es,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(transaction.createdAt), 'HH:mm:ss', {
                locale: es,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Última Actualización
            </p>
            <p className="font-semibold">
              {format(new Date(transaction.updatedAt), 'dd/MM/yyyy', {
                locale: es,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(transaction.updatedAt), 'HH:mm:ss', {
                locale: es,
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility functions
function getStatusVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    PENDING: 'outline' as const,
    COMPLETED: 'secondary' as const,
    CANCELLED: 'outline' as const,
    FAILED: 'destructive' as const,
  };
  return variants[status as keyof typeof variants] || 'outline';
}

function getStatusColor(status: string): string {
  const colors = {
    PENDING:
      'text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600',
    COMPLETED:
      'text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-600',
    CANCELLED:
      'text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600',
    FAILED: 'text-red-700 dark:text-red-400',
  };
  return colors[status as keyof typeof colors] || '';
}

function getTypeVariant(
  type: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    BINARY_COMMISSION: 'secondary' as const,
    DIRECT_BONUS: 'secondary' as const,
    WITHDRAWAL: 'outline' as const,
  };
  return variants[type as keyof typeof variants] || 'secondary';
}

function getTypeColor(type: string): string {
  const colors = {
    BINARY_COMMISSION:
      'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600',
    DIRECT_BONUS: 'text-purple-700 dark:text-purple-400',
    WITHDRAWAL: 'text-orange-700 dark:text-orange-400',
  };
  return colors[type as keyof typeof colors] || '';
}
