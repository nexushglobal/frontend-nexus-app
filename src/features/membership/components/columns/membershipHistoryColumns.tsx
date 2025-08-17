'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, Eye, FileText, Settings } from 'lucide-react';
import { MembershipHistoryItem } from '../../types/membership.types';
import { translateHistoryAction } from '../../utils/membershipTranslations';

interface CreateMembershipHistoryColumnsProps {
  onOpenChanges: (changes: Record<string, any>, metadata?: Record<string, any>) => void;
}

export function createMembershipHistoryColumns({
  onOpenChanges,
}: CreateMembershipHistoryColumnsProps): ColumnDef<MembershipHistoryItem>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Fecha
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary/60"></div>
          <span className="font-medium text-sm">
            {formatDate(row.original.createdAt, 'dd/MM/yyyy HH:mm')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Acción
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
            <Settings className="h-3 w-3 text-blue-600" />
          </div>
          <span className="font-medium">
            {translateHistoryAction(row.original.action)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'notes',
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notas
        </div>
      ),
      cell: ({ getValue }) => {
        const notes = getValue();
        return notes ? (
          <div className="max-w-[300px] truncate" title={String(notes)}>
            <span className="text-sm">{String(notes)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Sin notas</span>
        );
      },
    },
    {
      id: 'details',
      header: 'Detalles',
      cell: ({ row }) =>
        (row.original.changes || row.original.metadata) ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChanges(row.original.changes, row.original.metadata)}
            className="gap-1"
          >
            <Eye className="h-3 w-3" />
            Ver detalles
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      enableSorting: false,
    },
  ];
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility = {
  // Todas las columnas visibles por defecto
};