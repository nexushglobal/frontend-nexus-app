'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useWeeklyVolumeDetail } from '../../hooks/useWeeklyVolumeDetail';
import { WeeklyVolumeHistoryComponent } from '../shared/section/WeeklyVolumeHistory';
import { WeeklyVolumeStats } from '../shared/section/WeeklyVolumeStats';

interface WeeklyVolumeDetailPageProps {
  volumeId: number;
}

export function WeeklyVolumeDetailPage({
  volumeId,
}: WeeklyVolumeDetailPageProps) {
  const { data: volume, isLoading, error } = useWeeklyVolumeDetail(volumeId);

  if (isLoading) {
    return (
      <div className="container">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-muted-foreground">
              Cargando detalle del volumen semanal...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !volume) {
    return (
      <div className="container">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/cli-puntos/volumenes-semanales">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>

        <PageHeader
          title="Detalle de Volumen Semanal"
          subtitle="Información detallada del volumen semanal"
          className="mb-6"
          variant="gradient"
        />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'No se pudo cargar el detalle del volumen semanal'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/cli-puntos/volumenes-semanales">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Detalle de Volumen Semanal"
        subtitle={`Semana del ${format(
          new Date(volume.weekStartDate + 'T00:00:00'),
          'dd/MM/yyyy',
          { locale: es },
        )} al ${format(
          new Date(volume.weekEndDate + 'T00:00:00'),
          'dd/MM/yyyy',
          { locale: es },
        )}`}
        className="mb-8"
        variant="gradient"
      />

      {/* Cards de estadísticas principales */}
      <WeeklyVolumeStats volume={volume} />

      {/* Componente de historial de volumen */}
      <WeeklyVolumeHistoryComponent volumeId={volumeId} />
    </div>
  );
}
