'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useAdminOrders } from '../../hooks/useOrderQuery';
import { OrderAdminCards } from '../admin/OrderAdminCards';
import { OrderAdminFilters } from '../admin/OrderAdminFilters';
import { OrderAdminTable } from '../admin/OrderAdminTable';
import { useOrderAdminFiltersStore } from '../stores/order-filters.store';

export default function OrderAdminPage() {
  const { filters, setFilter, setFilters } = useOrderAdminFiltersStore();

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

  const { data, isLoading, error, isError } = useAdminOrders(queryParams);

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
          title="Gestión de Pedidos"
          subtitle="Administra y revisa las órdenes de compra de los clientes en la plataforma"
          className="mb-6"
          variant="gradient"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los pedidos: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Gestión de Pedidos"
        subtitle="Administra y revisa las órdenes de compra de los clientes en la plataforma"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent>
            <OrderAdminFilters isLoading={isLoading} />
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
              <OrderAdminTable data={data.items} isLoading={isLoading} />
            </div>

            <div className="md:hidden">
              <OrderAdminCards data={data.items} />
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
