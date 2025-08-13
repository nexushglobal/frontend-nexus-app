'use client';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { Eye, Info } from 'lucide-react';
import Link from 'next/link';
import { Withdrawal } from '../../types/withdrawals.types';

export function WithdrawalsAdminCards({
  data,
  onOpenSummary,
}: {
  data: Withdrawal[];
  onOpenSummary: (w: Withdrawal) => void;
}) {
  if (!data?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((w) => (
        <Card key={w.id} className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                #{w.id} • {formatDate(w.createdAt)}
              </div>
              <StatusBadge status={w.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Monto</div>
                <div className="text-lg font-bold">
                  {formatCurrency(w.amount, 'PEN')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Usuario</div>
                <div className="font-medium">{w.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {w.user.email}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenSummary(w)}
              >
                <Info className="h-4 w-4 mr-1" /> Resumen
              </Button>
              <Link
                href={`/dashboard/(facturacion)/fac-retiros/detalle/${w.id}`}
              >
                <Button size="sm">
                  <Eye className="h-4 w-4 mr-1" /> Detalle
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
