"use server";

import { api } from "@/features/shared/services/api";
import { PlanDetailResponse } from "../types/membership-detail.type";

export async function getMembershipPlanDetailAction(planId: string) {
  try {
    const response = await api.get<PlanDetailResponse>(
      `/api/membership-plan/${planId}`,
      {
        cache: "no-store",
      }
    );

    return {
      data: response,
      success: true,
      message: "Plan obtenido exitosamente",
    };
  } catch (error) {
    console.error("Error al obtener el detalle del plan:", error);

    return {
      success: false,
      message: "Error al obtener el detalle del plan de membresía",
      errors: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
