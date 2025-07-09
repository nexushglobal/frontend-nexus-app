"use server";
import { api } from "@/features/shared/services/api";
import { ApiError } from "@/features/shared/types/api.types";
import { ValidateTokenResponse } from "../types/password-reset.type";

export async function validateResetTokenAction(token: string, email: string) {
  if (!token || !email) {
    return {
      success: false,
      error: "Token y email son requeridos",
      errors: null,
      valid: false,
    };
  }

  try {
    const response = await api.post<ValidateTokenResponse>(
      "/auth/password-reset/validate-token",
      { token }
    );

    return {
      success: true,
      message: response.message || "Token validado exitosamente",
    };
  } catch (error) {
    console.error("Validate token error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        valid: false,
        error: error.message,
        errors: error.errors,
      };
    }

    return {
      success: false,
      valid: false,
      error: "Error validando token",
      errors: null,
    };
  }
}
