import { api } from '@/features/shared/services/api';
import type { ProfileData } from '../types/profile.types';

export class ProfileService {
  static async getProfile(): Promise<ProfileData> {
    return api.get<ProfileData>('/api/user/profile');
  }

  static async refreshProfile(): Promise<ProfileData> {
    return api.get<ProfileData>('/api/user/profile', {
      cache: 'no-store',
    });
  }

  static async getProfileStats(): Promise<any> {
    return api.get('/api/user/profile/stats');
  }
}
