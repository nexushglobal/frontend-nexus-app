'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WeeklyVolume } from '@/features/point/types/weekly.types';
import { cn } from '@/lib/utils';
import {
  Calendar,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';

interface WeeklyVolumeSummaryCardsProps {
  data: WeeklyVolume[] | null;
  isLoading?: boolean;
}

export function WeeklyVolumeSummaryCards({
  data,
  isLoading,
}: WeeklyVolumeSummaryCardsProps) {
  const summaryStats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalLeftVolume: 0,
        totalRightVolume: 0,
        totalCommissions: 0,
        processedWeeks: 0,
      };
    }

    return {
      totalLeftVolume: data.reduce((sum, item) => sum + item.leftVolume, 0),
      totalRightVolume: data.reduce((sum, item) => sum + item.rightVolume, 0),
      totalCommissions: data.reduce(
        (sum, item) => sum + (item.commissionEarned || 0),
        0,
      ),
      processedWeeks: data.filter((item) => item.status === 'PROCESSED').length,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Volumen Izquierda',
      value: summaryStats.totalLeftVolume,
      icon: TrendingUp,
      variant: 'blue' as const,
      description: 'Total de volumen lado izquierdo',
      format: 'points',
    },
    {
      title: 'Volumen Derecha',
      value: summaryStats.totalRightVolume,
      icon: TrendingDown,
      variant: 'green' as const,
      description: 'Total de volumen lado derecho',
      format: 'points',
    },
    {
      title: 'Comisiones Ganadas',
      value: summaryStats.totalCommissions,
      icon: CircleDollarSign,
      variant: 'success' as const,
      description: 'Total de comisiones obtenidas',
      format: 'points',
    },
    {
      title: 'Semanas Procesadas',
      value: summaryStats.processedWeeks,
      icon: Calendar,
      variant: 'default' as const,
      description: 'Semanas con comisiones procesadas',
      format: 'number',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon
                className={cn(
                  'h-4 w-4',
                  card.variant === 'blue' && 'text-blue-500',
                  card.variant === 'green' && 'text-green-500',
                  card.variant === 'success' && 'text-green-600',
                  card.variant === 'default' && 'text-muted-foreground',
                )}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.format === 'points'
                  ? `${card.value.toLocaleString('es-ES')} pts`
                  : card.value.toLocaleString('es-ES')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
