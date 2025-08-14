import { api } from '@/features/shared/services/api';
import { WeeklyVolumeResponse } from '../types/weekly.types';

export class WeeklyService {
  static async getWeeklyVolumes(
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<WeeklyVolumeResponse> {
    return await api.get<WeeklyVolumeResponse>('/api/weekly-volume/volume', {
      params: params,
    });
  }
}
