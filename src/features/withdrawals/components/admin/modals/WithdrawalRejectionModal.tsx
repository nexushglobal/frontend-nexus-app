'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Loader2, User, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WithdrawalService } from '../../../services/withdrawalService';
import { WithdrawalDetail } from '../../../types/withdrawals.types';

const rejectionSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, 'El motivo de rechazo debe tener al menos 10 caracteres')
    .max(500, 'El motivo de rechazo no puede exceder 500 caracteres'),
});

type RejectionFormData = z.infer<typeof rejectionSchema>;

interface WithdrawalRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  withdrawalId: string;
  withdrawal: WithdrawalDetail;
}

export function WithdrawalRejectionModal({
  isOpen,
  onClose,
  onSuccess,
  withdrawalId,
  withdrawal,
}: WithdrawalRejectionModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: {
      rejectionReason: '',
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { rejectionReason: string }) =>
      WithdrawalService.rejectWithdrawal(parseInt(withdrawalId), data),
    onSuccess: (data) => {
      toast.success('Retiro rechazado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['withdrawal-detail', parseInt(withdrawalId)] });
      onSuccess(data);
      handleClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Error al rechazar el retiro'
      );
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (data: RejectionFormData) => {
    rejectMutation.mutate(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Rechazar Retiro
          </DialogTitle>
          <DialogDescription>
            Proporciona un motivo detallado para el rechazo de este retiro.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Withdrawal Summary */}
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Retiro #</span>
                  <Badge variant="outline">{withdrawal.id}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Monto</span>
                  <div className="text-right">
                    <p className="font-bold text-destructive text-lg">
                      {withdrawal.amount.toLocaleString()} puntos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ≈ {formatCurrency(withdrawal.amount)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {withdrawal.user.personalInfo.firstName} {withdrawal.user.personalInfo.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{withdrawal.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{withdrawal.bankName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {withdrawal.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del Rechazo *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe detalladamente por qué se está rechazando este retiro..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Este motivo será visible para el usuario
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose}
                disabled={rejectMutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                variant="destructive"
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rechazando...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Rechazar Retiro
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}