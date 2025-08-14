'use server';

import { api } from '@/features/shared/services/api';
import { PointLotUserResponse, PointUserResponse } from '../types/points.types';

export async function getUserPointsAction() {
  try {
    const response = await api.get<PointUserResponse>(
      '/api/point/user-points',
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

export async function getUserPointsLotAction() {
  try {
    const response = await api.get<PointLotUserResponse>(
      '/api/point/user-lots-points',
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
