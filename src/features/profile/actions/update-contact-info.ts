"use server";
import { api } from "@/features/shared/services/api";
import { ContactInfoRequest } from "../types/requests-profile.types";

export async function updateContactInfoAction(updateData: ContactInfoRequest) {
  try {
    await api.put("/api/user/profile/contact-info", updateData);

    return {
      success: true,
      message: "Información de contacto actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return {
      success: false,
      message: "Error al actualizar información de contacto",
      errors: error,
    };
  }
}
