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
