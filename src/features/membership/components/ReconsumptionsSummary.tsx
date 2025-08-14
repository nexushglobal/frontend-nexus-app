'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { AlertCircle } from 'lucide-react';

interface Props {
  canReconsume?: boolean;
  autoRenewal?: boolean;
  reconsumptionAmount?: number;
  isLoading?: boolean;
  onEditAutoRenewal: () => void;
  typeReconsumption?: 'POINTLOT' | 'PRODUCT' | 'SERVICE' | 'AUTOMATIC';
  useCard?: boolean;
  onEditType?: () => void;
}

export function ReconsumptionsSummary({
  canReconsume,
  autoRenewal,
  reconsumptionAmount,
  isLoading,
  onEditAutoRenewal,
  typeReconsumption,
  useCard,
  onEditType,
}: Props) {
  const autoLabel = autoRenewal ? 'Activada' : 'Desactivada';
  const autoColor = autoRenewal
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900'
    : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900';

  const typeHintMap: Record<string, string> = {
    POINTLOT:
      '200 a puntos de lote y 100 a plataforma. Si pagas cuota financiada: solo 100 a plataforma.',
    PRODUCT:
      'Al llegar a 300 en consumo de productos, cuenta como reconsumo (evalúa periodo actual).',
    SERVICE: 'Pago normal de 300: pasarela, puntos o voucher.',
    AUTOMATIC: 'Intentará PRODUCT, luego SERVICE y finalmente POINTLOT.',
  };
  const typeHint = typeReconsumption
    ? typeHintMap[typeReconsumption]
    : undefined;

  return (
    <div className="space-y-4 mb-6">
      {canReconsume && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Puedes reconsumir tu membresía</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Configuración */}
            <div className="lg:col-span-2">
              <div className="rounded-md border p-4 space-y-4">
                <div>
                  <div className="text-sm font-medium">
                    Configuración de reconsumo
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ajusta cómo se renueva y aplica tu reconsumo de membresía.
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Auto-renovación
                    </div>
                    <Badge className={autoColor}>{autoLabel}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Tipo de reconsumo
                    </div>
                    <Badge variant="secondary" className="uppercase">
                      {typeReconsumption ?? '-'}
                    </Badge>
                    {typeHint && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {typeHint}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Método</div>
                    <Badge variant="outline">
                      {useCard ? 'Tarjeta' : 'Sin tarjeta'}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {onEditType && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onEditType}
                      disabled={isLoading}
                    >
                      Cambiar tipo
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEditAutoRenewal}
                    disabled={isLoading}
                  >
                    Editar auto-renovación
                  </Button>
                </div>
              </div>
            </div>

            {/* Monto */}
            <div>
              <div className="rounded-md border p-4 h-full flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Monto de reconsumo
                  </div>
                  <div className="text-2xl font-semibold">
                    {typeof reconsumptionAmount === 'number'
                      ? formatCurrency(reconsumptionAmount)
                      : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
