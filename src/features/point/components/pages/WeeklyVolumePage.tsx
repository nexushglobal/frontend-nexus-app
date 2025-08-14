'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useWeeklyVolumes } from '../../hooks/useWeeklyVolumes';
import { useWeeklyVolumeFiltersStore } from '../../stores/weekly-volume-filters.store';
import { WeeklyVolumeCards } from '../WeeklyVolumeCards';
import { WeeklyVolumeFilters } from '../WeeklyVolumeFilters';
import { WeeklyVolumeTable } from '../WeeklyVolumeTable';

export function WeeklyVolumePage() {
  const { filters, setFilter, setFilters } = useWeeklyVolumeFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  }, [filters]);

  const {
    data: volumesData,
    isLoading,
    error,
    isError,
  } = useWeeklyVolumes(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  if (isError) {
    return (
      <div className="container">
        <PageHeader
          title="Volúmenes Semanales"
          subtitle="Consulta tus volúmenes semanales de puntos y comisiones ganadas"
          className="mb-6"
          variant="gradient"
        />

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los volúmenes semanales:{' '}
            {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Volúmenes Semanales"
        subtitle="Consulta tus volúmenes semanales de puntos y comisiones ganadas"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        {/* Filtros */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <WeeklyVolumeFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Loading state */}
        {isLoading && !volumesData && (
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando volúmenes semanales...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla y cards */}
        {volumesData && (
          <>
            {/* Desktop - Tabla */}
            <div className="hidden md:block">
              <WeeklyVolumeTable
                data={volumesData.items}
                isLoading={isLoading}
              />
            </div>

            {/* Mobile - Cards */}
            <div className="md:hidden">
              <WeeklyVolumeCards data={volumesData.items} />
            </div>

            {/* Paginación */}
            <Card className="shadow-sm p-1">
              <CardContent>
                <TablePagination
                  pagination={volumesData.pagination}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
