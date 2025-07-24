'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SaleDetail } from '@/features/sale/types/sale.types';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { cn } from '@/lib/utils';
import { Calendar, CreditCard, DollarSign, Percent, Table } from 'lucide-react';

export default function SaleFinancingInfo({ sale }: { sale: SaleDetail }) {
  if (!sale.financing) return null;

  return (
    <div className="space-y-6">
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

      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              Cronograma de pagos
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {
                  sale.financing.financingInstallments.filter(
                    (i) => i.status === 'paid',
                  ).length
                }{' '}
                de
                {sale.financing.financingInstallments.length} pagadas
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Cuota a pagar</TableHead>
                  <TableHead>Cuota pagada</TableHead>
                  <TableHead>Cuota Pendiente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha estimada de pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.financing.financingInstallments.map(
                  (installment, index) => (
                    <TableRow
                      key={installment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium text-blue-600 dark:text-gray-100">
                        {formatCurrency(
                          Number(installment.couteAmount),
                          sale.currency,
                        )}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-sm font-medium',
                          Number(installment.coutePaid) > 0
                            ? 'text-green-500'
                            : '',
                        )}
                      >
                        {formatCurrency(
                          Number(installment.coutePaid),
                          sale.currency,
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(
                          Number(installment.coutePending),
                          sale.currency,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {installment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(installment.expectedPaymentDate)}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
