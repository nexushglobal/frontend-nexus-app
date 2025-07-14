import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface TableFilters {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
  [key: string]: any; // Para filtros adicionales específicos de cada tabla
}

export interface TableFiltersState {
  filters: TableFilters;
  setFilter: (key: string, value: any) => void;
  setFilters: (filters: Partial<TableFilters>) => void;
  resetFilters: () => void;
  clearFilters: () => void;
}

const defaultFilters: TableFilters = {
  page: 1,
  limit: 20,
  sortBy: "createdAt",
  sortOrder: "DESC",
};

export const createTableFiltersStore = (
  key: string,
  initialFilters: Partial<TableFilters> = {}
) => {
  return create<TableFiltersState>()(
    devtools(
      (set, get) => ({
        filters: { ...defaultFilters, ...initialFilters },

        setFilter: (key: string, value: any) => {
          set(
            (state) => ({
              filters: {
                ...state.filters,
                [key]: value,
                // Reset page when changing filters (except when changing page itself)
                ...(key !== "page" ? { page: 1 } : {}),
              },
            }),
            false,
            `${key}/setFilter`
          );
        },

        setFilters: (newFilters: Partial<TableFilters>) => {
          set(
            (state) => ({
              filters: {
                ...state.filters,
                ...newFilters,
                // Reset page when changing multiple filters
                ...(!newFilters.page ? { page: 1 } : {}),
              },
            }),
            false,
            `${key}/setFilters`
          );
        },

        resetFilters: () => {
          set(
            { filters: { ...defaultFilters, ...initialFilters } },
            false,
            `${key}/resetFilters`
          );
        },

        clearFilters: () => {
          set({ filters: defaultFilters }, false, `${key}/clearFilters`);
        },
      }),
      { name: `table-filters-${key}` }
    )
  );
};
