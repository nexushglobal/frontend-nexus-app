export interface Project {
  id: string;
  name: string;
  currency: string;
  isActive: boolean;
  logo: string | null;
  stageCount: number;
  blockCount: number;
  lotCount: number;
  activeLotCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  id: string;
  name: string;
  createdAt: string;
}

export interface Block {
  id: string;
  name: string;
  createdAt: string;
}

export interface Lot {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

export interface LotsFilters {
  projectId: string | null;
  stageId: string | null;
  blockId: string | null;
}
