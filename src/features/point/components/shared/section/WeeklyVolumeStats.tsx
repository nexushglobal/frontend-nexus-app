'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { VOLUME_SITE, VOLUME_STATUS } from '@/features/point/constants';
import type { WeeklyVolume } from '@/features/point/types/weekly.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Award,
  Calendar,
  CircleDollarSign,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface WeeklyVolumeStatsProps {
  volume: WeeklyVolume;
}

export function WeeklyVolumeStats({ volume }: WeeklyVolumeStatsProps) {
  const statusVariant = {
    PENDING: 'outline' as const,
    PROCESSED: 'secondary' as const,
    CANCELLED: 'destructive' as const,
  };

  const totalVolume = volume.leftVolume + volume.rightVolume;
  const leftPercentage =
    totalVolume > 0 ? (volume.leftVolume / totalVolume) * 100 : 0;
  const rightPercentage =
    totalVolume > 0 ? (volume.rightVolume / totalVolume) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card de Volumen Izquierda */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {leftPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
              Volumen Izquierda
            </h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {volume.leftVolume.toLocaleString('es-ES')}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">puntos</p>
          </div>
        </CardContent>
      </Card>

      {/* Card de Volumen Derecha */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                {rightPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              Volumen Derecha
            </h3>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {volume.rightVolume.toLocaleString('es-ES')}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">puntos</p>
          </div>
        </CardContent>
      </Card>

      {/* Card de Volumen Total */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <Badge variant={statusVariant[volume.status]} className="text-xs">
              {VOLUME_STATUS[volume.status]}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
              Volumen Total
            </h3>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {totalVolume.toLocaleString('es-ES')}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              puntos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card de Comisión */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500 rounded-lg">
              {volume.commissionEarned ? (
                <Award className="h-6 w-6 text-white" />
              ) : (
                <CircleDollarSign className="h-6 w-6 text-white" />
              )}
            </div>
            {volume.selectedSide && (
              <Badge
                variant={
                  volume.selectedSide === 'LEFT' ? 'outline' : 'secondary'
                }
                className="text-xs"
              >
                {VOLUME_SITE[volume.selectedSide]}
              </Badge>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
              {volume.commissionEarned ? 'Comisión Ganada' : 'Comisión'}
            </h3>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {volume.commissionEarned
                ? volume.commissionEarned.toLocaleString('es-ES')
                : '0'}
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">puntos</p>
          </div>
        </CardContent>
      </Card>

      {/* Card adicional con período de tiempo */}
      <Card className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950/30 dark:to-slate-900/30 border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Período de Volumen
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>
                  <strong>Inicio:</strong>{' '}
                  {format(
                    new Date(volume.weekStartDate + 'T00:00:00'),
                    'dd/MM/yyyy',
                    { locale: es },
                  )}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  <strong>Fin:</strong>{' '}
                  {format(
                    new Date(volume.weekEndDate + 'T00:00:00'),
                    'dd/MM/yyyy',
                    { locale: es },
                  )}
                </span>
                {volume.processedAt && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      <strong>Procesado:</strong>{' '}
                      {format(
                        new Date(volume.processedAt),
                        'dd/MM/yyyy HH:mm',
                        { locale: es },
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
