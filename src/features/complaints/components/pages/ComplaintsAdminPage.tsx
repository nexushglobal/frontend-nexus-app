'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import { useComplaintsFiltersStore } from '../../stores/complaints-filters.store';
import { ComplaintsTable } from '../ComplaintsTable';
import { ComplaintsCards } from '../ComplaintsCards';
import { ComplaintsFilters } from '../ComplaintsFilters';

export function ComplaintsAdminPage() {
  const { filters, setFilter, setFilters } = useComplaintsFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.attended !== undefined) params.attended = filters.attended;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useComplaints(queryParams);

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
          title="Libro de Reclamaciones"
          subtitle="Gestiona y revisa todos los reclamos y quejas de los usuarios"
          className="mb-6"
          variant="gradient"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los reclamos: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Libro de Reclamaciones"
        subtitle="Gestiona y revisa todos los reclamos y quejas de los usuarios"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent>
            <ComplaintsFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {isLoading && !data && (
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">Cargando reclamos...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="hidden md:block">
              <ComplaintsTable data={data.items} isLoading={isLoading} />
            </div>

            <div className="md:hidden">
              <ComplaintsCards data={data.items} />
            </div>

            <Card className="shadow-sm p-0">
              <CardContent>
                <TablePagination
                  pagination={data.pagination}
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