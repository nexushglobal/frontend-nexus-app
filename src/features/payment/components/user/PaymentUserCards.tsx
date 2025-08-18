'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  CreditCard,
  DollarSign,
  Eye,
  Package2,
} from 'lucide-react';
import Link from 'next/link';
import { PaymentUser } from '../../types/response-payment';
import {
  formatAmount,
  formatDate,
  getStatusConfig,
} from '../../utils/payement.utils';

interface PaymentUserCardsProps {
  data: PaymentUser[];
}

export function PaymentUserCards({ data }: PaymentUserCardsProps) {
  if (!data?.length) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No tienes pagos registrados
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Cuando realices pagos, aparecerán aquí para tu seguimiento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((payment) => {
        const statusConfig = getStatusConfig(payment.status);

        return (
          <Card
            key={payment.id}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-primary" />
                  Pago #{payment.id}
                </CardTitle>
                <Badge
                  variant={statusConfig.variant}
                  className={`${statusConfig.className} font-medium`}
                >
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Payment Info */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">
                    {payment.paymentConfig.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {payment.paymentConfig.description}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-sm font-bold">
                      {formatAmount(payment.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">Monto</p>
                  </div>

                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <CreditCard className="h-4 w-4 mx-auto mb-1" />
                    <p className="text-xs font-medium truncate">
                      {payment.paymentMethod || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">Método</p>
                  </div>

                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <CalendarDays className="h-4 w-4 mx-auto mb-1" />
                    <p className="text-xs font-medium">
                      {formatDate(payment.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                  </div>
                </div>

                <Separator />

                {/* Action Button */}
                <Link
                  href={`/dashboard/cli-transacciones/mis-pagos/detalle/${payment.id}`}
                >
                  <Button variant="default" size="sm" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    Ver Detalle Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
