"use server";

import { httpClient } from "@/lib/api/http-client";
import { ActionResponse } from "@/types/user.types";

export interface TeamMember {
  id: string;
  email: string;
  referralCode: string;
  position: "LEFT" | "RIGHT" | null;
  isActive: boolean;
  fullName: string;
  depth: number;
  children?: {
    left?: TeamMember;
    right?: TeamMember;
  };
}

export interface TeamTreeResponse {
  tree: TeamMember;
  metadata: {
    queryDurationMs: number;
    requestedDepth: number;
    rootUserId: string;
    currentUserId: string;
    canGoUp: boolean;
    parentId?: string;
  };
}

export async function getTeamTree(
  depth: number = 2,
  userId?: string
): Promise<ActionResponse<TeamTreeResponse>> {
  try {
    const params: Record<string, string> = { depth: depth.toString() };
    if (userId) params.userId = userId;

    const response = await httpClient<TeamTreeResponse>("/api/users/tree", {
      method: "GET",
      params,
      cache: "no-store",
    });

    return {
      success: response.success,
      message: response.message,
      data: response.data,
      errors: response.errors,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Error al obtener el árbol de equipo",
      data: null,
      errors: error,
    };
  }
}
