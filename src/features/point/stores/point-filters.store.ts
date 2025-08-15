'use client';

import { createFiltersStore, type BaseFilters } from './base-filters.store';

export interface PointFilters extends BaseFilters {}

export const usePointFiltersStore = createFiltersStore<PointFilters>('point');
