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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  MoreHorizontal,
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

interface ActionsMenuProps {
  volume: WeeklyVolume;
}

function ActionsMenu({ volume }: ActionsMenuProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const hasMetadata =
    volume.metadata && Object.keys(volume.metadata).length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/cli-puntos/volumenes-semanales/semana/${volume.id}`}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!hasMetadata}
            onClick={() => setShowMetadata(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver metadata
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MetadataModal
        isOpen={showMetadata}
        onClose={() => setShowMetadata(false)}
        metadata={volume.metadata}
      />
    </>
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
  const statusVariant = {
    PENDING: 'outline' as const,
    PROCESSED: 'secondary' as const,
    CANCELLED: 'destructive' as const,
  };

  return (
    <Card className="shadow-sm">
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
            <Badge variant={statusVariant[volume.status]}>
              {VOLUME_STATUS[volume.status]}
            </Badge>
            <ActionsMenu volume={volume} />
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
                variant={
                  volume.selectedSide === 'LEFT' ? 'outline' : 'secondary'
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
