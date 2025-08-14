'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { CreditCard } from 'lucide-react';
import type { PointTransactionDetailResponse } from '../types/points.types';
import { paymentColumns } from './PaymentColumns';
import { PaymentMobileCard } from './PaymentMobileCard';

interface PaymentHistoryProps {
  transactionDetail: PointTransactionDetailResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function PaymentHistory({
  transactionDetail,
  isLoading,
  onPageChange,
  onLimitChange,
}: PaymentHistoryProps) {
  // Preparar datos de paginación para los pagos
  const paginationInfo = {
    page: transactionDetail.listPayments?.pagination?.page || 1,
    limit: transactionDetail.listPayments?.pagination?.limit || 10,
    total: transactionDetail.listPayments?.pagination?.total || 0,
    totalPages: transactionDetail.listPayments?.pagination?.totalPages || 1,
  };

  const hasPayments =
    transactionDetail.listPayments?.items &&
    transactionDetail.listPayments.items.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Historial de Pagos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detalle de los pagos asociados a esta transacción
        </p>
      </CardHeader>
      <CardContent>
        {hasPayments ? (
          <div className="space-y-4">
            {/* Tabla responsive */}
            <div className="hidden md:block">
              <DataTable
                columns={paymentColumns}
                data={transactionDetail.listPayments?.items || []}
                isLoading={isLoading}
                emptyMessage="No hay pagos registrados para esta transacción"
              />
            </div>

            {/* Cards para móvil */}
            <div className="md:hidden space-y-4">
              {transactionDetail.listPayments?.items?.map((payment) => (
                <PaymentMobileCard key={payment.id} payment={payment} />
              ))}
            </div>

            {/* Paginación */}
            {transactionDetail.listPayments?.pagination?.totalPages &&
              transactionDetail.listPayments.pagination.totalPages > 1 && (
                <TablePagination
                  pagination={paginationInfo}
                  onPageChange={onPageChange}
                  onLimitChange={onLimitChange}
                  isLoading={isLoading}
                />
              )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay pagos registrados</p>
              <p className="text-sm">
                Esta transacción no tiene pagos asociados
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
