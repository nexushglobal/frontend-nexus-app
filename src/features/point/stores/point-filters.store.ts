'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PointFilters {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface PointFiltersStore {
  filters: PointFilters;
  setFilter: <K extends keyof PointFilters>(
    key: K,
    value: PointFilters[K],
  ) => void;
  setFilters: (filters: Partial<PointFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: PointFilters = {
  page: 1,
  limit: 10,
};

export const usePointFiltersStore = create<PointFiltersStore>()(
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
      name: 'point-filters-store',
    },
  ),
);
