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

// Props interfaces for components
export interface TeamMemberNodeData {
  member: TeamMember;
  isCurrentUser: boolean;
  isViewingUser: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onNavigate: () => void;
}

export interface TeamTreeFlowProps {
  tree: TeamMember;
  currentUserId: string;
  viewingUserId: string;
  onSelectMember: (member: TeamMember) => void;
  onNavigateToUser: (userId: string) => void;
  currentDepth?: number;
}

export interface TeamTreeControlsProps {
  canGoUp: boolean;
  isAtRoot: boolean;
  currentDepth: number;
  onNavigateToRoot: () => void;
  onNavigateToParent: () => void;
  onChangeDepth: (depth: number) => void;
  onRefresh: () => void;
  onNavigateToUser: (userId: string) => void;
}

export interface TeamMemberSheetProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToUser: (userId: string) => void;
}

export interface TeamSearchModalProps {
  children: React.ReactNode;
  onNavigateToUser: (userId: string) => void;
}
