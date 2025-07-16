"use server";

import { api } from "@/features/shared/services/api";
import { PaymentResult } from "../types/membership-detail.type";

export async function subscribeToPlanAction(formData: FormData) {
  try {
    console.log(
      "Enviando datos de suscripción:",
      Object.fromEntries(formData.entries())
    );

    const response = await api.post<PaymentResult>(
      "/api/membership/subscribe",
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      }
    );

    return {
      success: true,
      message: "Suscripción procesada exitosamente",
      data: response,
    };
  } catch (error) {
    console.error("Error al suscribirse al plan:", error);

    // Handle different types of errors
    let errorMessage = "Error al procesar la suscripción";
    let errorDetails = "Error desconocido";

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
            ? errorData.errors.join(", ")
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
