"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteCardAction } from "@/features/shared/action/culqi";
import { type CardData } from "@/features/shared/types/culqi.types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  card: CardData;
}

export function DeleteCardModal({
  isOpen,
  onClose,
  onSuccess,
  card
}: DeleteCardModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCardAction(card.source_id);

        if (result.success) {
          toast.success("Tarjeta eliminada exitosamente");
          onSuccess();
          onClose();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error inesperado");
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Eliminar tarjeta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            ¿Estás seguro que deseas eliminar esta tarjeta?
          </p>

          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm font-medium">
              {card.card_brand} •••• {card.last_four}
            </div>
            <div className="text-xs text-muted-foreground">
              {card.card_type}
            </div>
          </div>

          <p className="text-sm text-destructive">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
