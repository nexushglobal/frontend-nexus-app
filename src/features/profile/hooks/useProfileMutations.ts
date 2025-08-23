'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ProfileMutationOptions<T = any> {
  mutationFn: (data: T) => Promise<any>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useProfileMutation = <T = any>(options: ProfileMutationOptions<T>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({
        queryKey: ['user-profile']
      });

      if (options.successMessage) {
        toast.success('Éxito', {
          description: options.successMessage,
        });
      }

      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: options.errorMessage || error.message || 'Error al actualizar el perfil',
      });

      options.onError?.(error);
    }
  });
};

// Hook específico para actualizaciones del perfil con loading states
export const useProfileUpdate = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (updateFn: () => Promise<any>) => {
      return await updateFn();
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({
        queryKey: ['user-profile']
      });
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description: error.message || 'Error al actualizar el perfil',
      });
    }
  });

  return {
    mutate: updateProfile.mutate,
    mutateAsync: updateProfile.mutateAsync,
    isPending: updateProfile.isPending,
    isSuccess: updateProfile.isSuccess,
    error: updateProfile.error,
    reset: updateProfile.reset
  };
};