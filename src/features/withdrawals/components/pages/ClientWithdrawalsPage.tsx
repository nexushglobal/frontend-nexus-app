'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  AlertCircle,
  Banknote,
  Loader2,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useClientWithdrawals } from '../../hooks/useWithdrawalsClientQuery';
import { useWithdrawalsClientFiltersStore } from '../../stores/withdrawals-client-filters.store';
import { WithdrawalClient } from '../../types/withdrawals.types';
import { WithdrawalClientSummaryModal } from '../client/WithdrawalClientSummaryModal';
import { WithdrawalsClientCards } from '../client/WithdrawalsClientCards';
import { WithdrawalsClientFilters } from '../client/WithdrawalsClientFilters';
import { WithdrawalsClientTable } from '../client/WithdrawalsClientTable';

export default function ClientWithdrawalsPage() {
  const { filters, setFilter, setFilters } = useWithdrawalsClientFiltersStore();
  const [selected, setSelected] = useState<WithdrawalClient | null>(null);
  const [open, setOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useClientWithdrawals(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleOpenSummary = (w: WithdrawalClient) => {
    setSelected(w);
    setOpen(true);
  };

  if (isError) {
    return (
      <div className="container space-y-6">
        <EnhancedWithdrawalHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los retiros: {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      <EnhancedWithdrawalHeader />

      <div className="space-y-6">
        {/* Filters Section */}
        <Card className="shadow-sm py-0">
          <CardContent className="py-4">
            <WithdrawalsClientFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Content Section */}
        {isLoading && !data && <LoadingState />}

        {data && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block ">
              <WithdrawalsClientTable
                data={data.items}
                isLoading={isLoading}
                onOpenSummary={handleOpenSummary}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <WithdrawalsClientCards
                data={data.items}
                onOpenSummary={handleOpenSummary}
              />
            </div>

            {/* Pagination */}
            <Card className="shadow-sm py-0">
              <TablePagination
                pagination={data.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                isLoading={isLoading}
              />
            </Card>
          </>
        )}

        {/* Empty State */}
        {data && data.items.length === 0 && <EmptyWithdrawalsState />}
      </div>

      <WithdrawalClientSummaryModal
        open={open}
        onOpenChange={setOpen}
        withdrawal={selected}
      />
    </div>
  );
}

// Enhanced Header Component
function EnhancedWithdrawalHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <PageHeader
        title="Mis Retiros"
        subtitle="Historial de solicitudes de retiro"
        variant="gradient"
        icon={Banknote}
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
        <h3 className="text-lg font-semibold mb-2">Cargando retiros</h3>
        <p className="text-sm text-muted-foreground">
          Estamos buscando tu historial de retiros...
        </p>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyWithdrawalsState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Banknote className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">
          No tienes retiros registrados
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Cuando solicites retiros de tus comisiones, aparecerán aquí para hacer
          seguimiento.
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
