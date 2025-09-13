'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDashboardUserInfo } from '../../hooks/useDashboardUserInfo';
import { BirthdayModal } from '../modals/BirthdayModal';
import { ExpiredMembershipModal } from '../modals/ExpiredMembershipModal';
import { NoMembershipModal } from '../modals/NoMembershipModal';
import { DashboardUserInfoCards } from './DashboardUserInfoCards';
import { DashboardUserInfoSkeleton } from './DashboardUserInfoSkeleton';

export function DashboardUserInfo() {
  const { data, isLoading, error, refetch } = useDashboardUserInfo();
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showExpiredMembershipModal, setShowExpiredMembershipModal] =
    useState(false);
  const [showNoMembershipModal, setShowNoMembershipModal] = useState(false);
  const [hasShownBirthdayModal, setHasShownBirthdayModal] = useState(false);

  // Effect for checking birthday only once when data loads
  useEffect(() => {
    if (data?.userData && !hasShownBirthdayModal) {
      const today = new Date();
      const birthdate = new Date(data.userData.birthdate);

      const isBirthday =
        today.getDate() === birthdate.getDate() &&
        today.getMonth() === birthdate.getMonth();

      if (isBirthday) {
        setShowBirthdayModal(true);
        setHasShownBirthdayModal(true);
      }
    }
  }, [data?.userData, hasShownBirthdayModal]);

  // Effect for checking membership status
  useEffect(() => {
    if (data?.membershipData) {
      const { hasMembership, membership } = data.membershipData;

      if (!hasMembership) {
        // No membership - show no membership modal
        setShowNoMembershipModal(true);
      } else if (hasMembership && membership) {
        // Has membership - check if expired
        const today = new Date();
        const endDate = new Date(membership.endDate);
        const isExpired = endDate < today;

        if (isExpired) {
          setShowExpiredMembershipModal(true);
        }
      }
    }
  }, [data?.membershipData]);

  // Handle birthday modal close and show next modal if needed
  const handleBirthdayModalClose = () => {
    setShowBirthdayModal(false);

    // After closing birthday modal, check if we need to show membership modals
    if (data?.membershipData) {
      const { hasMembership, membership } = data.membershipData;

      if (!hasMembership) {
        // Delay to show no membership modal after birthday modal closes
        setTimeout(() => {
          setShowNoMembershipModal(true);
        }, 500);
      } else if (hasMembership && membership) {
        // Has membership - check if expired
        const today = new Date();
        const endDate = new Date(membership.endDate);
        const isExpired = endDate < today;

        if (isExpired) {
          // Delay to show expired modal after birthday modal closes
          setTimeout(() => {
            setShowExpiredMembershipModal(true);
          }, 500);
        }
      }
    }
  };

  if (isLoading) {
    return <DashboardUserInfoSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Error al cargar la información del dashboard</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardUserInfoCards data={data} />
      </div>

      {/* Birthday Modal */}
      <BirthdayModal
        userName={data.userData.firstName}
        isOpen={showBirthdayModal}
        onClose={handleBirthdayModalClose}
      />

      {/* No Membership Modal */}
      <NoMembershipModal
        isOpen={showNoMembershipModal}
        onClose={() => setShowNoMembershipModal(false)}
        userName={data.userData.firstName}
      />

      {/* Expired Membership Modal */}
      <ExpiredMembershipModal
        isOpen={showExpiredMembershipModal}
        onClose={() => setShowExpiredMembershipModal(false)}
        membershipData={
          data.membershipData.membership
            ? {
                planName: data.membershipData.membership.planName,
                endDate: data.membershipData.membership.endDate,
              }
            : undefined
        }
      />
    </>
  );
}
