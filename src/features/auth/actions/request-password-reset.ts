'use server';
import { api } from '@/features/shared/services/api';
import { ApiError } from '@/features/shared/types/api.types';
import { RequestPasswordResetResponse } from '../types/password-reset.type';

export async function requestPasswordResetAction(email: string) {
  if (!email?.trim()) {
    return { success: false, error: 'Email es requerido' };
  }

  if (!email.includes('@')) {
    return { success: false, error: 'Email debe ser válido' };
  }

  try {
    const response = await api.post<RequestPasswordResetResponse>(
      '/api/auth/password-reset/request',
      { email },
    );

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    console.error('Request password reset error:', error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        errors: error.errors,
      };
    }

    return {
      success: false,
      error: 'Error interno. Intenta más tarde.',
      errors: null,
    };
  }
}
