import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface OrderClientFilters extends TableFilters {
  status?:
    | 'PENDING'
    | 'APPROVED'
    | 'SENT'
    | 'REJECTED'
    | 'DELIVERED'
    | 'CANCELED';
  startDate?: string;
  endDate?: string;
  term?: string; // búsqueda libre
}

const initialOrderClientFilters: Partial<OrderClientFilters> = {
  limit: 20,
};

export const useOrderClientFiltersStore = createTableFiltersStore(
  'order-client',
  initialOrderClientFilters,
);
