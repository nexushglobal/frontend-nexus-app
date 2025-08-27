import { api } from '@/features/shared/services/api';
import { DirectTeamResponse } from '../types/team.types';

export class UserService {
  static async getUsersDirects(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<DirectTeamResponse> {
    return api.get<DirectTeamResponse>('/api/users/dashboard', { params });
  }
}
