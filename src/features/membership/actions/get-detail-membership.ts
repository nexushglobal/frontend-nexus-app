"use server";

import { api } from "@/features/shared/services/api";

import { PlanDetailResponse } from "../types/membership-detail.type";

export async function getMembershipPlanDetailAction() {
  try {
    const response = await api.get<PlanDetailResponse>("/api/membership-plan", {
      cache: "no-store",
    });

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener los planes de membresía",
      errors: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}
