import { api } from '@/features/shared/services/api';
import { MonthlyVolumeResponse } from '../types/monthly.types';

export class MonthlyService {
  static async getMonthlyVolumes(
    params?: { limit?: number; page?: number },
  ): Promise<MonthlyVolumeResponse> {
    return await api.get<MonthlyVolumeResponse>('/api/monthly-volume', {
      params: params,
    });
  }
}