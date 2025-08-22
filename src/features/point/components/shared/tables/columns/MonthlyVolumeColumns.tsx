'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MonthlyVolume } from '@/features/point/types/monthly.types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const VOLUME_STATUS = {
  PENDING: 'Pendiente',
  PROCESSED: 'Procesado',
  CANCELLED: 'Cancelado',
} as const;

function MetadataModal({ 
  metadata, 
  isOpen, 
  onClose 
}: { 
  metadata: Record<string, any>; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
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
      const status = getValue() as keyof typeof VOLUME_STATUS;
      
      const statusColors = {
        PENDING: 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600',
        PROCESSED: 'text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600',
        CANCELLED: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600',
      };
      
      return (
        <Badge 
          variant="outline" 
          className={statusColors[status]}
        >
          {VOLUME_STATUS[status]}
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
            />
          )}
        </div>
      );
    },
  },
];