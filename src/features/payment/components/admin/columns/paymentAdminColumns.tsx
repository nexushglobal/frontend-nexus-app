'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaymentStatus } from '@/features/payment/types/enums-payments';
import {
  getStatusConfig,
  translatePaymentMethod,
} from '@/features/shared/utils/status.utils';
import {
  formatTableAmount,
  formatTableDate,
} from '@/features/shared/utils/table.utils';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, ExternalLink, Package, User } from 'lucide-react';
import type { PaymentAdmin } from '../../../types/response-payment';

interface CreateAdminColumnsProps {
  onViewDetail: (paymentId: number) => void;
}

export function createPaymentAdminColumns({
  onViewDetail,
}: CreateAdminColumnsProps): ColumnDef<PaymentAdmin>[] {
  return [
    {
      accessorKey: 'user',
      header: 'Usuario',
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <p className=" flex space-x-1">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{user.fullName}</span>
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Doc: {user.documentNumber}
              </p>
            </div>
          </div>
        );
      },
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
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {payment.paymentMethod
                  ? translatePaymentMethod(payment.paymentMethod)
                  : 'No especificado'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'operation',
      header: 'Operación',
      cell: ({ row }) => {
        const payment = row.original;
        const { operationCode, ticketNumber } = payment;
        
        if (!operationCode && !ticketNumber) {
          return (
            <div className="text-sm text-muted-foreground">-</div>
          );
        }
        
        return (
          <div className="space-y-1">
            {operationCode && (
              <div className="text-sm">
                <span className="text-muted-foreground">Código:</span>
                <span className="ml-1 font-mono">{operationCode}</span>
              </div>
            )}
            {ticketNumber && (
              <div className="text-sm">
                <span className="text-muted-foreground">Ticket:</span>
                <span className="ml-1 font-mono">{ticketNumber}</span>
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
        const config = getStatusConfig(status);
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const { formatted } = formatTableAmount(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        const { date: formattedDate, time } = formatTableDate(date);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formattedDate}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
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
        const { date: formattedDate, time } = formatTableDate(date);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formattedDate}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(payment.id)}
            className="h-8 px-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Ver detalle</span>
          </Button>
        );
      },
    },
  ];
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility = {
  updatedAt: false, // Ocultar por defecto
};

// Función helper para obtener columnas con configuración personalizada
export function getPaymentAdminColumns(
  options: CreateAdminColumnsProps & {
    hideColumns?: string[];
    customColumnVisibility?: Record<string, boolean>;
  },
) {
  const columns = createPaymentAdminColumns(options);

  // Si se especificaron columnas a ocultar, filtrarlas
  if (options.hideColumns) {
    return columns.filter(
      (col) =>
        !options.hideColumns?.includes(
          typeof col.id === 'string' ? col.id : '',
        ),
    );
  }

  return columns;
}
