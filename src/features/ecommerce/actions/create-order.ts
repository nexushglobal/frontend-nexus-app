'use server';

import { api } from '@/features/shared/services/api';
import { OrderResult } from '../types/order.type';

export async function createOrderAction(formData: FormData) {
  try {
    const response = await api.post<OrderResult>(
      '/api/ecommerce/order',
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      },
    );
    return {
      success: true,
      message: 'Pedido procesado exitosamente',
      data: response,
    };
  } catch (error) {
    console.error('Error al crear el pedido:', error);

    // Handle different types of errors
    let errorMessage = 'Error al procesar el pedido';
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
