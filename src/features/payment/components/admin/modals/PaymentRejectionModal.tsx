'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { rejectPayment } from '@/features/payment/actions/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
// Simple Textarea component since it's not in the project
const Textarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const rejectPaymentSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, 'La razón de rechazo debe tener al menos 10 caracteres'),
});

type RejectPaymentFormData = z.infer<typeof rejectPaymentSchema>;

interface PaymentRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  paymentId: string;
}

export function PaymentRejectionModal({
  isOpen,
  onClose,
  onSuccess,
  paymentId,
}: PaymentRejectionModalProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RejectPaymentFormData>({
    resolver: zodResolver(rejectPaymentSchema),
    defaultValues: {
      rejectionReason: '',
    },
  });

  const handleSubmit = (data: RejectPaymentFormData) => {
    startTransition(async () => {
      try {
        const result = await rejectPayment(paymentId, data);

        if (result.success) {
          toast.success(result.message);
          onSuccess(result.data);
          onClose();
          form.reset();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error al rechazar el pago');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Rechazar Pago
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón de Rechazo *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe la razón por la cual se rechaza este pago..."
                      className="min-h-[100px]"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                Rechazar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
