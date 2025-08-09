'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { Eye, ShoppingCart } from 'lucide-react';
import type { OrderAdminItem } from '../../../types/order.type';

export interface OrderAdminColumnsProps {
  onViewDetail: (orderId: number) => void;
  onPreview: (order: OrderAdminItem) => void;
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

export function createOrderAdminColumns({
  onViewDetail,
  onPreview,
}: OrderAdminColumnsProps): ColumnDef<OrderAdminItem>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue('id')}</div>
      ),
      size: 80,
    },
    {
      accessorKey: 'userName',
      header: 'Cliente',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('userName')}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.userEmail}
          </div>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant="outline" className={getStatusBadgeVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'totalItems',
      header: 'Items',
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue('totalItems')}
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => {
        const amount = row.getValue('totalAmount') as number;
        return <div className="font-medium">${amount.toLocaleString()}</div>;
      },
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div>
            <div className="font-medium">
              {date.toLocaleDateString('es-ES')}
            </div>
            <div className="text-sm text-muted-foreground">
              {date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
      size: 120,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(order)}
              title="Vista previa"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetail(order.id)}
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      size: 100,
    },
  ];
}

export const defaultColumnVisibility: VisibilityState = {
  id: true,
  userName: true,
  status: true,
  totalItems: true,
  totalAmount: true,
  createdAt: true,
  actions: true,
};
