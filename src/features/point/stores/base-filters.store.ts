import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface BaseFilters {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface BaseFiltersStore<T extends BaseFilters = BaseFilters> {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  setFilters: (filters: Partial<T>) => void;
  resetFilters: () => void;
}

const createInitialFilters = <T extends BaseFilters>(
  overrides?: Partial<T>,
): T =>
  ({
    page: 1,
    limit: 10,
    ...overrides,
  } as T);

export function createFiltersStore<T extends BaseFilters = BaseFilters>(
  storeName: string,
  initialFiltersOverrides?: Partial<T>,
) {
  const initialFilters = createInitialFilters<T>(initialFiltersOverrides);

  return create<BaseFiltersStore<T>>()(
    devtools(
      (set, get) => ({
        filters: initialFilters,
        setFilter: (key, value) => {
          set(
            (state) => ({
              filters: {
                ...state.filters,
                [key]: value,
              },
            }),
            false,
            `${storeName}-setFilter-${String(key)}`,
          );
        },
        setFilters: (newFilters) => {
          set(
            (state) => ({
              filters: {
                ...state.filters,
                ...newFilters,
              },
            }),
            false,
            `${storeName}-setFilters`,
          );
        },
        resetFilters: () => {
          set({ filters: initialFilters }, false, `${storeName}-resetFilters`);
        },
      }),
      {
        name: `${storeName}-filters-store`,
      },
    ),
  );
}
