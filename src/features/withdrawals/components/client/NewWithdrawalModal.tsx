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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { WithdrawalService } from '../../services/withdrawalService';
import {
  CreateWithdrawalRequest,
  WithdrawalUserInfo,
} from '../../types/withdrawals.types';

interface NewWithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: WithdrawalUserInfo;
  availablePoints: number;
}

const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(100, 'El monto mínimo de retiro es 100 puntos')
    .max(999999, 'El monto máximo no puede exceder 999,999 puntos'),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

export function NewWithdrawalModal({
  open,
  onOpenChange,
  userInfo,
  availablePoints,
}: NewWithdrawalModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 100,
    },
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: (data: CreateWithdrawalRequest) =>
      WithdrawalService.createWithdrawal(data),
    onSuccess: () => {
      toast.success('Solicitud de retiro creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['client-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawal-validation'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Error al crear la solicitud de retiro',
      );
    },
  });

  const onSubmit = (data: WithdrawalFormData) => {
    const withdrawalRequest: CreateWithdrawalRequest = {
      amount: data.amount,
      userId: userInfo.userId,
      userName: userInfo.userName,
      userEmail: userInfo.userEmail,
      bankName: userInfo.bankName,
      accountNumber: userInfo.accountNumber,
      cci: userInfo.cci,
    };

    createWithdrawalMutation.mutate(withdrawalRequest);
  };

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    form.setValue('amount', numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Nueva Solicitud de Retiro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Read-only Information Sections - Subtle styling */}
          <div className="space-y-3">
            {/* User Information Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
                Información del Usuario
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <User className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Nombre
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.userName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <User className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Email
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.userEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <User className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Documento
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.documentType} - {userInfo.documentNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <Phone className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Teléfono
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
                Información de Facturación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <Building2 className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      RUC
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.ruc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <Building2 className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Razón Social
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.razonSocial}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50 md:col-span-2">
                  <MapPin className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Dirección
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
                Información Bancaria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <CreditCard className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Banco
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.bankName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50">
                  <CreditCard className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      Número de Cuenta
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/10 rounded border border-border/50 md:col-span-2">
                  <CreditCard className="h-3 w-3 text-muted-foreground/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground/60 leading-none">
                      CCI
                    </p>
                    <p className="text-xs text-foreground/80 truncate">
                      {userInfo.cci}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Withdrawal Form - Prominent styling */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Solicitar Retiro
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ingrese el monto que desea retirar de sus puntos disponibles
                  </p>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Puntos disponibles:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {availablePoints.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Monto mínimo de retiro: 100 puntos
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">
                        Monto a retirar (puntos)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Ingrese el monto"
                            min={100}
                            max={availablePoints}
                            step={1}
                            {...field}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            value={field.value || ''}
                            className="h-14 text-xl font-semibold text-center border-2 border-primary/30 focus:border-primary transition-colors bg-card"
                          />
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <span className="text-sm font-medium text-muted-foreground">
                              puntos
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {field.value && field.value > 0 && (
                        <p className="text-sm text-muted-foreground text-center">
                          Equivale a S/{field.value.toLocaleString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createWithdrawalMutation.isPending}
                  className="min-w-[100px]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createWithdrawalMutation.isPending}
                  className="min-w-[140px] h-11"
                >
                  {createWithdrawalMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Confirmar Retiro
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
