'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { MetadataModal } from '@/features/shared/components/modal/MetadataModal';
import { MonthlyVolume } from '@/features/point/types/monthly.types';
import { VolumeStatus } from '@/features/point/types/enums-volume';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';



export const monthlyVolumeColumns: ColumnDef<MonthlyVolume>[] = [
  {
    accessorKey: 'monthStartDate',
    header: 'Periodo',
    cell: ({ row }) => {
      const volume = row.original;
      const startDate = new Date(volume.monthStartDate + 'T00:00:00');
      const endDate = new Date(volume.monthEndDate + 'T00:00:00');
      
      return (
        <div className="font-medium">
          <div>
            {format(startDate, 'MMM yyyy', { locale: es })}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(startDate, 'dd/MM', { locale: es })} al{' '}
            {format(endDate, 'dd/MM/yyyy', { locale: es })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'assignedRank',
    header: 'Rango',
    cell: ({ row }) => {
      const rank = row.original.assignedRank;
      
      if (!rank) {
        return <span className="text-muted-foreground">-</span>;
      }
      
      return (
        <Badge variant="outline" className="font-medium">
          {rank.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'totalVolume',
    header: 'Vol. Total',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <div className="font-medium">
          {value.toLocaleString('es-ES')} pts
        </div>
      );
    },
  },
  {
    accessorKey: 'leftVolume',
    header: 'Vol. Izquierda',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <div className="text-blue-600 font-medium">
          {value.toLocaleString('es-ES')} pts
        </div>
      );
    },
  },
  {
    accessorKey: 'rightVolume',
    header: 'Vol. Derecha',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <div className="text-green-600 font-medium">
          {value.toLocaleString('es-ES')} pts
        </div>
      );
    },
  },
  {
    accessorKey: 'leftDirects',
    header: 'Directos Izq.',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <div className="text-center">{value}</div>;
    },
  },
  {
    accessorKey: 'rightDirects',
    header: 'Directos Der.',
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return <div className="text-center">{value}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ getValue }) => {
      const status = getValue() as VolumeStatus;
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
    cell: ({ row }) => {
      const volume = row.original;
      const [showMetadata, setShowMetadata] = useState(false);
      const hasMetadata = volume.metadata && Object.keys(volume.metadata).length > 0;
      
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
          
          {hasMetadata && (
            <MetadataModal
              metadata={volume.metadata}
              isOpen={showMetadata}
              onClose={() => setShowMetadata(false)}
              title="Metadata del Volumen Mensual"
            />
          )}
        </div>
      );
    },
  },
];