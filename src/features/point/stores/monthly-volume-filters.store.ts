import { createFiltersStore, type BaseFilters } from './base-filters.store';

export interface MonthlyVolumeFilters extends Omit<BaseFilters, 'type'> {}

export const useMonthlyVolumeFiltersStore =
  createFiltersStore<MonthlyVolumeFilters>('monthly-volume');