import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CreditCard,
  DollarSign,
  FileText,
  Hash,
  Receipt,
  Tag,
} from 'lucide-react';
import { WithdrawalDetail, PaymentInfo } from '../../../types/withdrawals.types';
import Link from 'next/link';

interface WithdrawalPaymentHistorySectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalPaymentHistorySection({ withdrawal }: WithdrawalPaymentHistorySectionProps) {
  const getPaymentMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'VOUCHER':
        return (
          <Badge className="gap-1 bg-info/10 text-info border border-info/30 font-medium">
            <Receipt className="h-3 w-3" />
            Voucher
          </Badge>
        );
      case 'POINTS':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border border-warning/30 font-medium">
            <Tag className="h-3 w-3" />
            Puntos
          </Badge>
        );
      case 'CARD':
        return (
          <Badge className="gap-1 bg-success/10 text-success border border-success/30 font-medium">
            <CreditCard className="h-3 w-3" />
            Tarjeta
          </Badge>
        );
      case 'BANK_TRANSFER':
        return (
          <Badge className="gap-1 bg-secondary/10 text-secondary border border-secondary/30 font-medium">
            <CreditCard className="h-3 w-3" />
            Transferencia
          </Badge>
        );
      default:
        return (
          <Badge className="gap-1 bg-muted text-muted-foreground border font-medium">
            <DollarSign className="h-3 w-3" />
            {method}
          </Badge>
        );
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Collect all payments from all withdrawal points
  const allPayments: PaymentInfo[] = withdrawal.withdrawalPoints?.reduce((acc, point) => {
    return [...acc, ...(point.paymentsInfo || [])];
  }, [] as PaymentInfo[]) || [];

  const totalAmount = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Group payments by method
  const paymentsByMethod = allPayments.reduce((acc, payment) => {
    const method = payment.paymentMethod.toUpperCase();
    if (!acc[method]) {
      acc[method] = [];
    }
    acc[method].push(payment);
    return acc;
  }, {} as Record<string, PaymentInfo[]>);

  if (allPayments.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 border-2 border-muted/80 mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay pagos registrados
            </h3>
            <p className="text-sm text-muted-foreground">
              Este retiro no tiene pagos asociados registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Unified Compact Summary */}
      <Card className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {formatAmount(totalAmount)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {allPayments.length} transacciones - {Object.keys(paymentsByMethod).length} métodos
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(paymentsByMethod).map(([method, payments]) => {
              const methodTotal = payments.reduce((sum, p) => sum + p.amount, 0);
              return (
                <div
                  key={method}
                  className="px-3 py-1 bg-muted/50 rounded-md text-xs"
                >
                  <div className="flex items-center gap-1">
                    {getPaymentMethodBadge(method)}
                    <span className="font-mono text-muted-foreground">
                      {formatAmount(methodTotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Compact Payments Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Detalle de Transacciones
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPayments.map((payment, index) => (
            <Link 
              key={`${payment.paymentId}-${index}`}
              href={`/dashboard/fac-pagos/detalle/${payment.paymentId}`}
            >
              <Card className="p-4 bg-card hover:bg-muted/30 transition-colors cursor-pointer border-2 hover:border-primary/20">
                <div className="space-y-3">
                  {/* Header with ID and Method */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">
                      #{payment.paymentId}
                    </span>
                    {getPaymentMethodBadge(payment.paymentMethod)}
                  </div>
                  
                  {/* Amount - Prominent display */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {formatAmount(payment.amount)}
                    </div>
                  </div>
                  
                  {/* Details - Only if available */}
                  {(payment.operationCode || payment.ticketNumber) && (
                    <div className="space-y-1 text-xs text-muted-foreground border-t pt-2">
                      {payment.operationCode && (
                        <div className="flex justify-between">
                          <span>Cód. Op:</span>
                          <span className="font-mono">{payment.operationCode}</span>
                        </div>
                      )}
                      {payment.ticketNumber && (
                        <div className="flex justify-between">
                          <span>Ticket:</span>
                          <span className="font-mono">{payment.ticketNumber}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}