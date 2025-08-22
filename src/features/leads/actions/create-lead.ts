'use server';

import { api } from '@/features/shared/services/api';
import { CreateLeadRequest, Lead } from '../types/leads.types';

export async function createLead(data: CreateLeadRequest) {
  try {
    const response = await api.post<Lead>('/api/leads', data);

    return {
      success: true,
      message: 'Lead creado exitosamente',
      data: response,
    };
  } catch (error) {
    console.error('Error creating lead:', error);

    let errorMessage = 'Error al crear el lead';
    let errorDetails = 'Error desconocido';

    if (error instanceof Error) {
      errorDetails = error.message;

      try {
        const errorData = JSON.parse(error.message);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.errors) {
          errorDetails = Array.isArray(errorData.errors)
            ? errorData.errors.join(', ')
            : errorData.errors;
        }
      } catch {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      message: errorMessage,
      errors: errorDetails,
      data: null,
    };
  }
}
