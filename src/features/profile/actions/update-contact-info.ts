"use server";
import { api } from "@/features/shared/services/api";
import type {
  ContactInfoRequest,
  ProfileActionResponse,
} from "../types/profile.types";

export async function updateContactInfoAction(
  updateData: ContactInfoRequest
): Promise<ProfileActionResponse> {
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
