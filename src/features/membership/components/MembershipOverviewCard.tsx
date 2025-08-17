'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { 
  AlertTriangle,
  Calendar, 
  CreditCard, 
  ExternalLink, 
  ListOrdered, 
  RefreshCw, 
  ScrollText, 
  Timer,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { MembershipDetailResponse } from '../types/membership.types';
import { translateMembershipStatus } from '../utils/membershipTranslations';

export function MembershipOverviewCard({
  detail,
  isLoading,
  showReconsumoLink,
}: {
  detail: MembershipDetailResponse | undefined;
  isLoading: boolean;
  showReconsumoLink: boolean;
}) {
  const membership = detail?.membership;
  const planName = membership?.plan?.name || 'Sin plan';
  const statusLabel = translateMembershipStatus(membership?.status as any);

  const start = membership?.startDate ? new Date(membership.startDate) : null;
  const end = membership?.endDate ? new Date(membership.endDate) : null;
  const now = new Date();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const totalDays =
    start && end
      ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY))
      : 0;
  const remainingDays = end
    ? Math.max(0, Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY))
    : 0;
  const elapsedDays = totalDays ? Math.max(0, totalDays - remainingDays) : 0;
  const percentRemaining = totalDays
    ? Math.max(0, Math.min(100, Math.round((remainingDays / totalDays) * 100)))
    : 0;

  // Determinar si la membresía está próxima a vencer o ya venció
  const isExpired = remainingDays <= 0;
  const isExpiringSoon = remainingDays > 0 && remainingDays <= 7;
  const needsAttention = isExpired || isExpiringSoon;

  return (
    <div className="space-y-6 mb-6">
      {/* Header Card */}
      <Card className="shadow-md border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <ScrollText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {planName}
                </CardTitle>
                <p className="text-muted-foreground">
                  Detalles de tu membresía activa
                </p>
              </div>
            </div>
            {showReconsumoLink && (
              <div className="flex flex-col gap-2">
                {needsAttention && (
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                      isExpired 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      <AlertTriangle className="h-3 w-3" />
                      {isExpired ? '¡Membresía Vencida!' : `¡Vence en ${remainingDays} días!`}
                    </div>
                  </div>
                )}
                <Button 
                  asChild 
                  variant={needsAttention ? "destructive" : "outline"} 
                  className={`gap-2 ${needsAttention ? 'animate-pulse' : ''}`}
                >
                  <Link href="/dashboard/cli-membresias/mis-reconsumos">
                    {needsAttention ? (
                      <Zap className="h-4 w-4" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {needsAttention ? 'Renovar Ahora' : 'Mis Reconsumos'}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {isLoading && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mt-4">Cargando detalles...</p>
          </CardContent>
        </Card>
      )}

      {membership && (
        <>
          {/* Status and Progress Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Estado de Membresía</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={membership.status} />
                    <span className="text-sm text-muted-foreground">
                      Estado actual
                    </span>
                  </div>
                </div>

                {/* Progress Section */}
                {totalDays > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Progreso del Período</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Días restantes</span>
                        <span className={`font-medium ${
                          isExpired 
                            ? 'text-red-600 dark:text-red-400' 
                            : isExpiringSoon 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : ''
                        }`}>
                          {isExpired ? '¡Vencido!' : `${remainingDays} de ${totalDays} días`}
                        </span>
                      </div>
                      <Progress 
                        value={percentRemaining} 
                        className={`h-2 ${
                          isExpired 
                            ? '[&>div]:bg-red-500' 
                            : isExpiringSoon 
                            ? '[&>div]:bg-amber-500' 
                            : '[&>div]:bg-primary'
                        }`} 
                      />
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">
                          {percentRemaining}% del período restante
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-primary" />
                  Información del Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nombre del Plan</span>
                    <span className="font-semibold">{membership.plan?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precio</span>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatCurrency(membership.plan?.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Fechas del Período
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fecha de Inicio</span>
                    <span className="font-semibold">
                      {formatDate(membership.startDate || '-')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fecha de Vencimiento</span>
                    <span className="font-semibold">
                      {formatDate(membership.endDate || '-')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reconsumo Information */}
          {(detail?.lastReconsumption || detail?.pendingReconsumption) && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Información de Reconsumos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {detail?.lastReconsumption && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Último Reconsumo</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatDate(detail.lastReconsumption.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Procesado exitosamente
                      </p>
                    </div>
                  )}
                  {detail?.pendingReconsumption && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm font-medium">Próximo Reconsumo</span>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatDate(detail.pendingReconsumption.periodDate)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Programado para proceso
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
