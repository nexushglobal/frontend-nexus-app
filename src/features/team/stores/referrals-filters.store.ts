import { create } from 'zustand'

interface ReferralsFilters {
  page: number
  limit: number
  sortBy: 'volume' | 'lots'
  sortOrder: 'asc' | 'desc'
}

interface ReferralsFiltersStore {
  filters: ReferralsFilters
  setFilter: <K extends keyof ReferralsFilters>(key: K, value: ReferralsFilters[K]) => void
  setFilters: (filters: Partial<ReferralsFilters>) => void
  resetFilters: () => void
}

const defaultFilters: ReferralsFilters = {
  page: 1,
  limit: 10,
  sortBy: 'volume',
  sortOrder: 'desc',
}

export const useReferralsFiltersStore = create<ReferralsFiltersStore>((set, get) => ({
  filters: defaultFilters,
  
  setFilter: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }))
  },
  
  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }))
  },
  
  resetFilters: () => {
    set({ filters: defaultFilters })
  },
}))