import { api } from '@/features/shared/services/api';
import {
  WeeklyVolumeHistoryResponse,
  WeeklyVolumeResponse,
} from '../types/weekly.types';

export class WeeklyService {
  static async getWeeklyVolumes(
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<WeeklyVolumeResponse> {
    return await api.get<WeeklyVolumeResponse>('/api/weekly-volume/volume', {
      params: params,
    });
  }

  static async getWeeklyVolumeHistory(
    id: number,
    params?: { limit?: number; page?: number },
  ): Promise<WeeklyVolumeHistoryResponse> {
    return await api.get<WeeklyVolumeHistoryResponse>(
      `/api/weekly-volume/volume-history/${id}`,
      {
        params: params,
      },
    );
  }
}
