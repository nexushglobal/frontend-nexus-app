'use client';

import {
  TRANSACTION_STATUS_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/features/point/constants';
import { usePointFiltersStore } from '@/features/point/stores/point-filters.store';
import { BaseFilters } from './BaseFilters';

interface PointFiltersProps {
  isLoading?: boolean;
}

export function PointFilters({ isLoading }: PointFiltersProps) {
  const store = usePointFiltersStore();

  return (
    <BaseFilters
      isLoading={isLoading}
      store={store}
      typeOptions={TRANSACTION_TYPE_OPTIONS}
      statusOptions={TRANSACTION_STATUS_OPTIONS}
      showTypeFilter={true}
      showStatusFilter={true}
      showDateFilter={true}
    />
  );
}
