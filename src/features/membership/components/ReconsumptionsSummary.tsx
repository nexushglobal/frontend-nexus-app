'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  DollarSign,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UpdateMembershipAction } from '../actions/update-membership';
import { MembershipReconsumption } from '../types/reconsumption.type';
import { ReconsumptionPaymentSheet } from '@/features/shared/components/payment/ReconsumptionPaymentSheet';

interface Props {
  membership?: MembershipReconsumption;
}

export function ReconsumptionsSummary({ membership }: Props) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  // Calcular el progreso del período de membresía
  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;

    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular estado de urgencia
  const daysRemaining = getDaysRemaining(membership?.endDate || '');
  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;
  const needsAttention = isExpired || isExpiringSoon;

  const updateMutation = useMutation({
    mutationFn: UpdateMembershipAction,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ['membership-reconsumptions'],
        });
      } else {
        toast.error(result.message);
      }
      setIsUpdating(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar la configuración');
      setIsUpdating(false);
    },
  });

  const handleToggleUpdate = async (
    field: 'isPointLot' | 'useCard' | 'autoRenewal',
    value: boolean,
  ) => {
    setIsUpdating(true);
    updateMutation.mutate({ [field]: value });
  };

  const handleReconsumptionSuccess = () => {
    toast.success('Reconsumo procesado exitosamente');
    queryClient.invalidateQueries({
      queryKey: ['membership-reconsumptions'],
    });
    setShowPaymentSheet(false);
  };

  if (!membership) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Resumen de Reconsumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No hay información de membresía disponible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Banner de Alerta */}
      {needsAttention && (
        <Card
          className={`border-2 ${
            isExpired
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-amber-500 bg-amber-50 dark:bg-amber-900/10'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isExpired
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : 'bg-amber-100 dark:bg-amber-900/20'
                }`}
              >
                <AlertTriangle
                  className={`h-5 w-5 ${
                    isExpired
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    isExpired
                      ? 'text-red-900 dark:text-red-100'
                      : 'text-amber-900 dark:text-amber-100'
                  }`}
                >
                  {isExpired
                    ? '¡Tu membresía ha vencido!'
                    : '¡Tu membresía vence pronto!'}
                </h3>
                <p
                  className={`text-sm ${
                    isExpired
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {isExpired
                    ? 'Renueva tu membresía ahora para mantener todos los beneficios activos.'
                    : `Te quedan ${daysRemaining} días. Configura tu reconsumo automático para evitar interrupciones.`}
                </p>
              </div>
              {membership.canReconsume && (
                <Button
                  variant={isExpired ? 'destructive' : 'default'}
                  className={`gap-2 ${needsAttention ? 'animate-pulse' : ''}`}
                  onClick={() => setShowPaymentSheet(true)}
                >
                  <Zap className="h-4 w-4" />
                  {isExpired ? 'Renovar Ahora' : 'Configurar Reconsumo'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Resumen de Reconsumo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Período de Membresía */}
          <div className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-semibold">
                  Período de Membresía Actual
                </span>
              </div>
              <div className="text-right">
                <p
                  className={`text-xs font-medium ${
                    isExpired
                      ? 'text-red-600 dark:text-red-400'
                      : isExpiringSoon
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {isExpired ? '¡Vencido!' : `${daysRemaining} días restantes`}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  FECHA DE INICIO
                </p>
                <p className="font-semibold">
                  {formatDate(membership.startDate)}
                </p>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-primary/20 rounded-full relative">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isExpired
                        ? 'bg-red-500'
                        : isExpiringSoon
                        ? 'bg-amber-500'
                        : 'bg-primary'
                    }`}
                    style={{
                      width: `${calculateProgress(
                        membership.startDate,
                        membership.endDate,
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="text-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {Math.round(
                      calculateProgress(
                        membership.startDate,
                        membership.endDate,
                      ),
                    )}
                    % completado
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  FECHA DE VENCIMIENTO
                </p>
                <p className="font-semibold">
                  {formatDate(membership.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Monto de Reconsumo</span>
              </div>
              <p className="text-2xl font-bold">
                S/ {membership.reconsumptionAmount}
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Estado de Membresía</span>
              </div>
              <StatusBadge status={membership.status} />
            </div>

            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Apto para Reconsumo</span>
              </div>
              <div className="flex items-center gap-2">
                {membership.canReconsume ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Sí</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">No</span>
                  </div>
                )}
              </div>
            </div>

            {membership.canReconsume && (
              <div
                className={`p-4 rounded-lg border ${
                  needsAttention
                    ? isExpired
                      ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/40'
                      : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/40'
                    : 'bg-primary/5'
                }`}
              >
                <Button
                  size="sm"
                  className={`w-full gap-2 ${
                    needsAttention ? 'animate-pulse' : ''
                  }`}
                  variant={needsAttention ? 'destructive' : 'default'}
                  onClick={() => setShowPaymentSheet(true)}
                >
                  {needsAttention ? (
                    <Zap className="h-4 w-4" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {needsAttention ? 'Renovar Ahora' : 'Realizar Reconsumo'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Reconsumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-muted/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">Tipo de Reconsumo</span>
                </div>

                <RadioGroup
                  value={membership.isPointLot ? 'true' : 'false'}
                  onValueChange={(value) =>
                    handleToggleUpdate(
                      'isPointLot',
                      value === 'true' ? true : false,
                    )
                  }
                  disabled={isUpdating}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 rounded-lg border bg-background">
                    <RadioGroupItem
                      value="true"
                      id="point-lot"
                      className="mt-1"
                    />
                    <div className="space-y-1 flex-1">
                      <label
                        htmlFor="point-lot"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Reconsumo por Lote de Puntos
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Destinar 200 puntos al banco de ahorro para adquirir tu
                        lote y 100 puntos para el pago de la plataforma
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg border bg-background">
                    <RadioGroupItem
                      value="false"
                      id="flexible"
                      className="mt-1"
                    />
                    <div className="space-y-1 flex-1">
                      <label
                        htmlFor="flexible"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Reconsumo por Órdenes de Productos o Pago Directo
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Reconsumo automático si tienes puntos suficientes,
                        órdenes de productos por S/300, o pago directo de S/300
                        (con puntos o tarjeta)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    Usar Tarjeta para Pago Automático
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Si está activo, se usará la tarjeta para el reconsumo
                  automático al vencimiento. Si no, se usarán los puntos
                  disponibles en la plataforma.
                </p>
              </div>
              <Switch
                checked={membership.useCard}
                onCheckedChange={(checked) =>
                  handleToggleUpdate('useCard', checked)
                }
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <span className="font-medium">Renovación Automática</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  La suscripción se renovará automáticamente al finalizar su
                  período, ya sea por puntos o por tarjeta según la
                  configuración.
                </p>
              </div>
              <Switch
                checked={membership.autoRenewal}
                onCheckedChange={(checked) =>
                  handleToggleUpdate('autoRenewal', checked)
                }
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800/40">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>¿Tienes dudas sobre el proceso de reconsumo?</strong>
              <br />
              Puedes contactar a nuestro soporte para recibir asistencia
              personalizada.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reconsumption Payment Sheet */}
      {membership && (
        <ReconsumptionPaymentSheet
          isOpen={showPaymentSheet}
          onClose={() => setShowPaymentSheet(false)}
          membership={membership}
          onSuccess={handleReconsumptionSuccess}
        />
      )}
    </div>
  );
}
