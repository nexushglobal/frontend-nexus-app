'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useClientOrders } from '../../hooks/useOrderQuery';
import { OrderClientCards } from '../client/OrderClientCards';
import { OrderClientFilters } from '../client/OrderClientFilters';
import { OrderClientTable } from '../client/OrderClientTable';
import { useOrderClientFiltersStore } from '../stores/order-client-filters.store';

export default function OrderClientPage() {
  const { filters, setFilter, setFilters } = useOrderClientFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.term) params.term = filters.term;
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useClientOrders(queryParams);

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
          title="Mis Pedidos"
          subtitle="Consulta el historial y estado de tus pedidos"
          className="mb-6"
          variant="gradient"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar tus pedidos: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Mis Pedidos"
        subtitle="Consulta el historial y estado de tus pedidos"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent>
            <OrderClientFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {isLoading && !data && (
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando pedidos...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="hidden md:block">
              <OrderClientTable data={data.items} isLoading={isLoading} />
            </div>

            <div className="md:hidden">
              <OrderClientCards data={data.items} />
            </div>

            <Card className="shadow-sm p-1">
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
