'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { VisibilityState } from '@tanstack/react-table';
import { Eye, Receipt } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReconsumtionItem } from '../types/reconsumption.type';
import {
  createReconsumptionsColumns,
  defaultColumnVisibility,
} from './columns/reconsumptionsColumns';

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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );

  const columns = useMemo(
    () =>
      createReconsumptionsColumns({
        onOpenPaymentDetails,
      }),
    [onOpenPaymentDetails],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Historial de Reconsumos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: Enhanced Cards */}
          <div className="grid gap-4 sm:hidden">
            {(!items || items.length === 0) && (
              <div className="text-center text-muted-foreground py-12">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Sin reconsumos</p>
                <p className="text-sm">Aún no tienes reconsumos registrados</p>
              </div>
            )}
            {items?.map((it) => (
              <Card
                key={it.id}
                className="shadow-sm border-l-4 border-l-primary/60"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                      <span className="font-semibold">
                        {formatDate(it.periodDate)}
                      </span>
                    </div>
                    <StatusBadge status={it.status} />
                  </div>

                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(it.amount)}
                  </div>

                  {it.paymentReference && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        REFERENCIA DE PAGO
                      </p>
                      <div className="bg-muted/50 px-2 py-1 rounded-md">
                        <code className="text-xs font-mono">
                          {it.paymentReference}
                        </code>
                      </div>
                    </div>
                  )}

                  {it.notes && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        NOTAS
                      </p>
                      <p className="text-sm">{it.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(it.createdAt, 'dd/MM/yyyy HH:mm')}
                    </span>
                    {it.paymentDetails ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onOpenPaymentDetails(
                            it.paymentDetails as Record<string, any>,
                          )
                        }
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver detalles
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: Enhanced Table */}
          <div className="hidden sm:block">
            <DataTable<ReconsumtionItem, unknown>
              columns={columns}
              data={items || []}
              isLoading={isLoading}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              emptyMessage="Sin reconsumos registrados"
              getRowClassName={(row) => {
                const item = row.original as ReconsumtionItem;
                const isPending = item.status === 'PENDING';
                return isPending
                  ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-400'
                  : '';
              }}
            />
          </div>
        </CardContent>
      </Card>

      {pagination && (
        <Card className="shadow-sm py-0">
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
