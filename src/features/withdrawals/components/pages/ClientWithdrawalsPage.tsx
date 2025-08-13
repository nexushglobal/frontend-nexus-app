'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
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

  return (
    <div className="container">
      <PageHeader
        title="Mis Retiros"
        subtitle="Historial de solicitudes de retiro"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent>
            <WithdrawalsClientFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar los retiros:{' '}
              {error?.message || 'Error desconocido'}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && !data && (
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando retiros...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <div className="hidden md:block">
              <WithdrawalsClientTable
                data={data.items}
                isLoading={isLoading}
                onOpenSummary={handleOpenSummary}
              />
            </div>

            <div className="md:hidden">
              <WithdrawalsClientCards
                data={data.items}
                onOpenSummary={handleOpenSummary}
              />
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

      <WithdrawalClientSummaryModal
        open={open}
        onOpenChange={setOpen}
        withdrawal={selected}
      />
    </div>
  );
}
