"use server";
import { api } from "@/features/shared/services/api";
import { ApiError } from "@/features/shared/types/api.types";
import { redirect } from "next/navigation";
import { ResetPasswordResponse } from "../types/password-reset.type";

export async function resetPasswordAction(
  token: string,
  email: string,
  newPassword: string
) {
  if (!token || !email || !newPassword) {
    return {
      success: false,
      error: "Todos los campos son requeridos",
      errors: null,
    };
  }

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  if (!strongPasswordRegex.test(newPassword)) {
    return {
      success: false,
      error:
        "Contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo",
      errors: null,
    };
  }

  try {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/password-reset/reset",
      {
        token,
        email,
        newPassword,
      }
    );

    redirect("/dashboard");
    return {
      success: true,
      message: response.message || "Contraseña restablecida correctamente",
      error: null,
      errors: null,
    };
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        errors: error.errors,
      };
    }

    return {
      success: false,
      error: "Error actualizando contraseña",
      errors: null,
    };
  }
}
