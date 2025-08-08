'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

interface ProductErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  onRetry: () => void;
}

export function ProductErrorModal({
  isOpen,
  onClose,
  errorMessage,
  onRetry,
}: ProductErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error al Crear Producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{errorMessage}</p>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cerrar
            </Button>
            <Button onClick={onRetry} className="flex-1">
              Volver a Intentar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
