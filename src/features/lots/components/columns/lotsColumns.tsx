'use client';

import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { MapPin, Package } from 'lucide-react';
import type { LotDetail } from '../../types/lots.types';

export const lotsColumns: ColumnDef<LotDetail>[] = [
  {
    accessorKey: 'name',
    header: 'Lote y Ubicación',
    cell: ({ row }) => {
      const lot = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-semibold">{lot.name}</span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1 ml-6">
            <MapPin className="h-3 w-3" />
            <span>Manzana {lot.blockName} - Etapa {lot.stageName}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'area',
    header: 'Área',
    cell: ({ row }) => {
      const lot = row.original;
      return <span>{lot.area} m²</span>;
    },
  },
  {
    accessorKey: 'lotPrice',
    header: 'Precio Lote',
    cell: ({ row }) => {
      const lot = row.original;
      return (
        <span className="font-bold text-lg text-primary">
          {formatCurrency(parseFloat(lot.lotPrice), lot.projectCurrency)}
        </span>
      );
    },
  },
  {
    accessorKey: 'urbanizationPrice',
    header: 'Precio Urb.',
    cell: ({ row }) => {
      const lot = row.original;
      return (
        <span className="font-medium">
          {formatCurrency(parseFloat(lot.urbanizationPrice), lot.projectCurrency)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const lot = row.original;
      return (
        <Badge variant={getLotStatusVariant(lot.status)}>
          {getLotStatusText(lot.status)}
        </Badge>
      );
    },
  },
];

function getLotStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'disponible':
    case 'available':
      return 'default';
    case 'reservado':
    case 'reserved':
      return 'secondary';
    case 'vendido':
    case 'sold':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getLotStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'disponible':
    case 'available':
      return 'Disponible';
    case 'reservado':
    case 'reserved':
      return 'Reservado';
    case 'vendido':
    case 'sold':
      return 'Vendido';
    default:
      return status;
  }
}