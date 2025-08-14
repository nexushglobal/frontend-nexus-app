'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/features/payment/utils/payement.utils';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { Calendar, Crown, DollarSign, TrendingUp } from 'lucide-react';
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

  return (
    <Card className="shadow-sm  bg-background">
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
            <TrendingUp className="field-icon" />
            <div>
              <div className="font-semibold">{daysRemaining}</div>
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
        <div className="flex gap-3 justify-end w-full items-end ">
          <Link
            href="/dashboard/cli-membresias/mi-plan"
            className="bg-secondary px-4 py-2 hover:bg-secondary/80  rounded-md font-semibold"
          >
            Ver Detalles
          </Link>
          <Link
            href="/dashboard/cli-membresias/mis-reconsumos"
            className="bg-primary px-4 py-2 hover:bg-primary/80 text-gray-900 rounded-md font-semibold"
          >
            Ver reconsumos
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
