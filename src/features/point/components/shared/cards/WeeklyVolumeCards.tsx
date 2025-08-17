'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { VOLUME_SITE, VOLUME_STATUS } from '@/features/point/constants';
import { WeeklyVolume } from '@/features/point/types/weekly.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  CircleDollarSign,
  Eye,
  FileText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: Record<string, any> | undefined;
}

function MetadataModal({ isOpen, onClose, metadata }: MetadataModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Metadata del Volumen Semanal</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-auto">
          <pre className="bg-muted p-4 rounded-lg text-sm">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActionsButtonsProps {
  volume: WeeklyVolume;
}

function ActionsButtons({ volume }: ActionsButtonsProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const hasMetadata =
    volume.metadata && Object.keys(volume.metadata).length > 0;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMetadata(true)}
        disabled={!hasMetadata}
        className="h-8 w-8 p-0"
        title={hasMetadata ? 'Ver metadata' : 'Sin metadata disponible'}
      >
        <FileText className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
        title="Ver detalle"
      >
        <Link
          href={`/dashboard/cli-puntos/volumenes-semanales/semana/${volume.id}`}
        >
          <Eye className="h-4 w-4" />
        </Link>
      </Button>

      <MetadataModal
        isOpen={showMetadata}
        onClose={() => setShowMetadata(false)}
        metadata={volume.metadata}
      />
    </div>
  );
}

interface WeeklyVolumeCardsProps {
  data: WeeklyVolume[];
}

export function WeeklyVolumeCards({ data }: WeeklyVolumeCardsProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">
            No se encontraron volúmenes semanales
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((volume) => (
        <WeeklyVolumeCard key={volume.id} volume={volume} />
      ))}
    </div>
  );
}

interface WeeklyVolumeCardProps {
  volume: WeeklyVolume;
}

function WeeklyVolumeCard({ volume }: WeeklyVolumeCardProps) {
  const statusVariants = {
    PENDING: 'outline' as const,
    PROCESSED: 'secondary' as const,
    CANCELLED: 'destructive' as const,
  };

  const statusColors = {
    PENDING: 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600',
    PROCESSED: 'text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600',
    CANCELLED: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600',
  };

  const isPending = volume.status === 'PENDING';

  return (
    <Card className={`shadow-sm ${isPending ? 'bg-yellow-50/30 dark:bg-yellow-900/10 border-l-4 border-l-yellow-400' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {format(new Date(volume.weekStartDate + 'T00:00:00'), 'dd/MM', {
                  locale: es,
                })}{' '}
                al{' '}
                {format(
                  new Date(volume.weekEndDate + 'T00:00:00'),
                  'dd/MM/yyyy',
                  { locale: es },
                )}
              </p>
              <p className="text-xs text-muted-foreground">Semana</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={statusVariants[volume.status]} 
              className={statusColors[volume.status]}
            >
              {VOLUME_STATUS[volume.status]}
            </Badge>
            <ActionsButtons volume={volume} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Volúmenes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">
                {volume.leftVolume.toLocaleString('es-ES')} pts
              </p>
              <p className="text-xs text-muted-foreground">Vol. Izquierda</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">
                {volume.rightVolume.toLocaleString('es-ES')} pts
              </p>
              <p className="text-xs text-muted-foreground">Vol. Derecha</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Lado seleccionado y comisión */}
        <div className="space-y-2">
          {volume.selectedSide && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Lado Seleccionado:
              </span>
              <Badge 
                variant="outline" 
                className={volume.selectedSide === 'LEFT' 
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                  : 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600'
                }
              >
                {VOLUME_SITE[volume.selectedSide]}
              </Badge>
            </div>
          )}

          {volume.commissionEarned && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Comisión:</span>
              <div className="flex items-center gap-1">
                <CircleDollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {volume.commissionEarned.toLocaleString('es-ES')} pts
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
