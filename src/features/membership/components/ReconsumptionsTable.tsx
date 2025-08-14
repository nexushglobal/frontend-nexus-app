'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReconsumtionItem } from '../types/reconsumption.type';

interface Props {
  items: ReconsumtionItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading?: boolean;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  onOpenPaymentDetails: (data: Record<string, any>) => void;
}

export function ReconsumptionsTable({
  items,
  pagination,
  isLoading,
  onPageChange,
  onLimitChange,
  onOpenPaymentDetails,
}: Props) {
  const columns: ColumnDef<ReconsumtionItem>[] = [
    {
      header: 'Periodo',
      accessorKey: 'periodDate',
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.periodDate)}</span>
      ),
    },
    {
      header: 'Monto',
      accessorKey: 'amount',
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ getValue }) => (
        <span className="uppercase text-xs px-2 py-1 rounded bg-muted">
          {String(getValue())}
        </span>
      ),
    },
    {
      header: 'Referencia',
      accessorKey: 'paymentReference',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {String(getValue() || '-')}
        </span>
      ),
    },
    {
      header: 'Detalles de pago',
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
          >
            Ver detalles
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      enableSorting: false,
    },
    {
      header: 'Notas',
      accessorKey: 'notes',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {String(getValue() || '-')}
        </span>
      ),
    },
    {
      header: 'Creado',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="text-sm">
          {formatDate(row.original.createdAt, 'dd/MM/yyyy HH:mm')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mobile: Cards */}
      <div className="grid gap-3 sm:hidden">
        {(!items || items.length === 0) && (
          <div className="text-center text-muted-foreground py-8 text-sm">
            Sin reconsumos
          </div>
        )}
        {items?.map((it) => (
          <Card key={it.id} className="shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{formatDate(it.periodDate)}</div>
                <div
                  className={cn('text-xs px-2 py-1 rounded bg-muted uppercase')}
                >
                  {it.status}
                </div>
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(it.amount)}
              </div>
              <div className="text-sm text-muted-foreground">
                Ref: {it.paymentReference || '-'}
              </div>
              <div className="text-sm text-muted-foreground">
                {it.notes || '-'}
              </div>
              <div className="flex justify-end">
                {it.paymentDetails ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onOpenPaymentDetails(
                        it.paymentDetails as Record<string, any>,
                      )
                    }
                  >
                    Ver detalles
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Sin detalles
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block">
        <DataTable<ReconsumtionItem, unknown>
          columns={columns}
          data={items || []}
          isLoading={isLoading}
          emptyMessage="Sin reconsumos"
        />
      </div>

      {pagination && (
        <Card className="shadow-sm p-1">
          <CardContent>
            <TablePagination
              pagination={pagination}
              onPageChange={onPageChange}
              onLimitChange={(l) => {
                onLimitChange(l);
                onPageChange(1);
              }}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
