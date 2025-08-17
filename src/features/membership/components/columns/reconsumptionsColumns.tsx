'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, CreditCard, Eye, Hash, Receipt } from 'lucide-react';
import type { ReconsumtionItem } from '../../types/reconsumption.type';

interface CreateReconsumptionsColumnsProps {
  onOpenPaymentDetails: (data: Record<string, any>) => void;
}

export function createReconsumptionsColumns({
  onOpenPaymentDetails,
}: CreateReconsumptionsColumnsProps): ColumnDef<ReconsumtionItem>[] {
  return [
    {
      accessorKey: 'periodDate',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Período
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary/60"></div>
          <span className="font-medium">
            {formatDate(row.original.periodDate)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Monto
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <span className="font-semibold text-lg">
            {formatCurrency(row.original.amount)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Estado
        </div>
      ),
      cell: ({ getValue }) => <StatusBadge status={String(getValue())} />,
    },
    {
      accessorKey: 'paymentReference',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Referencia de Pago
        </div>
      ),
      cell: ({ getValue }) => {
        const reference = getValue();
        return reference ? (
          <div className="bg-muted/50 px-2 py-1 rounded-md">
            <code className="text-xs font-mono">{String(reference)}</code>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Sin referencia</span>
        );
      },
    },
    {
      id: 'paymentDetails',
      header: 'Detalles de Pago',
      cell: ({ row }) =>
        row.original.paymentDetails ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onOpenPaymentDetails(
                row.original.paymentDetails as Record<string, any>,
              )
            }
            className="gap-1"
          >
            <Eye className="h-3 w-3" />
            Ver detalles
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      enableSorting: false,
    },
    {
      accessorKey: 'notes',
      header: 'Notas',
      cell: ({ getValue }) => {
        const notes = getValue();
        return notes ? (
          <div className="max-w-[200px] truncate" title={String(notes)}>
            <span className="text-sm">{String(notes)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Sin notas</span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de Creación',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt, 'dd/MM/yyyy HH:mm')}
        </span>
      ),
    },
  ];
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility = {
  paymentReference: false, // Ocultar referencia de pago por defecto
  createdAt: false, // Ocultar fecha de creación por defecto
};