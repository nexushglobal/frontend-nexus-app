import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface WithdrawalsClientFilters extends TableFilters {
  status?: 'APPROVED' | 'REJECTED' | 'PENDING';
  startDate?: string;
  endDate?: string;
  name?: string;
  email?: string;
}

const initialFilters: Partial<WithdrawalsClientFilters> = {
  limit: 20,
};

export const useWithdrawalsClientFiltersStore = createTableFiltersStore(
  'withdrawals-client',
  initialFilters,
);
