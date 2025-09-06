'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { CheckCircle, DollarSign, FileText, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateSaleResponse } from '../../types/sale-response.types';

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: CreateSaleResponse;
}

const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};

export default function SaleSuccessModal({
  isOpen,
  onClose,
  saleData,
}: SaleSuccessModalProps) {
  const router = useRouter();
  const handleViewDetails = () => {
    router.push(`/dashboard/cli-unilevel/ventas/${saleData.id}`);
  };

  const totalAmount = safeNumber(saleData.amount);
  const initialAmount = saleData.amountInitial || 0;
  const numberCoutes = saleData.numberCoutes || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] max-h-[800px] w-xl max-w-2xl flex-col p-0 sm:h-auto sm:max-h-[85vh]">
        <DialogHeader className="flex-shrink-0 rounded-t-md border-b border-gray-100 bg-white px-4 py-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 sm:h-12 sm:w-12 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-green-800 sm:text-xl dark:text-green-200">
                ¡Venta Creada Exitosamente!
              </DialogTitle>
              <p className="text-sm text-green-600 dark:text-green-400">
                La venta se ha registrado correctamente en el sistema
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Información de la Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Referencia:
                      </span>
                      <span className="font-mono text-sm font-medium">
                        {saleData.saleIdReference}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Tipo de Venta:
                      </span>
                      <Badge variant="default">{saleData.type}</Badge>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Estado:
                      </span>
                      <Badge variant="destructive">{saleData.status}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Monto Total:
                      </span>
                      <span className="font-medium text-lg">
                        {formatCurrency(
                          Number(saleData.amount),
                          saleData.currency,
                        )}
                      </span>
                    </div>
                    {saleData.type === 'FINANCED' && (
                      <>
                        {saleData.amountInitial !== undefined && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Monto Inicial:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(initialAmount, saleData.currency)}
                            </span>
                          </div>
                        )}
                        {saleData.numberCoutes && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Número de Cuotas:
                            </span>
                            <span className="font-medium">
                              {numberCoutes} cuotas
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Moneda:
                      </span>
                      <span className="font-medium">
                        {saleData.currency === 'PEN'
                          ? 'Soles (PEN)'
                          : 'Dólares (USD)'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Cliente:
                      </span>
                      <span className="text-right font-medium">
                        {saleData.clientFullName}
                      </span>
                    </div>
                    {saleData.phone && (
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Teléfono:
                        </span>
                        <span className="text-right font-medium">
                          {saleData.phone}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ID Vendedor:
                      </span>
                      <span className="text-right font-mono text-sm">
                        {saleData.vendorId}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Financiamiento (solo si es financiada) */}
            {saleData.type === 'FINANCED' && (
              <Card className="bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    Detalles de Financiamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      {saleData.amountInitial !== undefined && (
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Pago Inicial:
                          </span>
                          <span className="text-right font-medium">
                            {formatCurrency(initialAmount, saleData.currency)}
                          </span>
                        </div>
                      )}
                      {saleData.numberCoutes && (
                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total de Cuotas:
                          </span>
                          <span className="text-right font-medium">
                            {numberCoutes}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {saleData.amountInitial !== undefined &&
                        saleData.numberCoutes && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Monto a Financiar:
                            </span>
                            <span className="text-right font-medium">
                              {formatCurrency(
                                totalAmount - initialAmount,
                                saleData.currency,
                              )}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensaje de Éxito */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Venta registrada exitosamente
                  </h4>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                    {saleData.type === 'FINANCED'
                      ? `Se ha creado el cronograma de ${numberCoutes} cuotas de financiamiento.`
                      : 'El pago directo ha sido registrado correctamente.'}
                  </p>
                  <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                    La venta con referencia{' '}
                    <span className="font-mono">
                      {saleData.saleIdReference}
                    </span>{' '}
                    está lista para gestionar pagos y generar documentos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 flex-col gap-2 rounded-b-md border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:px-6 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Detalles</span>
              <span className="sm:hidden">Detalles</span>
            </Button>
            <Button
              onClick={onClose}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
