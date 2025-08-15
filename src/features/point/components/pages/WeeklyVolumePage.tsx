'use client';

import { useWeeklyVolumes } from '../../hooks/useWeeklyVolumes';
import { useWeeklyVolumeFiltersStore } from '../../stores/weekly-volume-filters.store';
import { WeeklyVolumeCards } from '../shared/cards/WeeklyVolumeCards';
import { WeeklyVolumeFilters } from '../shared/filters/WeeklyVolumeFilters';
import { BaseTransactionPage } from '../shared/layout/BaseTransactionPage';
import { WeeklyVolumeTable } from '../shared/tables/WeeklyVolumeTable';

export function WeeklyVolumePage() {
  const filtersStore = useWeeklyVolumeFiltersStore();

  return (
    <BaseTransactionPage
      title="Volúmenes Semanales"
      subtitle="Consulta tus volúmenes semanales de puntos y comisiones ganadas"
      loadingMessage="Cargando volúmenes semanales..."
      isLoading={false}
      error={null}
      isError={false}
      filtersStore={filtersStore}
      useTransactionsHook={useWeeklyVolumes}
      FiltersComponent={WeeklyVolumeFilters}
      TableComponent={WeeklyVolumeTable}
      MobileCardsComponent={WeeklyVolumeCards}
      showSummary={false}
      showFilters={true}
    />
  );
}
