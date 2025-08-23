'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PointData } from '@/features/dashboard/types/dashboard-user-info.types';
import { ArrowRight, Award, Eye, Gift, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
type Props = {
  pointData: PointData;
};

const PointsOverview = ({ pointData }: Props) => {
  const getVolumeBalance = () => {
    if (!pointData.weeklyVolume) return null;
    const { leftVolume, rightVolume } = pointData.weeklyVolume;
    const total = leftVolume + rightVolume;
    const balance = total > 0 ? Math.abs(leftVolume - rightVolume) / total : 0;
    return { balance: balance * 100, leftVolume, rightVolume, total };
  };

  const getMonthlyVolumeBalance = () => {
    if (!pointData.monthlyVolume) return null;
    const { leftVolume, rightVolume } = pointData.monthlyVolume;
    const total = leftVolume + rightVolume;
    const balance = total > 0 ? Math.abs(leftVolume - rightVolume) / total : 0;
    return { balance: balance * 100, leftVolume, rightVolume, total };
  };

  const volumeBalance = getVolumeBalance();
  const monthlyVolumeBalance = getMonthlyVolumeBalance();
  return (
    <Card className="lg:col-span-8 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resumen de Puntos</h3>
              <p className="text-sm text-muted-foreground">
                Tu rendimiento actual
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/cli-puntos/historial-puntos">
              Ver todo <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Points Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-primary/20 rounded">
                <Star className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary">
                Disponibles
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {pointData.availablePoints.toFixed(1)}
            </p>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs h-6 mt-1 p-0"
            >
              <Link
                href="/dashboard/cli-puntos/historial-puntos"
                className="text-primary"
              >
                Ver historial
              </Link>
            </Button>
          </div>

          <div className="bg-gradient-to-br from-secondary-foreground/10 to-secondary-foreground/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-secondary-foreground/20 rounded">
                <Gift className="h-3 w-3 text-secondary-foreground" />
              </div>
              <span className="text-xs font-medium text-secondary-foreground">
                Lote
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {pointData.availableLotPoints.toFixed(1)}
            </p>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs h-6 mt-1 p-0"
            >
              <Link
                href="/dashboard/cli-puntos/historial-puntos-lote"
                className="text-secondary-foreground"
              >
                Ver historial
              </Link>
            </Button>
          </div>

          <div className="bg-gradient-to-br from-accent-foreground/10 to-accent-foreground/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-accent-foreground/20 rounded">
                <Award className="h-3 w-3 text-accent-foreground" />
              </div>
              <span className="text-xs font-medium text-accent-foreground">
                Rango
              </span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {pointData.rank?.name || 'N/A'}
            </p>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs h-6 mt-1 p-0"
            >
              <Link
                href="/dashboard/cli-rangos/rango-actual"
                className="text-accent-foreground"
              >
                Ver detalles
              </Link>
            </Button>
          </div>
        </div>

        {/* Volume Balance Visualization */}
        {volumeBalance && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                Balance de Volúmenes Semanal
              </h4>
              <span className="text-xs text-muted-foreground">
                {pointData.weeklyVolume?.weekStartDate &&
                  pointData.weeklyVolume?.weekEndDate &&
                  `${new Date(
                    pointData.weeklyVolume.weekStartDate,
                  ).toLocaleDateString()} - ${new Date(
                    pointData.weeklyVolume.weekEndDate,
                  ).toLocaleDateString()}`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Izquierda</span>
                  <span className="font-medium">
                    {volumeBalance.leftVolume.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    (volumeBalance.leftVolume /
                      Math.max(
                        volumeBalance.leftVolume,
                        volumeBalance.rightVolume,
                      )) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Derecha</span>
                  <span className="font-medium">
                    {volumeBalance.rightVolume.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    (volumeBalance.rightVolume /
                      Math.max(
                        volumeBalance.leftVolume,
                        volumeBalance.rightVolume,
                      )) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Monthly Volume Balance Visualization */}
        {monthlyVolumeBalance && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                Balance de Volúmenes Mensual
              </h4>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/cli-rangos/volumen-mensual">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver detalles
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Izquierda</span>
                  <span className="font-medium">
                    {monthlyVolumeBalance.leftVolume.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    (monthlyVolumeBalance.leftVolume /
                      Math.max(
                        monthlyVolumeBalance.leftVolume,
                        monthlyVolumeBalance.rightVolume,
                      )) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Derecha</span>
                  <span className="font-medium">
                    {monthlyVolumeBalance.rightVolume.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={
                    (monthlyVolumeBalance.rightVolume /
                      Math.max(
                        monthlyVolumeBalance.leftVolume,
                        monthlyVolumeBalance.rightVolume,
                      )) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsOverview;
