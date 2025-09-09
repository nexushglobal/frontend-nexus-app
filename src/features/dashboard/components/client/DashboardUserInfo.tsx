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

  useEffect(() => {
    if (data?.userData) {
      const today = new Date();
      const birthdate = new Date(data.userData.birthdate);

      const isBirthday =
        today.getDate() === birthdate.getDate() &&
        today.getMonth() === birthdate.getMonth();

      if (isBirthday) {
        setShowBirthdayModal(true);
      }
    }

    // Check membership status
    if (data?.membershipData) {
      const { hasMembership, membership } = data.membershipData;

      if (!hasMembership) {
        // No membership - show no membership modal
        if (showBirthdayModal) {
          // Delay to show after birthday modal
          const timer = setTimeout(() => {
            setShowNoMembershipModal(true);
          }, 1000);
          return () => clearTimeout(timer);
        } else {
          setShowNoMembershipModal(true);
        }
      } else if (hasMembership && membership) {
        // Has membership - check if expired
        const today = new Date();
        const endDate = new Date(membership.endDate);
        const isExpired = endDate < today;

        if (isExpired) {
          // Show expired modal after birthday modal (if any) or immediately
          if (showBirthdayModal) {
            // Delay to show after birthday modal
            const timer = setTimeout(() => {
              setShowExpiredMembershipModal(true);
            }, 1000);
            return () => clearTimeout(timer);
          } else {
            setShowExpiredMembershipModal(true);
          }
        }
      }
    }
  }, [data, showBirthdayModal]);

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
        onClose={() => setShowBirthdayModal(false)}
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
