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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader2, User, CreditCard, Banknote } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WithdrawalService } from '../../../services/withdrawalService';
import { WithdrawalDetail } from '../../../types/withdrawals.types';

interface WithdrawalApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  withdrawalId: string;
  withdrawal: WithdrawalDetail;
}

export function WithdrawalApprovalModal({
  isOpen,
  onClose,
  onSuccess,
  withdrawalId,
  withdrawal,
}: WithdrawalApprovalModalProps) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => WithdrawalService.approveWithdrawal(parseInt(withdrawalId)),
    onSuccess: (data) => {
      toast.success('Retiro aprobado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['withdrawal-detail', parseInt(withdrawalId)] });
      onSuccess(data);
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Error al aprobar el retiro'
      );
    },
  });

  const handleApprove = () => {
    approveMutation.mutate();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Aprobar Retiro
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas aprobar este retiro? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Withdrawal Summary */}
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Retiro #</span>
                <Badge variant="outline">{withdrawal.id}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Monto</span>
                <div className="text-right">
                  <p className="font-bold text-success text-lg">
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

          {/* Warning */}
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              <strong>Importante:</strong> Al aprobar este retiro, se procesará el pago 
              al usuario según la información bancaria proporcionada.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={approveMutation.isPending}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="bg-success hover:bg-success/90"
          >
            {approveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aprobando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar Retiro
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}