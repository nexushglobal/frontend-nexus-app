'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PointLotUserResponse } from '@/features/point/types/points.types';
import { cn } from '@/lib/utils';
import { CircleDollarSign, Download, TrendingUp } from 'lucide-react';

interface PointLotSummaryCardsProps {
  data: PointLotUserResponse | null;
  isLoading?: boolean;
}

export function PointLotSummaryCards({
  data,
  isLoading,
}: PointLotSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-32 bg-muted/60" />
              <Skeleton className="h-5 w-5 rounded-full bg-primary/20" />
            </CardHeader>
            <CardContent className="relative">
              <Skeleton className="h-8 w-24 mb-2 bg-muted/60" />
              <Skeleton className="h-3 w-full bg-muted/40" />
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Puntos de Lote Disponibles',
      value: data?.availableLotPoints || 0,
      icon: CircleDollarSign,
      variant: 'available' as const,
      description: 'Listo para retirar',
      gradient: 'from-orange-500/20 to-amber-500/10',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
      accent: 'border-orange-200/50 dark:border-orange-800/30',
    },
    {
      title: 'Total Ganado',
      value: data?.totalEarnedLotPoints || 0,
      icon: TrendingUp,
      variant: 'earned' as const,
      description: 'Historial completo',
      gradient: 'from-blue-500/20 to-cyan-500/10',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      accent: 'border-blue-200/50 dark:border-blue-800/30',
    },
    {
      title: 'Total Retirado',
      value: data?.totalWithdrawnLotPoints || 0,
      icon: Download,
      variant: 'withdrawn' as const,
      description: 'Ya procesados',
      gradient: 'from-purple-500/20 to-violet-500/10',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      accent: 'border-purple-200/50 dark:border-purple-800/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={cn(
              'relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-card/95',
              'shadow-lg',
              card.accent
            )}
          >
            {/* Background gradient */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-40',
                card.gradient
              )}
            />

            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                {card.title}
              </CardTitle>
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full',
                  card.iconBg
                )}
              >
                <Icon className={cn('h-4 w-4', card.iconColor)} />
              </div>
            </CardHeader>

            <CardContent className="relative">
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-bold text-foreground">
                  {card.value.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  pts
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    card.iconBg.replace('/10', '')
                  )}
                />
                {card.description}
              </p>
            </CardContent>

            {/* Bottom accent line */}
            <div
              className={cn(
                'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r opacity-80',
                card.gradient.replace('/20', '').replace('/10', '')
              )}
            />
          </Card>
        );
      })}
    </div>
  );
}
