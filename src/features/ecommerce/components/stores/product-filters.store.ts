import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface ProductFilters extends TableFilters {
  name?: string;
  categoryId?: string;
  isActive?: boolean;
}

const initialProductFilters: Partial<ProductFilters> = {
  limit: 20,
};

// Store para filtros de productos de admin
export const useProductAdminFiltersStore = createTableFiltersStore(
  'product-admin',
  initialProductFilters,
);
