'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2, Shield, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminWithdrawals } from '../../hooks/useWithdrawalsAdminQuery';
import { useWithdrawalsAdminFiltersStore } from '../../stores/withdrawals-admin-filters.store';
import { WithdrawalAdmin } from '../../types/withdrawals.types';
import { WithdrawalsAdminCards } from '../admin/WithdrawalsAdminCards';
import { WithdrawalsAdminFilters } from '../admin/WithdrawalsAdminFilters';
import { WithdrawalsAdminTable } from '../admin/WithdrawalsAdminTable';
import { WithdrawalSummaryModal } from '../admin/WithdrawalSummaryModal';

export default function AdminWithdrawalsPage() {
  const { filters, setFilter, setFilters } = useWithdrawalsAdminFiltersStore();
  const [selected, setSelected] = useState<WithdrawalAdmin | null>(null);
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

  const { data, isLoading, error, isError } = useAdminWithdrawals(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleOpenSummary = (w: WithdrawalAdmin) => {
    setSelected(w);
    setOpen(true);
  };

  if (isError) {
    return (
      <div className="container space-y-6">
        <div className="relative overflow-hidden">
          <Alert
            variant="destructive"
            className="border-l-4 border-l-destructive shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <AlertDescription className="font-medium">
                  Error al cargar los retiros
                </AlertDescription>
                <p className="text-sm text-muted-foreground">
                  {error?.message || 'Ha ocurrido un error inesperado'}
                </p>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestión de Retiros
              </h1>
              <p className="text-sm text-muted-foreground">
                Administra y supervisa las solicitudes de retiro de usuarios
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Filters Section */}
        <Card className="border shadow-sm py-0">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Filtros y búsqueda
              </h3>
            </div>
            <WithdrawalsAdminFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Content Section */}
        <div className="space-y-6">
          {isLoading && !data && <LoadingState />}

          {data && (
            <div className="space-y-6">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <WithdrawalsAdminTable
                  data={data.items}
                  isLoading={isLoading}
                  onOpenSummary={handleOpenSummary}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                <WithdrawalsAdminCards
                  data={data.items}
                  onOpenSummary={handleOpenSummary}
                />
              </div>

              {/* Pagination */}
              <Card className="border shadow-sm py-0">
                <CardContent className="p-0">
                  <TablePagination
                    pagination={data.pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {data && data.items.length === 0 && <EmptyWithdrawalsState />}
        </div>
      </div>

      {/* Modal */}
      <WithdrawalSummaryModal
        open={open}
        onOpenChange={setOpen}
        withdrawal={selected}
      />
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary border border-primary/20">
          <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
        </div>
        <div className="mt-6 text-center space-y-3">
          <h3 className="text-xl font-bold text-foreground">
            Cargando retiros
          </h3>
          <p className="text-base text-muted-foreground max-w-md">
            Estamos buscando el historial de retiros y validando la
            información...
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="mt-8 w-full max-w-2xl space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-muted/30 animate-pulse"
            >
              <div className="h-4 w-4 bg-muted/60 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/60 rounded-md w-3/4"></div>
                <div className="h-3 bg-muted/60 rounded-md w-1/2"></div>
              </div>
              <div className="h-8 w-20 bg-muted/60 rounded-md"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyWithdrawalsState() {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted/50 border-2 border-muted/80">
            <TrendingUp className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <h3 className="text-2xl font-bold text-foreground">
            No hay retiros que mostrar
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            No se encontraron solicitudes de retiro con los filtros aplicados.
            Ajusta los criterios de búsqueda o espera a que lleguen nuevas
            solicitudes.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>
              Las nuevas solicitudes de retiro aparecerán automáticamente aquí
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
