import { create } from 'zustand';
import { GetComplaintsParams } from '../types/complaint.types';

interface ComplaintFiltersState {
  filters: GetComplaintsParams;
  setFilter: <K extends keyof GetComplaintsParams>(key: K, value: GetComplaintsParams[K]) => void;
  setFilters: (filters: Partial<GetComplaintsParams>) => void;
  resetFilters: () => void;
}

const defaultFilters: GetComplaintsParams = {
  page: 1,
  limit: 20,
  attended: undefined,
  startDate: undefined,
};

export const useComplaintFiltersStore = create<ComplaintFiltersState>((set) => ({
  filters: defaultFilters,
  
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  resetFilters: () =>
    set({ filters: defaultFilters }),
}));