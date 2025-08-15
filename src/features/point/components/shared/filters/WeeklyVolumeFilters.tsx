'use client';

import { VOLUME_STATUS_OPTIONS } from '@/features/point/constants';
import { useWeeklyVolumeFiltersStore } from '@/features/point/stores/weekly-volume-filters.store';
import { BaseFilters } from './BaseFilters';

interface WeeklyVolumeFiltersProps {
  isLoading?: boolean;
}

export function WeeklyVolumeFilters({ isLoading }: WeeklyVolumeFiltersProps) {
  const store = useWeeklyVolumeFiltersStore();

  return (
    <BaseFilters
      isLoading={isLoading}
      store={store}
      statusOptions={VOLUME_STATUS_OPTIONS}
      showTypeFilter={false}
      showStatusFilter={true}
      showDateFilter={true}
    />
  );
}
