"use server";
import { api } from "@/features/shared/services/api";
import { PersonalInfoRequest } from "../types/requests-profile.types";

export async function updatePersonalInfoAction(data: PersonalInfoRequest) {
  try {
    await api.put("/api/user/profile/personal-info", data);
    return {
      success: true,
      message: "Información de contacto actualizada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar información de contacto",
      errors: error,
    };
  }
}
