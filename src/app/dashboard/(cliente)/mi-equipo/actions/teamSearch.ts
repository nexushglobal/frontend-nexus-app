"use server";

import { httpClient } from "@/lib/api/http-client";
import { ActionResponse } from "@/types/user.types";

export interface TeamSearchResult {
  id: string;
  email: string;
  referralCode: string;
  fullName: string;
  documentNumber: string;
  position: "LEFT" | "RIGHT";
  isActive: boolean;
}

export interface TeamSearchResponse {
  results: TeamSearchResult[];
  metadata: {
    queryDurationMs: number;
    total: number;
    page: number;
    limit: number;
    searchTerm: string;
    rootUserId: string;
  };
}

export interface TeamSearchParams {
  search: string;
  page?: number;
  limit?: number;
}

export async function searchTeamMembers({
  search,
  page = 1,
  limit = 20,
}: TeamSearchParams): Promise<ActionResponse<TeamSearchResponse>> {
  try {
    const params = {
      search: search.trim(),
      page: page.toString(),
      limit: limit.toString(),
    };

    const response = await httpClient<TeamSearchResponse>(
      "/api/users/tree/search",
      {
        method: "GET",
        params,
        cache: "no-store",
      }
    );

    return {
      success: response.success,
      message: response.message,
      data: response.data,
      errors: response.errors,
    };
  } catch (error: any) {
    console.error("Error searching team members:", error);
    return {
      success: false,
      message: "Error al buscar miembros del equipo",
      data: null,
      errors: error,
    };
  }
}
