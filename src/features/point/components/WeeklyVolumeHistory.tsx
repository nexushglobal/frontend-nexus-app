'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { VOLUME_SITE } from '@/features/point/constants';
import { useWeeklyVolumeHistory } from '@/features/point/hooks/useWeeklyVolumeHistory';
import type { WeeklyVolumeHistory } from '@/features/point/types/weekly.types';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowUpDown, Calendar, Hash, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface WeeklyVolumeHistoryComponentProps {
  volumeId: number;
}

export function WeeklyVolumeHistoryComponent({
  volumeId,
}: WeeklyVolumeHistoryComponentProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: historyData,
    isLoading,
    error,
  } = useWeeklyVolumeHistory(
    volumeId,
    showHistory ? { page: currentPage, limit: pageSize } : {},
  );

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setPageSize(limit);
    setCurrentPage(1);
  };

  // Columnas para la tabla de historial
  const columns: ColumnDef<WeeklyVolumeHistory>[] = [
    {
      id: 'paymentId',
      accessorKey: 'paymentId',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          <Hash className="mr-2 h-4 w-4" />
          ID de Pago
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.paymentId}</div>
      ),
    },
    {
      id: 'volumeSide',
      accessorKey: 'volumeSide',
      header: 'Lado',
      cell: ({ row }) => (
        <Badge
          variant={row.original.volumeSide === 'LEFT' ? 'outline' : 'secondary'}
        >
          {VOLUME_SITE[row.original.volumeSide]}
        </Badge>
      ),
    },
    {
      id: 'volume',
      accessorKey: 'volume',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Volumen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-primary">
          {row.original.volume.toLocaleString('es-ES')} pts
        </div>
      ),
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm', {
            locale: es,
          })}
        </div>
      ),
    },
  ];

  // Columnas para vista móvil (cards)
  const mobileColumns: ColumnDef<WeeklyVolumeHistory>[] = [
    {
      id: 'mobile',
      cell: ({ row }) => (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">ID de Pago</span>
                </div>
                <span className="font-mono text-sm">
                  {row.original.paymentId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Lado</span>
                </div>
                <Badge
                  variant={
                    row.original.volumeSide === 'LEFT' ? 'outline' : 'secondary'
                  }
                >
                  {VOLUME_SITE[row.original.volumeSide]}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Volumen</span>
                </div>
                <span className="font-semibold text-primary">
                  {row.original.volume.toLocaleString('es-ES')} pts
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Fecha</span>
                </div>
                <span className="text-sm">
                  {format(
                    new Date(row.original.createdAt),
                    'dd/MM/yyyy HH:mm',
                    {
                      locale: es,
                    },
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  if (!showHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Volumen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ver el historial detallado de transacciones que contribuyeron a este
            volumen semanal.
          </p>
          <Button onClick={handleShowHistory} variant="outline">
            Mostrar Historial de Volumen
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Volumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !historyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Volumen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Error al cargar el historial de volumen
          </p>
          <Button
            onClick={() => setShowHistory(false)}
            variant="outline"
            className="mt-4"
          >
            Ocultar Historial
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { items, pagination } = historyData;
  const { page, limit, total, totalPages } = pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Historial de Volumen</span>
          <Button
            onClick={() => setShowHistory(false)}
            variant="outline"
            size="sm"
          >
            Ocultar Historial
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={items}
            isLoading={isLoading}
            emptyMessage="No hay transacciones en este período"
          />
        </div>

        {/* Mobile cards */}
        <div className="md:hidden">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay transacciones en este período
              </p>
            </div>
          ) : (
            <DataTable
              columns={mobileColumns}
              data={items}
              isLoading={isLoading}
              showColumnToggle={false}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <TablePagination
              pagination={{ page, limit, total, totalPages }}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
              compact={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
