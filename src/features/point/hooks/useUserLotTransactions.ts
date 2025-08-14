'use client';

import { useQuery } from '@tanstack/react-query';
import { PointService } from '../services/point.service';
import type { PointLotTransactionListResponse } from '../types/points.types';

export function useUserLotTransactions(
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<PointLotTransactionListResponse>({
    queryKey: ['user-lot-transactions', params],
    queryFn: () => PointService.getUserLotTransactions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    enabled: !!params, // Solo ejecutar si hay parámetros
  });
}
