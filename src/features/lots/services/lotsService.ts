import { api } from "@features/shared/services/api";
import type { ProjectsResponse, Stage, Block, Lot } from "../types/lots.types";

export const lotsService = {
  getProjects: async (): Promise<ProjectsResponse> => {
    try {
      return await api.get<ProjectsResponse>("/api/unilevel/external/projects");
    } catch (error) {
      if (error instanceof Error)
        console.error("Error getting projects:", error.message);
      throw error;
    }
  },

  getStages: async (projectId: string): Promise<Stage[]> => {
    try {
      return await api.get<Stage[]>(
        `/api/unilevel/external/projects/${projectId}/stages`
      );
    } catch (error) {
      if (error instanceof Error)
        console.error("Error getting stages:", error.message);
      throw error;
    }
  },

  getBlocks: async (stageId: string): Promise<Block[]> => {
    try {
      return await api.get<Block[]>(
        `/api/unilevel/external/stages/${stageId}/blocks`
      );
    } catch (error) {
      if (error instanceof Error)
        console.error("Error getting blocks:", error.message);
      throw error;
    }
  },

  getLots: async (blockId: string): Promise<Lot[]> => {
    try {
      return await api.get<Lot[]>(
        `/api/unilevel/external/blocks/${blockId}/lots`
      );
    } catch (error) {
      if (error instanceof Error)
        console.error("Error getting lots:", error.message);
      throw error;
    }
  },
};
