'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  FileText,
  Loader2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { VOLUME_SITE, VOLUME_STATUS } from '../../constants';
import { useWeeklyVolumes } from '../../hooks/useWeeklyVolumes';

interface WeeklyVolumeDetailPageProps {
  volumeId: string;
}

export function WeeklyVolumeDetailPage({
  volumeId,
}: WeeklyVolumeDetailPageProps) {
  const {
    data: volumesData,
    isLoading,
    error,
    isError,
  } = useWeeklyVolumes({ id: volumeId });

  const volume = volumesData?.items?.[0];

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

  if (isError || !volume) {
    return (
      <div className="container">
        <PageHeader
          title="Detalle de Volumen Semanal"
          subtitle="Información detallada del volumen semanal"
          className="mb-6"
          variant="gradient"
        />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message ||
              'No se pudo cargar el detalle del volumen semanal'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const statusVariant = {
    PENDING: 'outline' as const,
    PROCESSED: 'secondary' as const,
    CANCELLED: 'destructive' as const,
  };

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
        className="mb-6"
        variant="gradient"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información general */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de información básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Información del Período</span>
                <Badge variant={statusVariant[volume.status]}>
                  {VOLUME_STATUS[volume.status]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha de inicio</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(volume.weekStartDate + 'T00:00:00'),
                        'dd/MM/yyyy',
                        { locale: es },
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha de fin</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(volume.weekEndDate + 'T00:00:00'),
                        'dd/MM/yyyy',
                        { locale: es },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de volúmenes */}
          <Card>
            <CardHeader>
              <CardTitle>Volúmenes de Puntos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Volumen Izquierda
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {volume.leftVolume.toLocaleString('es-ES')}
                    </p>
                    <p className="text-sm text-muted-foreground">puntos</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Volumen Derecha
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {volume.rightVolume.toLocaleString('es-ES')}
                    </p>
                    <p className="text-sm text-muted-foreground">puntos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar con información adicional */}
        <div className="space-y-6">
          {/* Lado seleccionado y comisión */}
          {(volume.selectedSide || volume.commissionEarned) && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {volume.selectedSide && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Lado Seleccionado
                    </p>
                    <Badge
                      variant={
                        volume.selectedSide === 'LEFT' ? 'outline' : 'secondary'
                      }
                    >
                      {VOLUME_SITE[volume.selectedSide]}
                    </Badge>
                  </div>
                )}

                {volume.commissionEarned && (
                  <>
                    {volume.selectedSide && <Separator />}
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CircleDollarSign className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Comisión Ganada
                        </p>
                        <p className="font-bold text-green-600">
                          {volume.commissionEarned.toLocaleString('es-ES')} pts
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {volume.metadata && Object.keys(volume.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-auto">
                  <pre className="bg-muted p-3 rounded text-xs">
                    {JSON.stringify(volume.metadata, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información de timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">ID del Volumen</p>
                <p className="font-mono">{volume.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Creado</p>
                <p>
                  {format(new Date(volume.createdAt), 'dd/MM/yyyy HH:mm', {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Actualizado</p>
                <p>
                  {format(new Date(volume.updatedAt), 'dd/MM/yyyy HH:mm', {
                    locale: es,
                  })}
                </p>
              </div>
              {volume.processedAt && (
                <div>
                  <p className="text-muted-foreground">Procesado</p>
                  <p>
                    {format(new Date(volume.processedAt), 'dd/MM/yyyy HH:mm', {
                      locale: es,
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
