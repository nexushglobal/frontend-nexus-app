import { create } from 'zustand';
import { ComplaintFilters } from '../types/complaints.types';

interface ComplaintsFiltersState {
  filters: ComplaintFilters;
  setFilter: <K extends keyof ComplaintFilters>(
    key: K,
    value: ComplaintFilters[K]
  ) => void;
  setFilters: (filters: Partial<ComplaintFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ComplaintFilters = {
  page: 1,
  limit: 20,
  startDate: undefined,
  endDate: undefined,
  attended: undefined,
};

export const useComplaintsFiltersStore = create<ComplaintsFiltersState>()(
  (set) => ({
    filters: defaultFilters,
    setFilter: (key, value) =>
      set((state) => ({
        filters: {
          ...state.filters,
          [key]: value,
        },
      })),
    setFilters: (newFilters) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...newFilters,
        },
      })),
    resetFilters: () =>
      set({
        filters: defaultFilters,
      }),
  })
);