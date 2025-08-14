'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ColumnDef } from '@tanstack/react-table';
import {
  CalendarDays,
  Eye,
  FileText,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { VOLUME_SITE, VOLUME_STATUS } from '../constants/index';
import { WeeklyVolume } from '../types/weekly.types';

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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
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
        <Badge variant={side === 'LEFT' ? 'outline' : 'secondary'}>
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

      return (
        <span className="font-medium text-green-600">
          {commission.toLocaleString('es-ES')} pts
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusVariant = {
        PENDING: 'outline' as const,
        PROCESSED: 'secondary' as const,
        CANCELLED: 'destructive' as const,
      };

      return (
        <Badge variant={statusVariant[status]}>{VOLUME_STATUS[status]}</Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionsMenu volume={row.original} />,
  },
];
