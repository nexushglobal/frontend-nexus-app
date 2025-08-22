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
import { MonthlyVolume } from '@/features/point/types/monthly.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  Crown,
  FileText,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const VOLUME_STATUS = {
  PENDING: 'Pendiente',
  PROCESSED: 'Procesado',
  CANCELLED: 'Cancelado',
} as const;

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
          <DialogTitle>Metadata del Volumen Mensual</DialogTitle>
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
  volume: MonthlyVolume;
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

      <MetadataModal
        isOpen={showMetadata}
        onClose={() => setShowMetadata(false)}
        metadata={volume.metadata}
      />
    </div>
  );
}

interface MonthlyVolumeCardsProps {
  data: MonthlyVolume[];
}

export function MonthlyVolumeCards({ data }: MonthlyVolumeCardsProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">
            No se encontraron volúmenes mensuales
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((volume) => (
        <MonthlyVolumeCard key={volume.id} volume={volume} />
      ))}
    </div>
  );
}

interface MonthlyVolumeCardProps {
  volume: MonthlyVolume;
}

function MonthlyVolumeCard({ volume }: MonthlyVolumeCardProps) {
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
                {format(new Date(volume.monthStartDate + 'T00:00:00'), 'MMMM yyyy', {
                  locale: es,
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(volume.monthStartDate + 'T00:00:00'), 'dd/MM', {
                  locale: es,
                })}{' '}
                al{' '}
                {format(
                  new Date(volume.monthEndDate + 'T00:00:00'),
                  'dd/MM/yyyy',
                  { locale: es },
                )}
              </p>
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
        {/* Rango asignado */}
        {volume.assignedRank && (
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <Crown className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {volume.assignedRank.name}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Rango asignado
              </p>
            </div>
          </div>
        )}

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

        {/* Volumen total */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Volumen Total:</span>
          <span className="font-bold text-lg">
            {volume.totalVolume.toLocaleString('es-ES')} pts
          </span>
        </div>

        <Separator />

        {/* Referidos directos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{volume.leftDirects}</p>
              <p className="text-xs text-muted-foreground">Directos Izq.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">{volume.rightDirects}</p>
              <p className="text-xs text-muted-foreground">Directos Der.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}