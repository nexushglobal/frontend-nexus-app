"use server";

import { api } from "@/features/shared/services/api";
import type { TeamSearchResponse, TeamSearchParams } from "../types/team.types";

export async function searchTeamMembersAction({
  search,
  limit,
  page,
}: TeamSearchParams): Promise<{
  success: boolean;
  data?: TeamSearchResponse;
  error?: string;
  errors?: any;
  message?: string;
}> {
  try {
    if (!search) {
      return {
        success: false,
        error: "El término de búsqueda es requerido",
      };
    }

    const params = {
      search,
      page,
      limit,
    };

    const response = await api.get<TeamSearchResponse>(
      "/api/users/tree/search",
      {
        params,
        cache: "no-store",
      }
    );

    return {
      success: true,
      data: response,
      message: "Miembros del equipo encontrados",
    };
  } catch (error: any) {
    console.error("Error searching team members:", error);
    return {
      success: false,
      error: "Error al buscar miembros del equipo",
      errors: error,
    };
  }
}
