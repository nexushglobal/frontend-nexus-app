import { PaginationMeta } from '@/features/shared/types/api.types';

export interface TeamMember {
  id: string;
  email: string;
  referralCode: string;
  position: 'LEFT' | 'RIGHT' | null;
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

export interface TeamSearchResult {
  id: string;
  email: string;
  referralCode: string;
  fullName: string;
  documentNumber: string;
  position: 'LEFT' | 'RIGHT';
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

export interface DirectTeam {
  userId: string;
  fullName: string;
  email: string;
  monthlyVolume: {
    leftVolume: number;
    rightVolume: number;
    totalVolume: number;
  };
  lots: {
    purchased: number;
    sold: number;
    total: number;
  };
  currentRank: {
    id: number;
    name: string;
    code: string;
  } | null;
  highestRank: {
    id: number;
    name: string;
    code: string;
  } | null;
  position: 'LEFT' | 'RIGHT';
}

export interface DirectTeamPagination extends PaginationMeta {
  items: DirectTeam[];
}
export interface DirectTeamResponse {
  result: DirectTeamPagination;
  currentUser: {
    userId: string;
    fullName: string;
    email: string;
    totalDirectUsers: number;
  };
}
