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
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border shadow-md bg-card">
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <span className="text-foreground">Resumen de Pagos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-success/20 border border-success/40">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-3xl font-bold text-success">
                {formatAmount(totalAmount)}
              </p>
              <p className="text-sm font-medium text-success/80">Total pagado</p>
            </div>
            <div className="text-center p-4 bg-info/10 border border-info/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-info/20 border border-info/40">
                  <Receipt className="h-6 w-6 text-info" />
                </div>
              </div>
              <p className="text-3xl font-bold text-info">
                {allPayments.length}
              </p>
              <p className="text-sm font-medium text-info/80">
                {allPayments.length === 1 ? 'Transacción' : 'Transacciones'}
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/40">
                  <Tag className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary">
                {Object.keys(paymentsByMethod).length}
              </p>
              <p className="text-sm font-medium text-secondary/80">
                {Object.keys(paymentsByMethod).length === 1 ? 'Método' : 'Métodos'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <Card className="border shadow-md">
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/30">
              <Tag className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-foreground">Resumen por Método de Pago</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(paymentsByMethod).map(([method, payments]) => {
              const methodTotal = payments.reduce((sum, p) => sum + p.amount, 0);
              return (
                <Card
                  key={method}
                  className="border shadow-sm hover:shadow-md transition-shadow bg-card hover:bg-card-hover"
                >
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        {getPaymentMethodBadge(method)}
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {formatAmount(methodTotal)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total método</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Payments Grid */}
      <Card className="border shadow-md">
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10 border border-chart-3/30">
              <CreditCard className="h-4 w-4 text-chart-3" />
            </div>
            <span className="text-foreground">Detalle de Todos los Pagos</span>
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {allPayments.length} {allPayments.length === 1 ? 'pago' : 'pagos'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {allPayments.map((payment, index) => (
              <Card 
                key={`${payment.paymentId}-${index}`} 
                className="border shadow-sm hover:shadow-md transition-shadow bg-card hover:bg-card-hover"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header with ID and Method */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/30">
                          <Hash className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-mono text-sm font-bold text-foreground">#{payment.paymentId}</span>
                      </div>
                      {getPaymentMethodBadge(payment.paymentMethod)}
                    </div>

                    {/* Amount - Main highlight */}
                    <div className="text-center p-4 bg-success/10 border border-success/30 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-6 w-6 text-success" />
                      </div>
                      <p className="text-2xl font-bold text-success">
                        {formatAmount(payment.amount)}
                      </p>
                      <p className="text-xs font-medium text-success/80">Monto del pago</p>
                    </div>

                    {/* Operation Code */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Código de Operación</span>
                      </div>
                      {payment.operationCode ? (
                        <p className="font-mono text-xs bg-warning/10 border border-warning/30 p-2 rounded text-warning">
                          {payment.operationCode}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded border italic">
                          No disponible
                        </p>
                      )}
                    </div>

                    {/* Ticket Number */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">N° de Ticket</span>
                      </div>
                      {payment.ticketNumber ? (
                        <p className="font-mono text-xs bg-info/10 border border-info/30 p-2 rounded text-info">
                          {payment.ticketNumber}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded border italic">
                          No disponible
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}