import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CreditCard, ExternalLink, Info, X } from 'lucide-react';
import Link from 'next/link';
import { Transaction } from '../../types/points.types';

interface Props {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, open, onClose }: Props) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Detalles de la Transacción
          </DialogTitle>
          <DialogDescription>
            Información completa de la transacción #{transaction.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-medium">
                <StatusBadge status={transaction.type} />
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <StatusBadge status={transaction.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cantidad</p>
              <p className="text-xl font-bold text-primary">
                {transaction.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="font-medium">
                  {format(new Date(transaction.createdAt), 'PPP', {
                    locale: es,
                  })}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(transaction.createdAt), 'HH:mm:ss')}
              </p>
            </div>
          </div>

          {transaction.metadata &&
            Object.keys(transaction.metadata).length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Info className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Información adicional</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md space-y-2">
                    {Object.entries(transaction.metadata).map(
                      ([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}:
                          </p>
                          <p className="text-xs font-medium">
                            {value !== null && value !== undefined
                              ? String(value)
                              : '-'}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
        </div>

        <DialogFooter className="flex sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>

          <Link
            href={`/dashboard/historial-puntos/detalle/${transaction.id}`}
            className="flex-1"
            onClick={onClose}
          >
            <Button className="w-full" variant="default">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Detalle Completo
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
