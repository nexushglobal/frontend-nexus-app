"use server";

import { api } from "@/features/shared/services/api";
import { PaymentResult } from "../types/membership-detail.type";

export async function subscribeToPlanAction(formData: FormData) {
  try {
    console.log("Enviando datos de suscripción:", formData);
    const response = await api.get<PaymentResult>("/api/membership/subscribe", {
      body: formData,
      // contentType: "multipart/form-data",
      // skipJsonStringify: true,
    });

    return {
      success: true,
      message: "Suscripción exitosa. Detalles del plan actualizado.",
      data: response,
    };
  } catch (error) {
    console.error("Error al suscribirse al plan:", error);

    return {
      success: false,
      message: "Error al suscribirse al plan",
      errors: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
