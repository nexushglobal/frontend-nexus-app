'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/features/payment/utils/payement.utils';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { AlertTriangle, Calendar, Crown, DollarSign, ExternalLink, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { UserMembership } from '../types/membership.types';

interface CurrentMembershipCardProps {
  userMembership: UserMembership;
}
enum MembershipStatus {
  PENDING = 'Pendiente',
  ACTIVE = 'Activa',
  EXPIRED = 'Expirada',
  CANCELED = 'Cancelada',
  INACTIVE = 'Inactiva',
  UNKNOWN = 'Desconocido',
}

export function CurrentMembershipCard({
  userMembership,
}: CurrentMembershipCardProps) {
  if (!userMembership.hasMembership || !userMembership.plan) {
    return null;
  }

  const { plan, status, endDate } = userMembership;
  const isActive = status === 'ACTIVE';
  const daysRemaining = endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  // Determinar estado de urgencia
  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;
  const needsAttention = isExpired || isExpiringSoon;

  return (
    <div className="space-y-4">
      {/* Banner de Alerta */}
      {needsAttention && (
        <Card className={`border-2 ${
          isExpired 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
            : 'border-amber-500 bg-amber-50 dark:bg-amber-900/10'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                isExpired 
                  ? 'bg-red-100 dark:bg-red-900/20' 
                  : 'bg-amber-100 dark:bg-amber-900/20'
              }`}>
                <AlertTriangle className={`h-5 w-5 ${
                  isExpired 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  isExpired 
                    ? 'text-red-900 dark:text-red-100' 
                    : 'text-amber-900 dark:text-amber-100'
                }`}>
                  {isExpired ? '¡Tu membresía ha vencido!' : '¡Tu membresía vence pronto!'}
                </h3>
                <p className={`text-sm ${
                  isExpired 
                    ? 'text-red-700 dark:text-red-300' 
                    : 'text-amber-700 dark:text-amber-300'
                }`}>
                  {isExpired 
                    ? 'Renueva tu membresía para mantener todos los beneficios.'
                    : `Te quedan ${daysRemaining} días. Considera renovar o configurar el reconsumo automático.`
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  asChild
                  variant={isExpired ? "destructive" : "default"}
                  size="sm"
                  className={`gap-1 ${needsAttention ? 'animate-pulse' : ''}`}
                >
                  <Link href="/dashboard/cli-membresias/mis-reconsumos">
                    <Zap className="h-4 w-4" />
                    {isExpired ? 'Renovar' : 'Reconsumos'}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={`shadow-sm bg-background ${
        needsAttention 
          ? isExpired 
            ? 'border-red-200 dark:border-red-800/40' 
            : 'border-amber-200 dark:border-amber-800/40'
          : ''
      }`}>
        <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {plan.name}
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className={isActive ? 'badge-success' : 'badge-warning'}
                >
                  {status && MembershipStatus[status]}
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Tu membresía actual
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="info-field">
            <DollarSign className="field-icon" />
            <div>
              <div className="font-semibold">{formatCurrency(plan.price)}</div>
              <div className="text-xs text-muted-foreground">
                Valor del Plan
              </div>
            </div>
          </div>

          <div className="info-field">
            <TrendingUp className={`field-icon ${
              isExpired 
                ? 'text-red-600' 
                : isExpiringSoon 
                ? 'text-amber-600' 
                : ''
            }`} />
            <div>
              <div className={`font-semibold ${
                isExpired 
                  ? 'text-red-600 dark:text-red-400' 
                  : isExpiringSoon 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : ''
              }`}>
                {isExpired ? '¡Vencido!' : daysRemaining}
              </div>
              <div className="text-xs text-muted-foreground">
                Días restantes
              </div>
            </div>
          </div>

          <div className="info-field">
            <Calendar className="field-icon" />
            <div>
              <div className="font-semibold text-xs">
                {endDate ? formatDate(endDate) : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">
                Fecha de expiración
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          {userMembership.message && (
            <p className="text-sm text-muted-foreground mb-2">
              {userMembership.message
                ? userMembership.message
                : 'No hay información adicional disponible'}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end w-full items-end">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/cli-membresias/mi-plan">
              Ver Detalles
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant={needsAttention ? "destructive" : "default"}
            size="sm"
            className={`gap-1 ${needsAttention ? 'animate-pulse' : ''}`}
          >
            <Link href="/dashboard/cli-membresias/mis-reconsumos">
              {needsAttention ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              {needsAttention ? 'Renovar Ahora' : 'Ver reconsumos'}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}
