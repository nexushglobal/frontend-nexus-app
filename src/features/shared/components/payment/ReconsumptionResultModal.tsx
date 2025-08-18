'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { CheckCircle, XCircle, RefreshCw, Edit } from 'lucide-react';
import { PaymentResponse } from './BasePaymentSheet';
import { ReconsumtionResult } from '@/features/membership/types/reconsumption.type';

interface ReconsumptionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PaymentResponse<ReconsumtionResult> | null;
  onRetry: () => void;
  onEdit: () => void;
}

export function ReconsumptionResultModal({
  isOpen,
  onClose,
  result,
  onRetry,
  onEdit,
}: ReconsumptionResultModalProps) {
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
            {success ? 'Reconsumo Exitoso' : 'Error en el Reconsumo'}
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
                  <span className="text-sm font-medium">Período:</span>
                  <span className="text-sm">
                    {new Date(data.reconsumption.periodDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800/40">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>¡Reconsumo procesado exitosamente!</strong>
                  <br />
                  Tu membresía ha sido renovada para el período indicado.
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