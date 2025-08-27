'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrderResult } from '@/features/ecommerce/types/order.type';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { CheckCircle, Edit, Package, RefreshCw, XCircle } from 'lucide-react';
import { PaymentResponse } from './BasePaymentSheet';

interface OrderResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PaymentResponse<OrderResult> | null;
  onRetry: () => void;
  onEdit: () => void;
}

export function OrderResultModal({
  isOpen,
  onClose,
  result,
  onRetry,
  onEdit,
}: OrderResultModalProps) {
  if (!result) return null;

  const { success, message, data, errors } = result;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {success ? 'Pedido Exitoso' : 'Error en el Pedido'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border ${
              success
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20'
            }`}
          >
            <p
              className={`text-sm ${
                success
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {message}
            </p>
            {errors && (
              <p className="text-xs text-red-600 mt-2 dark:text-red-400">
                {errors}
              </p>
            )}
          </div>

          {success && data && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Monto Total:</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(data.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">ID de Pago:</span>
                  <span className="font-mono text-sm">{data.paymentId}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Total de Items:</span>
                  <span className="text-sm">{data.order.totalItems}</span>
                </div>
              </div>

              {/* Lista de productos */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos del pedido:
                </h4>
                <div className="space-y-2">
                  {data.order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800/40">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>¡Pedido procesado exitosamente!</strong>
                  <br />
                  Tu orden ha sido registrada y será procesada pronto.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            {!success && (
              <>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button onClick={onRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              </>
            )}
            <Button
              variant={success ? 'default' : 'secondary'}
              onClick={onClose}
            >
              {success ? 'Continuar' : 'Cerrar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
