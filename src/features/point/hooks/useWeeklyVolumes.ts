'use client';

import { useQuery } from '@tanstack/react-query';
import { WeeklyService } from '../services/weekly.service';

export const useWeeklyVolumes = (
  params: Record<string, string | number | boolean | undefined | null> = {},
) => {
  return useQuery({
    queryKey: ['weekly-volumes', params],
    queryFn: () => WeeklyService.getWeeklyVolumes(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};
