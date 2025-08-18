'use server';

import { api } from '@/features/shared/services/api';
import { ReconsumtionResult } from '../types/reconsumption.type';

export async function reconsumtionAction(formData: FormData) {
  try {
    const response = await api.post<ReconsumtionResult>(
      '/api/membership/reconsumption',
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      },
    );
    return {
      success: true,
      message: 'Reconsumo procesado exitosamente',
      data: response,
    };
  } catch (error) {
    console.error('Error al reconsumir el plan:', error);

    // Handle different types of errors
    let errorMessage = 'Error al procesar la reconsumción';
    let errorDetails = 'Error desconocido';

    if (error instanceof Error) {
      errorDetails = error.message;

      // Try to parse JSON error response
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
        // If it's not JSON, use the message as is
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
