'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VOLUME_SITE } from '@/features/point/constants';
import { VolumeStatus } from '@/features/point/types/enums-volume';
import { WeeklyVolume } from '@/features/point/types/weekly.types';
import { MetadataModal } from '@/features/shared/components/modal/MetadataModal';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { formatTableAmount } from '@/features/shared/utils/table.utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  CalendarDays,
  Eye,
  FileText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';


interface ActionsColumnProps {
  volume: WeeklyVolume;
}

function ActionsColumn({ volume }: ActionsColumnProps) {
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
        title="Metadata del Volumen Semanal"
      />
    </div>
  );
}

export const weeklyVolumeColumns: ColumnDef<WeeklyVolume>[] = [
  {
    accessorKey: 'weekStartDate',
    header: 'Semana',
    cell: ({ row }) => {
      const startDate = row.original.weekStartDate;
      const endDate = row.original.weekEndDate;

      return (
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">
              {new Date(startDate + 'T00:00:00').toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
            <span className="text-xs text-muted-foreground">
              al{' '}
              {new Date(endDate + 'T00:00:00').toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'leftVolume',
    header: 'Vol. Izquierda',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-blue-500" />
        <span className="font-medium">
          {row.original.leftVolume.toLocaleString('es-ES')} pts
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'rightVolume',
    header: 'Vol. Derecha',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-green-500" />
        <span className="font-medium">
          {row.original.rightVolume.toLocaleString('es-ES')} pts
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'selectedSide',
    header: 'Lado Seleccionado',
    cell: ({ row }) => {
      const side = row.original.selectedSide;
      if (!side) return <span className="text-muted-foreground">-</span>;

      return (
        <Badge 
          variant="outline" 
          className={side === 'LEFT' 
            ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
            : 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600'
          }
        >
          {VOLUME_SITE[side]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'commissionEarned',
    header: 'Comisión',
    cell: ({ row }) => {
      const commission = row.original.commissionEarned;
      if (!commission) return <span className="text-muted-foreground">-</span>;

      const { formatted } = formatTableAmount(commission);
      return (
        <span className="font-medium text-green-600">
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.status as VolumeStatus;
      const statusConfig = getStatusConfig(status);

      return (
        <Badge
          variant={statusConfig.variant}
          className={statusConfig.className}
        >
          {statusConfig.label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionsColumn volume={row.original} />,
  },
];
