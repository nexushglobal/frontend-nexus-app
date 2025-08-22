import { api } from '@/features/shared/services/api';
import { CurrentRankResponse } from '../types/rank.types';

export class RankService {
  static async getCurrentRank(): Promise<CurrentRankResponse> {
    return await api.get<CurrentRankResponse>('/api/rank/current');
  }
}