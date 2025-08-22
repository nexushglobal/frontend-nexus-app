'use client';

import { useQuery } from '@tanstack/react-query';
import { MonthlyService } from '../services/monthly.service';

export const useMonthlyVolumes = (
  params: Record<string, string | number | boolean | undefined | null> = {},
) => {
  return useQuery({
    queryKey: ['monthly-volumes', params],
    queryFn: () => MonthlyService.getMonthlyVolumes(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};