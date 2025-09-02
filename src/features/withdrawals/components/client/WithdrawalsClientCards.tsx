'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { formatTableAmount, formatDate, formatWithdrawalId } from '@/features/shared/utils/table.utils';
import { Banknote, Building2, CalendarDays, Eye, Info } from 'lucide-react';
import Link from 'next/link';
import { WithdrawalClient } from '../../types/withdrawals.types';

export function WithdrawalsClientCards({
  data,
  onOpenSummary,
}: {
  data: WithdrawalClient[];
  onOpenSummary: (w: WithdrawalClient) => void;
}) {
  if (!data?.length) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Banknote className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tienes retiros registrados</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Cuando solicites retiros, aparecerán aquí para tu seguimiento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((w) => (
        <Card key={w.id} className="shadow-sm border-l-4 border-l-primary/20 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Retiro {formatWithdrawalId(w.id)}
              </CardTitle>
              {(() => {
                const statusConfig = getStatusConfig(w.status);
                return (
                  <Badge
                    variant={statusConfig.variant}
                    className={statusConfig.className}
                  >
                    {statusConfig.label}
                  </Badge>
                );
              })()}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Bank Info */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4" />
                  <h4 className="font-medium text-sm">{w.bankName}</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cuenta: {w.accountNumber}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold">{formatTableAmount(w.amount).formatted}</p>
                  <p className="text-xs text-muted-foreground">Monto</p>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <CalendarDays className="h-4 w-4 mx-auto mb-1" />
                  <p className="text-xs font-medium">
                    {formatDate(w.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenSummary(w)}
                  className="flex-1 gap-2"
                >
                  <Info className="h-4 w-4" />
                  Vista rápida
                </Button>
                <Link href={`/dashboard/cli-transacciones/mis-retiros/detalle/${w.id}`} className="flex-1">
                  <Button
                    size="sm"
                    className="w-full gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle completo
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
