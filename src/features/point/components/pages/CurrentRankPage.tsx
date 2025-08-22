'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Crown,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { useCurrentRank } from '../../hooks/useCurrentRank';

export function CurrentRankPage() {
  const { data, isLoading, error, refetch, isRefetching } = useCurrentRank();

  if (error) {
    return (
      <div className="container">
        <PageHeader
          title="Rango Actual"
          subtitle="Consulta tu información de rango y progreso en el sistema"
          className="mb-6"
          variant="gradient"
        />
        
        <Card className="border-destructive/50">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Error al cargar los datos</h3>
                <p className="text-muted-foreground">
                  No se pudo cargar la información de tu rango actual
                </p>
              </div>
              <Button onClick={() => refetch()} disabled={isRefetching}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Rango Actual"
        subtitle="Consulta tu información de rango y progreso en el sistema"
        className="mb-6"
        variant="gradient"
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Tarjetas de rangos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rango actual */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Crown className="h-5 w-5" />
                  Rango Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {data.currentRank.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Código: {data.currentRank.code}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rango más alto */}
            {data.highestRank && (
              <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <Trophy className="h-5 w-5" />
                    Rango Más Alto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <Badge variant="outline" className="text-lg px-4 py-2 border-yellow-500 text-yellow-700 dark:text-yellow-400">
                      {data.highestRank.name}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Código: {data.highestRank.code}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Siguiente rango */}
            <Card className="border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Target className="h-5 w-5" />
                  Siguiente Rango
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="text-lg px-4 py-2 border-green-500 text-green-700 dark:text-green-400">
                    {data.nextRankNow.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Código: {data.nextRankNow.code}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Datos actuales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datos del Mes Actual
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Periodo: {format(new Date(data.currentData.monthStartDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: es })} 
                {' - '}
                {format(new Date(data.currentData.monthEndDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: es })}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estado */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Estado del mes:</span>
                <Badge 
                  variant={data.currentData.status === 'PROCESSED' ? 'default' : 'outline'}
                  className={
                    data.currentData.status === 'PENDING' 
                      ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600'
                      : data.currentData.status === 'PROCESSED'
                      ? 'text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600'
                      : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600'
                  }
                >
                  {data.currentData.status === 'PENDING' ? 'Pendiente' : 
                   data.currentData.status === 'PROCESSED' ? 'Procesado' : 'Cancelado'}
                </Badge>
              </div>

              <Separator />

              {/* Volúmenes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {data.currentData.leftVolume.toLocaleString('es-ES')}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Volumen Izquierda
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <TrendingDown className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {data.currentData.rightVolume.toLocaleString('es-ES')}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Volumen Derecha
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Target className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {data.currentData.totalVolume.toLocaleString('es-ES')}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">
                      Volumen Total
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Referidos y equipos */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold">{data.currentData.leftDirects}</p>
                  <p className="text-sm text-muted-foreground">Directos Izq.</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold">{data.currentData.rightDirects}</p>
                  <p className="text-sm text-muted-foreground">Directos Der.</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold">{data.currentData.totalDirects}</p>
                  <p className="text-sm text-muted-foreground">Total Directos</p>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold">{data.currentData.activeTeams}</p>
                  <p className="text-sm text-muted-foreground">Equipos Activos</p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${data.currentData.hasActiveMembership ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">
                    Membresía {data.currentData.hasActiveMembership ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">QV Pierna de Pago:</span>
                  <span className="font-medium">{data.currentData.payLegQv.toLocaleString('es-ES')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Referidos Activos:</span>
                  <span className="font-medium">{data.currentData.activeDirectReferrals}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requisitos para siguiente rango */}
          {data.nextRankReq && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Target className="h-5 w-5" />
                  Requisitos para {data.nextRankReq.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.nextRankReq.requerimientos.map((req, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{req}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}