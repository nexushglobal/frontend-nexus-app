'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  AlertCircle,
  Loader2,
  Package,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Link from 'next/link';
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
      <div className="container space-y-6">
        <EnhancedOrderHeader />
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
    <div className="container space-y-6">
      <EnhancedOrderHeader />

      <div className="space-y-6">
        {/* Filters Section */}
        <Card className="shadow-sm py-0">
          <CardContent className="py-4">
            <OrderClientFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Content Section */}
        {isLoading && !data && <LoadingState />}

        {data && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <OrderClientTable data={data.items} isLoading={isLoading} />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <OrderClientCards data={data.items} />
            </div>

            {/* Pagination */}
            <Card className="shadow-sm py-0">
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

        {/* Empty State */}
        {data && data.items.length === 0 && <EmptyOrdersState />}
      </div>
    </div>
  );
}

// Enhanced Header Component
function EnhancedOrderHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <PageHeader
        title="Mis Pedidos"
        subtitle="Consulta el historial y estado de tus pedidos"
        variant="gradient"
        icon={Package}
        className="mb-0"
      />

      <div className="flex items-center gap-3">
        <Link href="/dashboard/cli-tienda/productos">
          <Button variant="outline" className="gap-2">
            <Store className="h-4 w-4" />
            Seguir comprando
          </Button>
        </Link>

        <Link href="/dashboard/cli-tienda/carrito">
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Mi Carrito
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Cargando pedidos</h3>
        <p className="text-sm text-muted-foreground">
          Estamos buscando tu historial de compras...
        </p>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyOrdersState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">Aún no tienes pedidos</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Cuando realices tu primera compra, tus pedidos aparecerán aquí para
          que puedas hacer seguimiento.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/dashboard/cli-tienda/productos">
            <Button className="gap-2">
              <Store className="h-4 w-4" />
              Explorar productos
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
