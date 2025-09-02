'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentStatus } from '@/features/payment/types/enums-payments';
import { getStatusConfig, translatePaymentMethod } from '@/features/shared/utils/status.utils';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, CreditCard, Eye, Package } from 'lucide-react';
import Link from 'next/link';
import type { PaymentUser } from '../../../types/response-payment';
import {
  formatAmount,
  formatDate,
  formatTime,
} from '../../../utils/payement.utils';

export function createPaymentUserColumns(): ColumnDef<PaymentUser>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          #{row.getValue('id')}
        </span>
      ),
    },
    {
      id: 'paymentInfo',
      header: 'Información del Pago',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {payment.paymentConfig.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {payment.paymentConfig.description}
                </span>
              </div>
            </div>
            {payment.paymentMethod && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-muted-foreground">
                  {translatePaymentMethod(payment.paymentMethod)}
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
        const status: PaymentStatus = row.getValue('status');
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
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        return (
          <div className="flex items-center gap-2">
            <span className="text-base font-medium">
              {formatAmount(amount)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formatDate(date)}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(date)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Fecha de Actualización',
      cell: ({ row }) => {
        const date = row.getValue('updatedAt') as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formatDate(date)}</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(date)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Método de Pago',
      cell: ({ row }) => {
        const method = row.getValue('paymentMethod') as string;
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{method ? translatePaymentMethod(method) : 'No especificado'}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <Link
            href={`/dashboard/cli-transacciones/mis-pagos/detalle/${payment.id}`}
          >
            <Button variant="default" size="sm" className="h-8 px-3 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Detalle
            </Button>
          </Link>
        );
      },
    },
  ];
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility = {
  id: false, // Ocultar ID por defecto
  updatedAt: false, // Ocultar fecha de actualización por defecto
  paymentMethod: false, // Ocultar método de pago por defecto (se muestra en info)
};

// Función helper para obtener columnas con configuración personalizada
export function getPaymentUserColumns(options?: {
  hideColumns?: string[];
  customColumnVisibility?: Record<string, boolean>;
}) {
  const columns = createPaymentUserColumns();

  // Si se especificaron columnas a ocultar, filtrarlas
  if (options?.hideColumns) {
    return columns.filter(
      (col) =>
        !options.hideColumns?.includes(
          typeof col.id === 'string' ? col.id : '',
        ),
    );
  }

  return columns;
}
