'use server';

import { api } from '@/features/shared/services/api';
import type { ProfileData } from '../types/profile.types';

export async function getProfileAction() {
  try {
    const profile = await api.get<ProfileData>('/api/user/profile');

    return {
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: profile,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      message: 'Error al obtener el perfil',
      errors: error,
    };
  }
}
