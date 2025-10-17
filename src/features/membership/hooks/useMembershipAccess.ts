'use client';

import { useQuery } from '@tanstack/react-query';
import { MembershipService } from '../services/membershipService';

/**
 * Hook para verificar si el usuario tiene acceso a cursos
 * Solo usuarios con membresía activa y planes Premium (PRE) o VIP tienen acceso
 */
export const useMembershipAccess = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['membership-detail-access'],
    queryFn: () => MembershipService.getMembershipDetail(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });

  const hasActiveMemership =
    data?.membership?.status === 'ACTIVE' &&
    data?.membership?.plan?.name;

  const planName = data?.membership?.plan?.name || '';

  // Verificar si el plan es Premium o VIP
  const hasCoursesAccess =
    hasActiveMemership &&
    (planName.toUpperCase().includes('PRE') ||
     planName.toUpperCase().includes('VIP') ||
     planName.toUpperCase().includes('PREMIUM'));

  return {
    hasCoursesAccess,
    isLoading,
    error,
    planName,
  };
};
