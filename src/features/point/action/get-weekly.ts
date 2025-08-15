'use server';

import { api } from '@/features/shared/services/api';
import { WeeklyVolume } from '../types/weekly.types';

export async function getWeeklyVolumeAction(id: number) {
  try {
    const response = await api.get<WeeklyVolume>(
      `/api/weekly-volume/volume/${id}`,
      {
        cache: 'no-store',
      },
    );

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener las categorías',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}
