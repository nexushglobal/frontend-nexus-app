'use server';

import { api } from '@/features/shared/services/api';

export async function uploadPhotoAction(formData: FormData) {
  try {
    await api.put('/api/user/profile/photo', formData, {
      isFormData: true,
      skipJsonStringify: true,
    });

    return {
      success: true,
      message: 'Foto de perfil actualizada exitosamente',
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return {
      success: false,
      message: 'Error al subir la foto',
      errors: error,
    };
  }
}
