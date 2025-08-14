import { create } from 'zustand';

interface WeeklyVolumeFilters {
  page: number;
  limit: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface WeeklyVolumeFiltersStore {
  filters: WeeklyVolumeFilters;
  setFilter: <K extends keyof WeeklyVolumeFilters>(
    key: K,
    value: WeeklyVolumeFilters[K],
  ) => void;
  setFilters: (filters: Partial<WeeklyVolumeFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: WeeklyVolumeFilters = {
  page: 1,
  limit: 10,
};

export const useWeeklyVolumeFiltersStore = create<WeeklyVolumeFiltersStore>(
  (set) => ({
    filters: initialFilters,
    setFilter: (key, value) =>
      set((state) => ({
        filters: { ...state.filters, [key]: value },
      })),
    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),
    resetFilters: () => set({ filters: initialFilters }),
  }),
);
