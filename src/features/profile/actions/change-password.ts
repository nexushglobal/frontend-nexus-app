"use server";

import { api } from "@/features/shared/services/api";
import type {
  ChangePasswordRequest,
  ProfileActionResponse,
} from "../types/profile.types";

export async function ChangePasswordAction(
  updateData: ChangePasswordRequest
): Promise<ProfileActionResponse> {
  try {
    await api.post("/api/profile/change-password", updateData);

    return {
      success: true,
      message: "Información bancaria actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error updating bank info:", error);
    return {
      success: false,
      message: "Error al actualizar información bancaria",
      errors: error,
    };
  }
}
