'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, DollarSign, Eye, Phone, User } from 'lucide-react';
import type { Sale } from '../../types/sale.types';

interface CreateSalesColumnsProps {
  onViewDetail: (referenceId: string) => void;
}

export function createSalesColumns({
  onViewDetail,
}: CreateSalesColumnsProps): ColumnDef<Sale>[] {
  return [
    {
      accessorKey: 'clientFullName',
      header: 'Cliente',
      cell: ({ row }) => {
        const clientName = row.getValue('clientFullName') as string;
        const phone = row.original.phone;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{clientName}</span>
              {phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{phone}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'saleIdReference',
      header: 'ID Venta',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          #{row.getValue('saleIdReference')}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <Badge variant="destructive">{type}</Badge>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return <Badge variant="secondary">{status}</Badge>;
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = row.getValue('amount') as string;
        const currency = row.original.currency;
        const numAmount = parseFloat(amount);
        const formattedAmount = new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
        }).format(numAmount);

        return (
          <div className="flex items-center gap-2 text-right">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{formattedAmount}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'numberCoutes',
      header: 'Cuotas',
      cell: ({ row }) => {
        const coutes = row.getValue('numberCoutes') as number;
        return (
          <div className="text-center">
            <span className="text-sm font-medium">{coutes || '--'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'lotTransactionRole',
      header: 'Transacción Lote',
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <span className="text-sm font-medium">
              {row.getValue('lotTransactionRole')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha Creación',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        const formattedDate = new Date(date).toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const formattedTime = new Date(date).toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formattedDate}</span>
              <span className="text-xs text-muted-foreground">
                {formattedTime}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const sale = row.original;
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetail(sale.saleIdReference)}
              className="h-8 px-2 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver detalle</span>
            </Button>
          </div>
        );
      },
    },
  ];
}

export const defaultColumnVisibility = {
  saleIdReference: false,
  createdAt: false,
};

export function getSalesColumns(
  options: CreateSalesColumnsProps & {
    hideColumns?: string[];
    customColumnVisibility?: Record<string, boolean>;
  },
) {
  const columns = createSalesColumns(options);

  if (options.hideColumns)
    return columns.filter(
      (col) =>
        !options.hideColumns?.includes(
          typeof col.id === 'string' ? col.id : '',
        ),
    );

  return columns;
}
