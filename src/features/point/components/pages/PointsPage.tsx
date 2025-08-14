'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { getUserPointsAction } from '../../action/get-points.action';
import { useUserTransactions } from '../../hooks/usePointTransactions';
import { usePointFiltersStore } from '../../stores/point-filters.store';
import { PointFilters } from '../PointFilters';
import { PointSummaryCards } from '../PointSummaryCards';
import { PointTransactionsCards } from '../PointTransactionsCards';
import { PointTransactionsTable } from '../PointTransactionsTable';

interface PointsPageProps {
  initialPointsData: Awaited<ReturnType<typeof getUserPointsAction>>;
}

export function PointsPage({ initialPointsData }: PointsPageProps) {
  const { filters, setFilter, setFilters } = usePointFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  }, [filters]);

  const {
    data: transactionsData,
    isLoading,
    error,
    isError,
  } = useUserTransactions(queryParams);

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
          title="Mis Puntos"
          subtitle="Consulta tu resumen de puntos y historial de transacciones"
          className="mb-6"
          variant="gradient"
        />

        <div className="space-y-6">
          <PointSummaryCards
            data={initialPointsData.success ? initialPointsData.data : null}
            isLoading={false}
          />

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar el historial:{' '}
              {error?.message || 'Error desconocido'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Mis Puntos"
        subtitle="Consulta tu resumen de puntos y historial de transacciones"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        {/* Resumen de puntos */}
        <PointSummaryCards
          data={initialPointsData.success ? initialPointsData.data : null}
          isLoading={false}
        />

        {/* Filtros */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <PointFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Loading state */}
        {isLoading && !transactionsData && (
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando historial de transacciones...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla y cards */}
        {transactionsData && (
          <>
            {/* Desktop - Tabla */}
            <div className="hidden md:block">
              <PointTransactionsTable
                data={transactionsData.items}
                isLoading={isLoading}
              />
            </div>

            {/* Mobile - Cards */}
            <div className="md:hidden">
              <PointTransactionsCards data={transactionsData.items} />
            </div>

            {/* Paginación */}
            <Card className="shadow-sm p-1">
              <CardContent>
                <TablePagination
                  pagination={transactionsData.pagination}
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
