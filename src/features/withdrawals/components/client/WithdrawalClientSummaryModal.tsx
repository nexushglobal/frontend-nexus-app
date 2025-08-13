'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import Link from 'next/link';
import { WithdrawalClient } from '../../types/withdrawals.types';

export function WithdrawalClientSummaryModal({
  open,
  onOpenChange,
  withdrawal,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  withdrawal: WithdrawalClient | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Resumen de Retiro</DialogTitle>
        </DialogHeader>
        {withdrawal && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ID #{withdrawal.id}
              </div>
              <StatusBadge status={withdrawal.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">
                  Fecha de solicitud
                </div>
                <div className="font-medium">
                  {formatDate(withdrawal.createdAt)}
                </div>
              </div>
              {withdrawal.reviewedAt && (
                <div>
                  <div className="text-xs text-muted-foreground">
                    Fecha revisión
                  </div>
                  <div className="font-medium">
                    {formatDate(withdrawal.reviewedAt)}
                  </div>
                </div>
              )}
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Monto</div>
                <div className="text-xl font-bold">
                  {formatCurrency(withdrawal.amount, 'PEN')}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Banco</div>
                <div className="font-medium">{withdrawal.bankName}</div>
                <div className="text-xs text-muted-foreground">
                  {withdrawal.accountNumber}
                </div>
              </div>
            </div>

            {withdrawal.metadata &&
              Object.keys(withdrawal.metadata).length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Metadata</div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="w-1/3">Clave</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(withdrawal.metadata).map(
                          ([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium align-top">
                                {key}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {typeof value === 'object' && value !== null
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
              {withdrawal && (
                <Link
                  href={`/dashboard/(cliente)/cli-mis-retiros/detalle/${withdrawal.id}`}
                >
                  <Button>Ver Detalle</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
