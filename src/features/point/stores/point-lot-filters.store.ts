'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointLotFilters {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface PointLotFiltersStore {
  filters: PointLotFilters;
  setFilter: <K extends keyof PointLotFilters>(
    key: K,
    value: PointLotFilters[K],
  ) => void;
  setFilters: (filters: Partial<PointLotFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: PointLotFilters = {
  page: 1,
  limit: 10,
};

export const usePointLotFiltersStore = create<PointLotFiltersStore>()(
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
          `setFilter-${key}`,
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
          'setFilters',
        );
      },
      resetFilters: () => {
        set({ filters: initialFilters }, false, 'resetFilters');
      },
    }),
    {
      name: 'point-lot-filters-store',
    },
  ),
);
