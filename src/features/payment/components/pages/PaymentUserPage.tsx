'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  AlertCircle,
  CreditCard,
  Loader2,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useUserPayments } from '../../hooks/usePaymentsQuery';
import { usePaymentUserFiltersStore } from '../../stores/payment-filters.store';
import { PaymentUserCards } from '../user/PaymentUserCards';
import { PaymentUserFilters } from '../user/PaymentUserFilters';
import { PaymentUserTable } from '../user/PaymentUserTable';

export function PaymentUserPage() {
  const { filters, setFilter, setFilters } = usePaymentUserFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.paymentConfigId)
      params.paymentConfigId = Number(filters.paymentConfigId);
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useUserPayments(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  if (isError) {
    return (
      <div className="container space-y-6">
        <EnhancedPaymentHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar tus pagos: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      <EnhancedPaymentHeader />

      <div className="space-y-6">
        <Card className="shadow-sm py-0">
          <CardContent className="py-4">
            <PaymentUserFilters
              paymentConfigs={data?.meta?.activePaymentConfigs || []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {isLoading && !data && <LoadingState />}

        {data && (
          <>
            <div className="hidden md:block">
              <PaymentUserTable data={data.items} isLoading={isLoading} />
            </div>

            <div className="md:hidden">
              <PaymentUserCards data={data.items} />
            </div>

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

        {data && data.items.length === 0 && <EmptyPaymentsState />}
      </div>
    </div>
  );
}

function EnhancedPaymentHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <PageHeader
        title="Mis Pagos"
        subtitle="Consulta el historial de tus pagos realizados"
        variant="gradient"
        icon={CreditCard}
        className="mb-0"
      />

      <div className="flex items-center gap-3">
        <Link href="/dashboard/cli-tienda/productos">
          <Button variant="outline" className="gap-2">
            <Store className="h-4 w-4" />
            Explorar tienda
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
        <h3 className="text-lg font-semibold mb-2">
          Cargando historial de pagos
        </h3>
        <p className="text-sm text-muted-foreground">
          Estamos buscando tus transacciones...
        </p>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyPaymentsState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">
          No tienes pagos registrados
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Cuando realices pagos por membresías, pedidos o servicios, aparecerán
          aquí para tu seguimiento.
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
