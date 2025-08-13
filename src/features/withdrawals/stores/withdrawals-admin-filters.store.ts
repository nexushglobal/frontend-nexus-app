import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface WithdrawalsAdminFilters extends TableFilters {
  status?: 'APPROVED' | 'REJECTED' | 'PENDING';
  startDate?: string;
  endDate?: string;
  name?: string;
  email?: string;
}

const initialFilters: Partial<WithdrawalsAdminFilters> = {
  limit: 20,
};

export const useWithdrawalsAdminFiltersStore = createTableFiltersStore(
  'withdrawals-admin',
  initialFilters,
);
