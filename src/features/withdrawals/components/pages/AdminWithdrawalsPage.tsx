'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminWithdrawals } from '../../hooks/useWithdrawalsAdminQuery';
import { useWithdrawalsAdminFiltersStore } from '../../stores/withdrawals-admin-filters.store';
import { Withdrawal } from '../../types/withdrawals.types';
import { WithdrawalsAdminCards } from '../admin/WithdrawalsAdminCards';
import { WithdrawalsAdminTable } from '../admin/WithdrawalsAdminTable';
import { WithdrawalSummaryModal } from '../admin/WithdrawalSummaryModal';

export default function AdminWithdrawalsPage() {
  const { filters, setFilter, setFilters } = useWithdrawalsAdminFiltersStore();
  const [selected, setSelected] = useState<Withdrawal | null>(null);
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

  const handleOpenSummary = (w: Withdrawal) => {
    setSelected(w);
    setOpen(true);
  };

  return (
    <div className="container">
      <PageHeader
        title="Retiros"
        subtitle="Listado de solicitudes de retiro"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        {/* Filters to be added later if needed */}

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
              <WithdrawalsAdminTable
                data={data.items}
                isLoading={isLoading}
                onOpenSummary={handleOpenSummary}
              />
            </div>

            <div className="md:hidden">
              <WithdrawalsAdminCards
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

      <WithdrawalSummaryModal
        open={open}
        onOpenChange={setOpen}
        withdrawal={selected}
      />
    </div>
  );
}
