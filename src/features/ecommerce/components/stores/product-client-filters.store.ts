import {
  createTableFiltersStore,
  type TableFilters,
} from '@/features/shared/stores/table-filters.store';

export interface ProductClientFilters extends TableFilters {
  name?: string;
  categoryId?: number;
}

const initialProductClientFilters: Partial<ProductClientFilters> = {
  limit: 20,
};

export const useProductClientFiltersStore = createTableFiltersStore(
  'product-client',
  initialProductClientFilters,
);
