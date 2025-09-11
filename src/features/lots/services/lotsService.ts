import { api } from '@features/shared/services/api';
import type {
  Block,
  Lot,
  LotResponse,
  ProjectsResponse,
  Stage,
} from '../types/lots.types';

export const lotsService = {
  getProjects: async (): Promise<ProjectsResponse> => {
    return await api.get<ProjectsResponse>('/api/unilevel/external/projects');
  },

  getStages: async (projectId: string): Promise<Stage[]> => {
    return await api.get<Stage[]>(
      `/api/unilevel/external/projects/${projectId}/stages`,
    );
  },

  getBlocks: async (stageId: string): Promise<Block[]> => {
    return await api.get<Block[]>(
      `/api/unilevel/external/stages/${stageId}/blocks`,
    );
  },

  getLots: async (blockId: string): Promise<Lot[]> => {
    return await api.get<Lot[]>(
      `/api/unilevel/external/blocks/${blockId}/lots`,
    );
  },

  getAllLots: async (
    projectId: string,
    params: Record<string, string | number | boolean | undefined | null>,
  ) => {
    return await api.get<LotResponse>(
      `/api/unilevel/external/projects/${projectId}/lots`,
      { params },
    );
  },
};
