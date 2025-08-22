import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface LeadsFilters extends TableFilters {
  startDate?: string;
  endDate?: string;
}

const initialLeadsFilters: Partial<LeadsFilters> = {
  limit: 10,
};

export const useLeadsFiltersStore = createTableFiltersStore(
  'leads',
  initialLeadsFilters,
);