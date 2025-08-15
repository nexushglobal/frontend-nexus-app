'use client';

import { useQuery } from '@tanstack/react-query';
import { WeeklyService } from '../services/weekly.service';

export const useWeeklyVolumeHistory = (
  id: number,
  params: { limit?: number; page?: number } = {},
) => {
  return useQuery({
    queryKey: ['weekly-volume-history', id, params],
    queryFn: () => WeeklyService.getWeeklyVolumeHistory(id, params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    enabled: !!id,
  });
};
