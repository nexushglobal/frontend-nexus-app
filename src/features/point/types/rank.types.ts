export interface Rank {
  id: number;
  name: string;
  code: string;
}

export interface RankWithRequirements extends Rank {
  requerimientos: string[];
}

export interface CurrentRankData {
  leftVolume: number;
  rightVolume: number;
  totalVolume: number;
  payLegQv: number;
  leftDirects: number;
  rightDirects: number;
  totalDirects: number;
  activeDirectReferrals: number;
  activeTeams: number;
  hasActiveMembership: boolean;
  monthStartDate: string;
  monthEndDate: string;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
}

export interface CurrentRankResponse {
  currentRank: Rank;
  highestRank?: Rank;
  nextRankNow: Rank;
  nextRankReq?: RankWithRequirements;
  currentData: CurrentRankData;
}