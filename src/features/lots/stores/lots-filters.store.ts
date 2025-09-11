'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LotsFiltersState {
  // Filters
  page: number;
  limit: number;
  term?: string;
  stageId?: string;
  blockId?: string;
  
  // Actions
  setFilter: (key: keyof Omit<LotsFiltersState, 'setFilter' | 'setFilters' | 'resetFilters'>, value: string | number | undefined) => void;
  setFilters: (filters: Partial<Omit<LotsFiltersState, 'setFilter' | 'setFilters' | 'resetFilters'>>) => void;
  resetFilters: () => void;
}

const initialState = {
  page: 1,
  limit: 10,
  term: undefined,
  stageId: undefined,
  blockId: undefined,
};

export const useLotsFiltersStore = create<LotsFiltersState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setFilter: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
          ...(key !== 'page' && { page: 1 }), // Reset page when other filters change
        })),
        
      setFilters: (filters) =>
        set((state) => ({
          ...state,
          ...filters,
        })),
        
      resetFilters: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'lots-filters',
      partialize: (state) => ({
        limit: state.limit,
      }),
    }
  )
);