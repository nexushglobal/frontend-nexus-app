"use server";

import { api } from "@/features/shared/services/api";
import type { TeamTreeResponse } from "../types/team.types";

export async function getTeamTreeAction(formData: FormData): Promise<{
  success: boolean;
  data?: TeamTreeResponse;
  error?: string;
  errors?: any;
}> {
  try {
    // Extraer parámetros del FormData
    const depth = parseInt(formData.get("depth") as string) || 2;
    const userId = (formData.get("userId") as string) || undefined;

    // Validación server-side OBLIGATORIA
    if (depth < 1 || depth > 5) {
      return {
        success: false,
        error: "La profundidad debe estar entre 1 y 5 niveles",
      };
    }

    const params = {
      depth,
      ...(userId && { userId }),
    };

    const response = await api.get<TeamTreeResponse>("/api/users/tree", {
      params,
      cache: "no-store",
    });

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Error getting team tree:", error);
    return {
      success: false,
      error: "Error al obtener el árbol de equipo",
      errors: error,
    };
  }
}
