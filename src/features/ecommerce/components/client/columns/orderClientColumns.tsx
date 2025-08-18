'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { CalendarDays, Eye, Package2, ShoppingCart } from 'lucide-react';
import type { OrderClientItem } from '../../../types/order.type';

export interface OrderClientColumnsProps {
  onViewDetail: (orderId: number) => void;
  onPreview: (order: OrderClientItem) => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'SENT':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DELIVERED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'CANCELED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'APPROVED':
      return 'Aprobado';
    case 'SENT':
      return 'Enviado';
    case 'DELIVERED':
      return 'Entregado';
    case 'REJECTED':
      return 'Rechazado';
    case 'CANCELED':
      return 'Cancelado';
    default:
      return status;
  }
};

export function createOrderClientColumns({
  onViewDetail,
  onPreview,
}: OrderClientColumnsProps): ColumnDef<OrderClientItem>[] {
  return [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex items-center gap-2">
          <Package2 className="h-4 w-4 text-primary" />
          <span>Pedido</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary">#{row.getValue('id')}</div>
      ),
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant="outline" className={`${getStatusBadgeVariant(status)} font-medium`}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
      size: 130,
    },
    {
      accessorKey: 'totalItems',
      header: 'Items',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {row.getValue('totalItems')} items
          </span>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => {
        const amount = row.getValue('totalAmount') as number;
        return (
          <div className="font-bold text-lg">{formatCurrency(amount, 'PEN')}</div>
        );
      },
      size: 130,
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Fecha</span>
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
      size: 140,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(order)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title="Vista rápida"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewDetail(order.id)}
              className="h-8 px-3 text-xs"
              title="Ver detalle completo"
            >
              <Eye className="h-3 w-3 mr-1" />
              Detalle
            </Button>
          </div>
        );
      },
      size: 120,
    },
  ];
}

export const defaultClientColumnVisibility: VisibilityState = {
  id: true,
  status: true,
  totalItems: true,
  totalAmount: true,
  createdAt: true,
  actions: true,
};
