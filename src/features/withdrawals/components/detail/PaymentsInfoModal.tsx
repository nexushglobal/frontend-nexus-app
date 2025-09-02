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
import Link from 'next/link';

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
              {/* Compact Summary with Payment Methods */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {formatAmount(totalAmount)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {payments.length} transacciones
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
              </div>

              {/* Compact Payments List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Detalle de Transacciones
                </h4>
                {payments.map((payment, index) => (
                  <Link 
                    key={`${payment.paymentId}-${index}`}
                    href={`/dashboard/fac-pagos/detalle/${payment.paymentId}`}
                  >
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-medium">
                            #{payment.paymentId}
                          </span>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            {formatAmount(payment.amount)}
                          </div>
                        </div>
                      </div>
                      
                      {(payment.operationCode || payment.ticketNumber) && (
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          {payment.operationCode && (
                            <div>
                              <span>Cód. Op: </span>
                              <span className="font-mono">{payment.operationCode}</span>
                            </div>
                          )}
                          {payment.ticketNumber && (
                            <div>
                              <span>Ticket: </span>
                              <span className="font-mono">{payment.ticketNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}