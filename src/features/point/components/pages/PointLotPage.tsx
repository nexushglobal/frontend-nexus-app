'use client';

import { getUserPointsLotAction } from '../../action/get-points.action';
import { useUserLotTransactions } from '../../hooks/useUserLotTransactions';
import { usePointLotFiltersStore } from '../../stores/point-lot-filters.store';
import { PointLotSummaryCards } from '../shared/cards/PointLotSummaryCards';
import { PointLotTransactionsCards } from '../shared/cards/PointLotTransactionsCards';
import { PointLotFilters } from '../shared/filters/PointLotFilters';
import { BaseTransactionPage } from '../shared/layout/BaseTransactionPage';
import { PointLotTransactionsTable } from '../shared/tables/PointLotTransactionsTable';

interface PointLotPageProps {
  initialPointsLotData: Awaited<ReturnType<typeof getUserPointsLotAction>>;
}

export function PointLotPage({ initialPointsLotData }: PointLotPageProps) {
  const filtersStore = usePointLotFiltersStore();

  return (
    <BaseTransactionPage
      title="Puntos Lote"
      subtitle="Consulta tu resumen de puntos de lote y historial de transacciones"
      loadingMessage="Cargando historial de transacciones de lote..."
      summaryData={
        initialPointsLotData.success ? initialPointsLotData.data : null
      }
      isLoading={false}
      error={null}
      isError={false}
      filtersStore={filtersStore}
      useTransactionsHook={useUserLotTransactions}
      SummaryCardsComponent={PointLotSummaryCards}
      FiltersComponent={PointLotFilters}
      TableComponent={PointLotTransactionsTable}
      MobileCardsComponent={PointLotTransactionsCards}
      showSummary={true}
      showFilters={true}
    />
  );
}
