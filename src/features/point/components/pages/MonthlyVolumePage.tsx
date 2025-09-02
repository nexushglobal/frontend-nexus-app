'use client';

import { useMonthlyVolumes } from '../../hooks/useMonthlyVolumes';
import { useMonthlyVolumeFiltersStore } from '../../stores/monthly-volume-filters.store';
import { MonthlyVolumeCards } from '../shared/cards/MonthlyVolumeCards';
import { MonthlyVolumeFilters } from '../shared/filters/MonthlyVolumeFilters';
import { BaseTransactionPage } from '../shared/layout/BaseTransactionPage';
import { MonthlyVolumeTable } from '../shared/tables/MonthlyVolumeTable';

export function MonthlyVolumePage() {
  const filtersStore = useMonthlyVolumeFiltersStore();

  return (
    <BaseTransactionPage
      title="Volúmenes Mensuales"
      subtitle="Consulta tus volúmenes mensuales de puntos y rangos asignados"
      loadingMessage="Cargando volúmenes mensuales..."
      isLoading={false}
      error={null}
      isError={false}
      filtersStore={filtersStore}
      useTransactionsHook={useMonthlyVolumes}
      FiltersComponent={MonthlyVolumeFilters}
      TableComponent={MonthlyVolumeTable}
      MobileCardsComponent={MonthlyVolumeCards}
      showSummary={false}
      showFilters={true}
    />
  );
}
