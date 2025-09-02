'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import {
  formatSimpleId,
  formatTableAmount,
  formatTableDate,
} from '@/features/shared/utils/table.utils';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { CalendarDays, Eye, Package2, ShoppingCart } from 'lucide-react';
import { OrderStatus } from '../../../types/enums-orders';
import type { OrderClientItem } from '../../../types/order.type';

export interface OrderClientColumnsProps {
  onViewDetail: (orderId: number) => void;
  onPreview: (order: OrderClientItem) => void;
}

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
        <div className="font-medium text-primary">
          {formatSimpleId(row.getValue('id') as number)}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as OrderStatus;
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
        const { formatted } = formatTableAmount(amount);
        return <div className="font-bold text-lg">{formatted}</div>;
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
        const dateString = row.getValue('createdAt') as string;
        const { date, time } = formatTableDate(dateString);
        return (
          <div className="space-y-1">
            <div className="font-medium">{date}</div>
            <div className="text-xs text-muted-foreground">{time}</div>
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
  totalItems: false,
  totalAmount: true,
  createdAt: true,
  actions: true,
};
