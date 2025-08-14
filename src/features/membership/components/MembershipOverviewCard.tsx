'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { Calendar, ListOrdered, ScrollText } from 'lucide-react';
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

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ScrollText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {planName}
                {membership?.status && (
                  <Badge variant="secondary">{statusLabel}</Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Estado de tu membresía
              </p>
            </div>
          </div>
          {showReconsumoLink && (
            <Link
              href="/dashboard/cli-membresias/mis-reconsumos"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ir a mis reconsumos
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Cargando detalles...
          </div>
        )}
        {membership && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="info-field">
                <ListOrdered className="field-icon" />
                <div>
                  <div className="font-semibold">
                    {membership.plan?.name || '-'}
                  </div>
                  <div className="text-xs text-muted-foreground">Plan</div>
                </div>
              </div>
              <div className="info-field">
                <Calendar className="field-icon" />
                <div>
                  <div className="font-semibold text-xs">
                    {formatDate(membership.startDate || '-')}
                  </div>
                  <div className="text-xs text-muted-foreground">Inicio</div>
                </div>
              </div>
              <div className="info-field">
                <Calendar className="field-icon" />
                <div>
                  <div className="font-semibold text-xs">
                    {formatDate(membership.endDate || '-')}
                  </div>
                  <div className="text-xs text-muted-foreground">Fin</div>
                </div>
              </div>
              <div className="info-field">
                <span className="field-icon">S/</span>
                <div>
                  <div className="font-semibold">
                    {formatCurrency(membership.plan?.price || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Precio del plan
                  </div>
                </div>
              </div>
            </div>

            {/* Days progress */}
            {totalDays > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Días restantes</span>
                  <span>
                    {remainingDays} de {totalDays} ({percentRemaining}%)
                  </span>
                </div>
                <Progress value={percentRemaining} />
              </div>
            )}

            {/* Reconsumo info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detail?.lastReconsumption && (
                <div className="info-field">
                  <Calendar className="field-icon" />
                  <div>
                    <div className="font-semibold text-xs">
                      {formatDate(detail.lastReconsumption.createdAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Último reconsumo
                    </div>
                  </div>
                </div>
              )}
              {detail?.pendingReconsumption && (
                <div className="info-field">
                  <Calendar className="field-icon" />
                  <div>
                    <div className="font-semibold text-xs">
                      {formatDate(detail.pendingReconsumption.periodDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Próximo reconsumo
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
