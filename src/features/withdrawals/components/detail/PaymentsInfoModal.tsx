'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Hash,
  Receipt,
  DollarSign,
  Tag,
  FileText,
} from 'lucide-react';
import { PaymentInfo } from '../../types/withdrawals.types';

interface PaymentsInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: PaymentInfo[] | null;
}

export function PaymentsInfoModal({
  open,
  onOpenChange,
  payments,
}: PaymentsInfoModalProps) {
  if (!payments) return null;

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

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Información de Pagos
            <span className="text-sm font-normal text-muted-foreground">
              ({payments.length} {payments.length === 1 ? 'pago' : 'pagos'})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 border-2 border-muted/80 mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hay pagos registrados
              </h3>
              <p className="text-sm text-muted-foreground">
                Esta transacción de puntos no tiene pagos asociados.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Total de Pagos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Suma de todos los pagos asociados
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatAmount(totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payments.length} transacciones
                    </p>
                  </div>
                </div>
              </div>

              {/* Payments Table */}
              <div className="border rounded-lg overflow-hidden">
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
                    {payments.map((payment, index) => (
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

              {/* Payment Methods Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['VOUCHER', 'POINTS', 'CARD', 'BANK_TRANSFER'].map((method) => {
                  const methodPayments = payments.filter(
                    (p) => p.paymentMethod.toUpperCase() === method
                  );
                  if (methodPayments.length === 0) return null;

                  const methodTotal = methodPayments.reduce(
                    (sum, p) => sum + p.amount,
                    0
                  );

                  return (
                    <div
                      key={method}
                      className="p-4 border border-muted/30 rounded-lg bg-muted/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        {getPaymentMethodBadge(method)}
                        <span className="text-sm font-medium text-muted-foreground">
                          {methodPayments.length}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-foreground">
                        {formatAmount(methodTotal)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}