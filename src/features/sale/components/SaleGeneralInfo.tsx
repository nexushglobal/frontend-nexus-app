'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaleDetail } from '@/features/sale/types/sale.types';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import {
  AlertCircle,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Phone,
  User,
  Users,
} from 'lucide-react';

interface Props {
  sale: SaleDetail;
}

export default function SaleGeneralInfo({ sale }: Props) {
  const getTotalPaid = () => {
    return (
      sale.paymentsSummary
        ?.filter((payment) => payment.status === 'APPROVED')
        .reduce((total, payment) => total + payment.amount, 0) || 0
    );
  };

  const getPendingAmount = () => {
    return Number(sale.totalAmount) - getTotalPaid();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Detalles de personas involucradas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <User className="h-4 w-4 text-blue-500" />
              Cliente
            </h4>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {sale.client.firstName} {sale.client.lastName}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Cliente principal
                    </p>
                  </div>
                </div>
                {sale.client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {sale.client.phone}
                    </span>
                  </div>
                )}
                {sale.client.address && (
                  <div className="flex items-start gap-3">
                    <Home className="mt-0.5 h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {sale.client.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {sale.secondaryClients && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <Users className="h-4 w-4 text-green-500" />
                Compradores
              </h4>
              {sale.secondaryClients.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {item.firstName} {item.lastName}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          co-comprador
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        {item.phone}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Home className="mt-0.5 h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        {item.address}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {sale.guarantor && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <Users className="h-4 w-4 text-purple-500" />
                Garante
              </h4>
              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/20">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium text-purple-900 dark:text-purple-100">
                      {sale.guarantor.firstName} {sale.guarantor.lastName}
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Responsable subsidiario
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {sale.vendor && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                <User className="h-4 w-4 text-green-500" />
                Vendedor
              </h4>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {sale.vendor.firstName} {sale.vendor.lastName}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Doc: {sale.vendor.document}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Detalles del lote y financieros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <Building2 className="h-4 w-4 text-green-500" />
              Lote
            </h4>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {sale.lot.name}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Identificación
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {formatCurrency(Number(sale.lot.lotPrice), sale.currency)}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Precio del lote
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              Resumen financiero
            </h4>
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Precio del lote:
                  </span>
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">
                    {formatCurrency(Number(sale.lot.lotPrice), sale.currency)}
                  </span>
                </div>
                {sale.fromReservation && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">
                      Reserva:
                    </span>
                    <span className="font-medium text-yellow-900 dark:text-yellow-100">
                      {formatCurrency(
                        Number(sale.reservationAmount),
                        sale.currency,
                      )}
                    </span>
                  </div>
                )}
                <div className="border-t border-yellow-200 pt-2 dark:border-yellow-800">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-yellow-700 dark:text-yellow-300">
                      Total de la venta:
                    </span>
                    <span className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                      {formatCurrency(Number(sale.totalAmount), sale.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <CreditCard className="h-4 w-4 text-indigo-500" />
              Resumen de pagos
            </h4>

            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Total pagado
                    </p>
                    <p className="font-bold text-emerald-800 dark:text-emerald-200">
                      {formatCurrency(getTotalPaid(), sale.currency)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Pendiente
                    </p>
                    <p className="font-bold text-amber-800 dark:text-amber-200">
                      {formatCurrency(getPendingAmount(), sale.currency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de pagos */}
            {sale.paymentsSummary && sale.paymentsSummary.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pagos registrados ({sale.paymentsSummary.length})
                </p>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {sale.paymentsSummary.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(payment.amount, sale.currency)}
                            </span>
                            {<Badge variant="default">{sale.status}</Badge>}
                          </div>

                          <div className="grid grid-cols-1 gap-1 text-xs text-gray-500 sm:grid-cols-2 dark:text-gray-400">
                            {payment.banckName && (
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                <span>{payment.banckName}</span>
                              </div>
                            )}
                            {payment.codeOperation && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>Op: {payment.codeOperation}</span>
                              </div>
                            )}
                            {payment.dateOperation && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(payment.dateOperation)}</span>
                              </div>
                            )}
                            {payment.paymentConfig && (
                              <div className="flex items-center gap-1">
                                <span className="truncate">
                                  {payment.paymentConfig}
                                </span>
                              </div>
                            )}
                          </div>

                          {payment.numberTicket && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Boleta: {payment.numberTicket}
                            </div>
                          )}

                          {payment.reason && (
                            <div className="rounded bg-red-50 p-2 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-400">
                              <strong>Motivo:</strong> {payment.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center dark:border-gray-700">
                <CreditCard className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No hay pagos registrados
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
