'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaleDetail } from '@/features/sale/types/sale.types';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { Calendar, CreditCard, DollarSign, Percent } from 'lucide-react';
import { createPaymentScheduleColumns } from './columns/PaymentScheduleColumns';

export default function SaleFinancingInfo({ sale }: { sale: SaleDetail }) {
  if (!sale.financing) return null;

  const handleViewPayments = (installmentId: string) => {
    console.log('Ver pagos de la cuota:', installmentId);
  };

  const columns = createPaymentScheduleColumns({
    currency: sale.currency,
    onViewPayments: handleViewPayments,
  });

  const paidInstallments = sale.financing.financingInstallments.filter(
    (i) => i.status === 'paid',
  ).length;

  return (
    <div className="space-y-6">
      {/* Información de financiamiento */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Información de financiamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Monto inicial</span>
              </div>
              <p className="mt-1 text-xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(
                  Number(sale.financing.initialAmount),
                  sale.currency,
                )}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/20">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">Tasa de interés</span>
              </div>
              <p className="mt-1 text-xl font-bold text-purple-700 dark:text-purple-300">
                {sale.financing.interestRate}%
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Cuotas</span>
              </div>
              <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-300">
                {sale.financing.quantityCoutes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cronograma de pagos */}
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              Cronograma de pagos
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                {paidInstallments} de{' '}
                {sale.financing.financingInstallments.length} pagadas
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={sale.financing.financingInstallments}
            emptyMessage="sin cronograma de pagosF..."
            className="border-0"
          />
        </CardContent>
      </Card>
    </div>
  );
}
