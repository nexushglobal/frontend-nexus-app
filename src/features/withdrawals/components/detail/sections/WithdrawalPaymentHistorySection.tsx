import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
          <Badge className="gap-1 bg-info/10 text-info border-info/30">
            <Receipt className="h-3 w-3" />
            Voucher
          </Badge>
        );
      case 'POINTS':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border-warning/30">
            <Tag className="h-3 w-3" />
            Puntos
          </Badge>
        );
      case 'CARD':
        return (
          <Badge className="gap-1 bg-success/10 text-success border-success/30">
            <CreditCard className="h-3 w-3" />
            Tarjeta
          </Badge>
        );
      case 'BANK_TRANSFER':
        return (
          <Badge className="gap-1 bg-secondary/10 text-secondary border-secondary/30">
            <CreditCard className="h-3 w-3" />
            Transferencia
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
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
      <Card className="border shadow-sm bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            Resumen de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {formatAmount(totalAmount)}
              </p>
              <p className="text-sm text-muted-foreground">Total pagado</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-info">
                {allPayments.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {allPayments.length === 1 ? 'Transacción' : 'Transacciones'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">
                {Object.keys(paymentsByMethod).length}
              </p>
              <p className="text-sm text-muted-foreground">
                {Object.keys(paymentsByMethod).length === 1 ? 'Método' : 'Métodos'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 border border-info/20">
              <Tag className="h-4 w-4 text-info" />
            </div>
            Resumen por Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(paymentsByMethod).map(([method, payments]) => {
              const methodTotal = payments.reduce((sum, p) => sum + p.amount, 0);
              return (
                <div
                  key={method}
                  className="p-4 border border-muted/30 rounded-lg bg-muted/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    {getPaymentMethodBadge(method)}
                    <span className="text-sm font-medium text-muted-foreground">
                      {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {formatAmount(methodTotal)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Payments Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
              <CreditCard className="h-4 w-4 text-secondary" />
            </div>
            Detalle de Todos los Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID Pago
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Método
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monto
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Código Op.
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      N° Ticket
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPayments.map((payment, index) => (
                  <TableRow key={`${payment.paymentId}-${index}`}>
                    <TableCell className="font-medium">
                      <span className="font-mono text-sm">
                        #{payment.paymentId}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(payment.paymentMethod)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">
                          {formatAmount(payment.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.operationCode ? (
                        <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                          {payment.operationCode}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No disponible
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.ticketNumber ? (
                        <span className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                          {payment.ticketNumber}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No disponible
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}