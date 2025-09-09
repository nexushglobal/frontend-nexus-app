'use server';

import { api } from '@/features/shared/services/api';
import { ChangePasswordRequest } from '../types/requests-profile.types';

export async function ChangePasswordAction(updateData: ChangePasswordRequest) {
  try {
    await api.put('/api/user/profile/change-password', updateData);

    return {
      success: true,
      message: 'Información de perfil actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error updating profile info:', error);
    return {
      success: false,
      message: 'Error al actualizar información de perfil',
      errors: error,
    };
  }
}
