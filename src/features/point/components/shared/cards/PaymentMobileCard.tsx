'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PAYMENT_METHODS } from '@/features/point/constants';
import { PaymentItem } from '@/features/point/types/points.types';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentMobileCardProps {
  payment: PaymentItem;
}

export function PaymentMobileCard({ payment }: PaymentMobileCardProps) {
  const paymentMethodLabel =
    PAYMENT_METHODS[payment.paymentMethod] || payment.paymentMethod;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {paymentMethodLabel}
          </Badge>
          <span className="text-sm text-muted-foreground">#{payment.id}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monto</span>
            <span className="font-semibold">
              {formatCurrency(payment.amount, 'PEN')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Referencia</span>
            <span className="text-sm font-mono">
              {payment.paymentReference}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Fecha</span>
            <span className="text-sm">
              {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', {
                locale: es,
              })}
            </span>
          </div>
        </div>

        {payment.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">Notas</p>
            <p className="text-sm">{payment.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
