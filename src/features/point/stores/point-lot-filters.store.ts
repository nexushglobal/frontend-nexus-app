'use client';

import { createFiltersStore, type BaseFilters } from './base-filters.store';

export interface PointLotFilters extends BaseFilters {}

export const usePointLotFiltersStore =
  createFiltersStore<PointLotFilters>('point-lot');
