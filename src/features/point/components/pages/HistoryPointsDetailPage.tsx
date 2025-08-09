'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { History, PiggyBank } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useTransactionDetail } from '../../hooks/useTransactionDetail';
import { TransactionsDetailTable } from '../tables/TransactionsDetailTable';
import { TransactionDetailCard } from '../TransactionDetailCars';

interface Props {
  id: string;
}

export default function HistoryPointDetailPage({ id }: Props) {
  const transactionId = Number(id);

  if (isNaN(transactionId)) {
    notFound();
  }

  const {
    transaction,
    isLoading,
    error,
    paymentsPage,
    paymentsPageSize,
    handlePageChange,
    handlePageSizeChange,
    refreshTransaction,
  } = useTransactionDetail({ transactionId });

  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle de Transacción"
        subtitle="Información detallada de la transacción y sus pagos asociados"
        variant="gradient"
        icon={PiggyBank}
        backUrl="/dashboard/cli-historial-puntos"
      />

      <div className="space-y-8 mt-6">
        <TransactionDetailCard
          transaction={transaction}
          isLoading={isLoading}
          error={error}
          onRefresh={refreshTransaction}
        />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <div className="inline-flex gap-2 items-center">
                <History />
                Historial de Transacciones
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsDetailTable
              isLoading={isLoading}
              data={transaction?.listPayments?.items || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
