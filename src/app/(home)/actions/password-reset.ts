"use server";

import { httpClient } from "@/lib/api/http-client";
import { ActionResponse } from "@/types/user.types";

interface PasswordResetRequestData {
  message?: string;
}

interface PasswordResetValidateData {
  isValid: boolean;
  message?: string;
}

interface PasswordResetResetData {
  message?: string;
}

export async function requestPasswordReset(
  email: string
): Promise<ActionResponse<PasswordResetRequestData>> {
  try {
    const apiResponse = await httpClient<PasswordResetRequestData>(
      "/api/auth/password-reset/request",
      {
        method: "POST",
        body: { email },
      }
    );

    return {
      success: apiResponse.success,
      message:
        apiResponse.message ||
        (apiResponse.success
          ? "Código enviado correctamente"
          : "Error al solicitar el restablecimiento"),
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error requesting password reset:", error);
    return {
      success: false,
      message: "Error de conexión. Intenta nuevamente.",
      data: null,
      errors: error,
    };
  }
}

export async function validatePasswordResetToken(
  email: string,
  token: string
): Promise<ActionResponse<PasswordResetValidateData>> {
  try {
    const apiResponse = await httpClient<PasswordResetValidateData>(
      "/api/auth/password-reset/validate-token",
      {
        method: "POST",
        body: { email, token },
      }
    );

    return {
      success: apiResponse.success,
      message:
        apiResponse.message ||
        (apiResponse.success ? "Código válido" : "Código inválido o expirado"),
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error validating password reset token:", error);
    return {
      success: false,
      message: "Error de conexión. Intenta nuevamente.",
      data: null,
      errors: error,
    };
  }
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
): Promise<ActionResponse<PasswordResetResetData>> {
  try {
    const apiResponse = await httpClient<PasswordResetResetData>(
      "/api/auth/password-reset/reset",
      {
        method: "POST",
        body: { email, token, newPassword },
      }
    );

    return {
      success: apiResponse.success,
      message:
        apiResponse.message ||
        (apiResponse.success
          ? "Contraseña restablecida correctamente"
          : "Error al restablecer la contraseña"),
      data: apiResponse.data,
      errors: apiResponse.errors,
    };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "Error de conexión. Intenta nuevamente.",
      data: null,
      errors: error,
    };
  }
}
