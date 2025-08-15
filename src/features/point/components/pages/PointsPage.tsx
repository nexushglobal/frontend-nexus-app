'use client';

import { getUserPointsAction } from '../../action/get-points.action';
import { useUserTransactions } from '../../hooks/usePointTransactions';
import { usePointFiltersStore } from '../../stores/point-filters.store';
import { PointSummaryCards } from '../shared/cards/PointSummaryCards';
import { PointTransactionsCards } from '../shared/cards/PointTransactionsCards';
import { PointFilters } from '../shared/filters/PointFilters';
import { BaseTransactionPage } from '../shared/layout/BaseTransactionPage';
import { PointTransactionsTable } from '../shared/tables/PointTransactionsTable';

interface PointsPageProps {
  initialPointsData: Awaited<ReturnType<typeof getUserPointsAction>>;
}

export function PointsPage({ initialPointsData }: PointsPageProps) {
  const filtersStore = usePointFiltersStore();

  return (
    <BaseTransactionPage
      title="Mis Puntos"
      subtitle="Consulta tu resumen de puntos y historial de transacciones"
      loadingMessage="Cargando historial de transacciones..."
      summaryData={initialPointsData.success ? initialPointsData.data : null}
      isLoading={false}
      error={null}
      isError={false}
      filtersStore={filtersStore}
      useTransactionsHook={useUserTransactions}
      SummaryCardsComponent={PointSummaryCards}
      FiltersComponent={PointFilters}
      TableComponent={PointTransactionsTable}
      MobileCardsComponent={PointTransactionsCards}
      showSummary={true}
      showFilters={true}
    />
  );
}
