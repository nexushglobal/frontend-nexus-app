'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MembershipData } from '@/features/dashboard/types/dashboard-user-info.types';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import {
  Calendar,
  ChevronRight,
  Crown,
  DollarSign,
  Gift,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
type Props = {
  membershipData: MembershipData;
};

const MembershipStatus = ({ membershipData }: Props) => {
  const getDaysUntilExpiry = () => {
    if (!membershipData.hasMembership || !membershipData.membership)
      return null;
    const today = new Date();
    const endDate = new Date(membershipData.membership.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  const daysUntilExpiry = getDaysUntilExpiry();
  const getMembershipDetailHref = () => {
    if (!membershipData.hasMembership || !membershipData.membership) {
      return '/dashboard/cli-membresias/planes';
    }
    const isExpired = new Date(membershipData.membership.endDate) < new Date();
    if (isExpired) {
      return '/dashboard/cli-membresias/mis-reconsumos';
    }
    return '/dashboard/cli-membresias/mi-plan';
  };

  const getMembershipStatus = () => {
    if (!membershipData.hasMembership || !membershipData.membership) {
      return {
        label: 'Sin Plan',
        color: 'destructive',
        bgColor: 'bg-destructive/10',
      };
    }

    const isExpired = new Date(membershipData.membership.endDate) < new Date();
    if (isExpired) {
      return {
        label: 'Vencida',
        color: 'destructive',
        bgColor: 'bg-destructive/10',
      };
    }

    return {
      label: membershipData.membership.status,
      color: 'success',
      bgColor: 'bg-success/10',
    };
  };

  // Calcular estado de urgencia
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;
  const isExpiringSoon =
    daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  const needsAttention = isExpired || isExpiringSoon;
  const membershipStatus = getMembershipStatus();

  return (
    <Card className="lg:col-span-4 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${membershipStatus.bgColor}`}>
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Membresía</h3>
              <p className="text-xs text-muted-foreground">Estado actual</p>
            </div>
          </div>
          <Badge
            variant={
              membershipStatus.color === 'success' ? 'default' : 'destructive'
            }
            className="font-medium"
          >
            {membershipStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {membershipData.hasMembership && membershipData.membership ? (
          <>
            {/* Período de Membresía con progreso visual */}
            <div className="p-3 rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {membershipData.membership.planName}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium ${
                    isExpired
                      ? 'text-red-600 dark:text-red-400'
                      : isExpiringSoon
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  {isExpired
                    ? '¡Vencido!'
                    : daysUntilExpiry !== null
                    ? `${daysUntilExpiry} días restantes`
                    : ''}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="mb-2">
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
                        membershipData.membership.startDate,
                        membershipData.membership.endDate,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Fechas */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatDate(membershipData.membership.startDate)}</span>
                <span>
                  {Math.round(
                    calculateProgress(
                      membershipData.membership.startDate,
                      membershipData.membership.endDate,
                    ),
                  )}
                  % completado
                </span>
                <span>{formatDate(membershipData.membership.endDate)}</span>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">Reconsumo Mínimo</span>
                </div>
                <p className="text-lg font-bold">
                  S/ {membershipData.membership.minimumReconsumptionAmount}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4 space-y-2">
            <Gift className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium">Sin membresía activa</p>
            <p className="text-xs text-muted-foreground">
              Explora nuestros planes
            </p>
          </div>
        )}

        <Button
          asChild
          variant={needsAttention ? 'destructive' : 'outline'}
          size="sm"
          className={`w-full ${needsAttention ? 'animate-pulse' : ''}`}
        >
          <Link href={getMembershipDetailHref()}>
            {needsAttention ? (
              <>
                <Zap className="h-4 w-4 mr-2" />
                {isExpired ? 'Renovar ahora' : 'Revisar membresía'}
              </>
            ) : (
              <>
                Ver detalles
                <ChevronRight className="h-4 w-4 ml-auto" />
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembershipStatus;
