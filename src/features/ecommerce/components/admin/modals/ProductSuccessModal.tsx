'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

interface ProductSuccessData {
  id: number;
  name: string;
  sku: string;
  memberPrice: number;
  publicPrice: number;
}

interface ProductSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProductSuccessData | null;
  onCreateAnother: () => void;
  onGoToList: () => void;
}

export function ProductSuccessModal({
  isOpen,
  onClose,
  data,
  onCreateAnother,
  onGoToList,
}: ProductSuccessModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Producto Creado Exitosamente
          </DialogTitle>
        </DialogHeader>

        {data && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{data.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Nombre:</span>
                <span className="text-sm">{data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">SKU:</span>
                <span className="text-sm font-mono">{data.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Precio Socio:</span>
                <span className="text-sm">
                  {formatCurrency(data.memberPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Precio Público:</span>
                <span className="text-sm">
                  {formatCurrency(data.publicPrice)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onCreateAnother}
                variant="outline"
                className="flex-1"
              >
                Crear Otro
              </Button>
              <Button onClick={onGoToList} className="flex-1">
                Ver Listado
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
