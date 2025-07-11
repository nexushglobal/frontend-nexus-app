"use server";

import { api } from "@/features/shared/services/api";
import type { BankInfoRequest } from "../types/requests-profile.types";

export async function updateBankInfoAction(updateData: BankInfoRequest) {
  try {
    await api.put("/api/user/profile/bank-info", updateData);

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
