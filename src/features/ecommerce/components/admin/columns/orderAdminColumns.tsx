'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { formatTableAmount, formatTableDate, formatSimpleId } from '@/features/shared/utils/table.utils';
import { OrderStatus } from '@/features/ecommerce/types/enums-orders';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { Eye, ShoppingCart, Calendar, User } from 'lucide-react';
import type { OrderAdminItem } from '../../../types/order.type';

export interface OrderAdminColumnsProps {
  onViewDetail: (orderId: number) => void;
  onPreview: (order: OrderAdminItem) => void;
}


export function createOrderAdminColumns({
  onViewDetail,
  onPreview,
}: OrderAdminColumnsProps): ColumnDef<OrderAdminItem>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-medium text-primary">{formatSimpleId(row.getValue('id'))}</div>
      ),
      size: 80,
    },
    {
      accessorKey: 'userName',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <div>
            <div className="font-medium">{row.getValue('userName')}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.userEmail}
            </div>
          </div>
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as OrderStatus;
        const config = getStatusConfig(status);
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
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
        const { formatted } = formatTableAmount(amount);
        return <div className="font-medium">{formatted}</div>;
      },
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => {
        const dateString = row.getValue('createdAt') as string;
        const { date, time } = formatTableDate(dateString);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{date}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
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
