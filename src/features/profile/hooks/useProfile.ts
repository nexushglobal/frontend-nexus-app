'use client';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getProfileAction } from '../actions/get-profile';
import type { ProfileData } from '../types/profile.types';
import { useProfileUpdate } from './useProfileMutations';

export const useProfile = () => {
  const {
    data: profile,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<ProfileData> => {
      const result = await getProfileAction();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        const errorMessage = result.message || 'Error al cargar el perfil';
        toast.error('Error', {
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const profileUpdate = useProfileUpdate();

  // Wrapper para mantener compatibilidad pero con loading states
  const refetchWithLoading = async () => {
    return profileUpdate.mutateAsync(async () => {
      const result = await refetch();
      return result.data;
    });
  };

  return {
    profile: profile || null,
    loading,
    error: error?.message || null,
    refetch: refetchWithLoading,
    // Expose mutation states for updates
    isUpdating: profileUpdate.isPending,
    updateError: profileUpdate.error?.message || null,
  };
};
