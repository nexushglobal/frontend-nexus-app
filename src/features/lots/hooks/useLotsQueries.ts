'use client';

import { useQuery } from '@tanstack/react-query';
import { lotsService } from '../services/lotsService';

interface UseAllLotsParams {
  projectId: string;
  page?: number;
  limit?: number;
  term?: string;
  stageId?: string;
  blockId?: string;
  enabled?: boolean;
}

export function useProjects() {
  return useQuery({
    queryKey: ['lots', 'projects'],
    queryFn: lotsService.getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useStages(projectId: string, enabled = true) {
  return useQuery({
    queryKey: ['lots', 'stages', projectId],
    queryFn: () => lotsService.getStages(projectId),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBlocks(stageId: string, enabled = true) {
  return useQuery({
    queryKey: ['lots', 'blocks', stageId],
    queryFn: () => lotsService.getBlocks(stageId),
    enabled: enabled && !!stageId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAllLots({
  projectId,
  page = 1,
  limit = 10,
  term,
  stageId,
  blockId,
  enabled = true,
}: UseAllLotsParams) {
  const params: Record<string, string | number | boolean | undefined | null> = {
    page,
    limit,
  };

  if (term) params.term = term;
  if (stageId) params.stageId = stageId;
  if (blockId) params.blockId = blockId;


  return useQuery({
    queryKey: ['lots', 'all-lots', projectId, params],
    queryFn: () => lotsService.getAllLots(projectId, params),
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}