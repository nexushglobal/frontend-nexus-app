'use client';

import {
  LOT_TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
} from '@/features/point/constants';
import { usePointLotFiltersStore } from '@/features/point/stores/point-lot-filters.store';
import { BaseFilters } from './BaseFilters';

interface PointLotFiltersProps {
  isLoading?: boolean;
}

export function PointLotFilters({ isLoading }: PointLotFiltersProps) {
  const store = usePointLotFiltersStore();

  return (
    <BaseFilters
      isLoading={isLoading}
      store={store}
      typeOptions={LOT_TRANSACTION_TYPE_OPTIONS}
      statusOptions={TRANSACTION_STATUS_OPTIONS}
      showTypeFilter={true}
      showStatusFilter={true}
      showDateFilter={true}
    />
  );
}
