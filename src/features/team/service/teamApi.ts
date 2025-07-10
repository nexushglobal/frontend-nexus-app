import { api } from "@/features/shared/services/api";
import type {
  TeamTreeResponse,
  TeamSearchResponse,
  TeamSearchParams,
} from "../types/team.types";

export class TeamService {
  /**
   * Obtiene el árbol de equipo desde el cliente
   */
  static async getTeamTree(
    depth: number = 2,
    userId?: string
  ): Promise<TeamTreeResponse> {
    const params = {
      depth,
      ...(userId && { userId }),
    };

    return api.get<TeamTreeResponse>("/api/users/tree", {
      params,
      cache: "no-store",
    });
  }

  /**
   * Busca miembros del equipo desde el cliente
   */
  static async searchTeamMembers(
    params: TeamSearchParams
  ): Promise<TeamSearchResponse> {
    const searchParams = {
      search: params.search.trim(),
      page: params.page || 1,
      limit: params.limit || 20,
    };

    return api.get<TeamSearchResponse>("/api/users/tree/search", {
      params: searchParams,
      cache: "no-store",
    });
  }

  /**
   * Obtiene información específica de un miembro
   */
  static async getTeamMember(userId: string): Promise<any> {
    return api.get(`/api/users/${userId}`);
  }

  /**
   * Verifica si un usuario puede ser navegado en el árbol
   */
  static async canNavigateToUser(
    userId: string
  ): Promise<{ canNavigate: boolean; reason?: string }> {
    try {
      await this.getTeamTree(1, userId);
      return { canNavigate: true };
    } catch (error) {
      return {
        canNavigate: false,
        reason: "No tienes permisos para ver este usuario",
      };
    }
  }
}
