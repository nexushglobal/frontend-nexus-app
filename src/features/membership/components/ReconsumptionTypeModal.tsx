'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

export type ReconsumptionType =
  | 'POINTLOT'
  | 'PRODUCT'
  | 'SERVICE'
  | 'AUTOMATIC';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value?: ReconsumptionType;
  useCard?: boolean;
  onSave: (payload: {
    typeReconsumption: ReconsumptionType;
    useCard: boolean;
  }) => void;
}

export function ReconsumptionTypeModal({
  open,
  onOpenChange,
  value,
  useCard,
  onSave,
}: Props) {
  const [draftType, setDraftType] = useState<ReconsumptionType>(
    value || 'AUTOMATIC',
  );
  const [draftUseCard, setDraftUseCard] = useState<boolean>(!!useCard);

  useEffect(() => {
    if (open) {
      setDraftType(value || 'AUTOMATIC');
      setDraftUseCard(!!useCard);
    }
  }, [open, value, useCard]);

  const useCardApplicable = draftType === 'POINTLOT' || draftType === 'SERVICE';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar tipo de reconsumo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm">Selecciona el tipo</Label>
            <RadioGroup
              value={draftType}
              onValueChange={(v) => setDraftType(v as ReconsumptionType)}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem value="POINTLOT" id="type-pointlot" />
                <div>
                  <Label
                    htmlFor="type-pointlot"
                    className="font-medium cursor-pointer"
                  >
                    POINTLOT
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Puntos para ahorro de lote. Del reconsumo, 200 van a puntos
                    de lote y 100 a la plataforma. Si tienes un lote financiado
                    y pagas tu cuota, solo pagas 100 a la plataforma (no se
                    suman los 200 a puntos de lote).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <RadioGroupItem value="PRODUCT" id="type-product" />
                <div>
                  <Label
                    htmlFor="type-product"
                    className="font-medium cursor-pointer"
                  >
                    PRODUCT
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Si llegas a 300 en consumo de productos, contará como
                    reconsumo. Se evalúa en el periodo actual para el siguiente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <RadioGroupItem value="SERVICE" id="type-service" />
                <div>
                  <Label
                    htmlFor="type-service"
                    className="font-medium cursor-pointer"
                  >
                    SERVICE
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Pago normal de 300 por pasarela, consumo de puntos o
                    voucher.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2">
                <RadioGroupItem value="AUTOMATIC" id="type-automatic" />
                <div>
                  <Label
                    htmlFor="type-automatic"
                    className="font-medium cursor-pointer"
                  >
                    AUTOMATIC
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Intentará renovar automáticamente: primero "PRODUCT", luego
                    "SERVICE" y finalmente "POINTLOT".
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="use-card"
              checked={useCardApplicable ? draftUseCard : false}
              onCheckedChange={setDraftUseCard}
              disabled={!useCardApplicable}
            />
            <div>
              <Label htmlFor="use-card">Usar tarjeta</Label>
              <p className="text-xs text-muted-foreground">
                Aplica solo para POINTLOT (pago recurrente de 100) y SERVICE
                (pago de 300).
              </p>
            </div>
          </div>

          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            Nota: auto-renovación aplica solo para SERVICE o POINTLOT. Si "Usar
            tarjeta" está activo, se usará pasarela de pago; de lo contrario, se
            usarán puntos del usuario.
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onSave({
                typeReconsumption: draftType,
                useCard: useCardApplicable ? draftUseCard : false,
              });
              onOpenChange(false);
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
