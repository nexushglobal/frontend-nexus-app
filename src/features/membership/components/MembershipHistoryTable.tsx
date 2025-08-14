'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { formatDate } from '@/features/shared/utils/formatCurrency';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import { MembershipHistoryItem } from '../types/membership.types';
import { translateHistoryAction } from '../utils/membershipTranslations';
import { MembershipHistoryCards } from './MembershipHistoryCards';

export function MembershipHistoryTable({
  items,
  isLoading,
  pagination,
  onPageChange,
  onLimitChange,
  errorMessage,
  onOpenChanges,
  onOpenMetadata,
}: {
  items: MembershipHistoryItem[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  errorMessage?: string | null;
  onOpenChanges: (data: Record<string, any>) => void;
  onOpenMetadata: (data: Record<string, any>) => void;
}) {
  const columns: ColumnDef<MembershipHistoryItem>[] = [
    {
      header: 'Fecha',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="text-sm">
          {formatDate(row.original.createdAt, 'dd/MM/yyyy HH:mm')}
        </span>
      ),
    },
    {
      header: 'Acción',
      accessorKey: 'action',
      cell: ({ row }) => (
        <span className="font-medium">
          {translateHistoryAction(row.original.action)}
        </span>
      ),
    },
    {
      header: 'Notas',
      accessorKey: 'notes',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {String(getValue() || '-')}
        </span>
      ),
    },
    {
      header: 'Cambios',
      cell: ({ row }) =>
        row.original.changes ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChanges(row.original.changes!)}
          >
            Ver cambios
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      enableSorting: false,
    },
    {
      header: 'Metadata',
      cell: ({ row }) =>
        row.original.metadata ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenMetadata(row.original.metadata!)}
          >
            Ver metadata
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block">
        <DataTable<MembershipHistoryItem, unknown>
          columns={columns}
          data={items || []}
          isLoading={isLoading}
          emptyMessage="Sin movimientos"
        />
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        <MembershipHistoryCards
          items={items || []}
          onOpenChanges={onOpenChanges}
          onOpenMetadata={onOpenMetadata}
        />
      </div>

      {pagination && (
        <Card className="shadow-sm p-1">
          <CardContent>
            <TablePagination
              pagination={pagination}
              onPageChange={onPageChange}
              onLimitChange={(l) => {
                onLimitChange(l);
                onPageChange(1);
              }}
              isLoading={isLoading}
              compact
            />
          </CardContent>
        </Card>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
