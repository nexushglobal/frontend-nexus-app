'use server';

import { api } from '@/features/shared/services/api';

export async function UpdateMembershipAction(data: {
  isPointLot?: boolean;
  useCard?: boolean;
  autoRenewal?: boolean;
}) {
  try {
    const response = await api.patch(
      '/api/membership-reconsumption/update-membership',
      data,
    );
    return {
      success: true,
      message: 'Suscripción actualizada exitosamente',
      data: response,
    };
  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    // Handle different types of errors
    let errorMessage = 'Error al procesar la suscripción';
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
