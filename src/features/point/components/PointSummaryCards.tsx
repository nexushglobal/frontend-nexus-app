'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CircleDollarSign, Download, TrendingUp } from 'lucide-react';
import { PointUserResponse } from '../types/points.types';

interface PointSummaryCardsProps {
  data: PointUserResponse | null;
  isLoading?: boolean;
}

export function PointSummaryCards({ data, isLoading }: PointSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
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
      title: 'Puntos Disponibles',
      value: data?.availablePoints || 0,
      icon: CircleDollarSign,
      variant: 'default' as const,
      description: 'Puntos que puedes retirar',
    },
    {
      title: 'Total Ganado',
      value: data?.totalEarnedPoints || 0,
      icon: TrendingUp,
      variant: 'success' as const,
      description: 'Total de puntos ganados',
    },
    {
      title: 'Total Retirado',
      value: data?.totalWithdrawnPoints || 0,
      icon: Download,
      variant: 'info' as const,
      description: 'Total de puntos retirados',
    },
  ];

  const variantStyles = {
    default: 'border-border/50 bg-background',
    success:
      'border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-950/20',
    info: 'border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-950/20',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    success: 'text-green-600 dark:text-green-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={cn(
              'shadow-sm transition-all hover:shadow-md',
              variantStyles[card.variant],
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={cn('h-4 w-4', iconStyles[card.variant])} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value.toLocaleString()}
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
