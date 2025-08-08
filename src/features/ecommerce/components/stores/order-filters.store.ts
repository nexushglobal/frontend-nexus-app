import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface OrderFilters extends TableFilters {
  status?: 'PENDING' | 'APPROVED' | 'SENT' | 'REJECTED';
  startDate?: string;
  endDate?: string;
  term?: string; // Buscar por usuario
}

const initialOrderFilters: Partial<OrderFilters> = {
  limit: 20,
};

// Store para filtros de órdenes de admin
export const useOrderAdminFiltersStore = createTableFiltersStore(
  'order-admin',
  initialOrderFilters,
);
