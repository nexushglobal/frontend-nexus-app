import { createFiltersStore, type BaseFilters } from './base-filters.store';

export interface WeeklyVolumeFilters extends Omit<BaseFilters, 'type'> {}

export const useWeeklyVolumeFiltersStore =
  createFiltersStore<WeeklyVolumeFilters>('weekly-volume');
