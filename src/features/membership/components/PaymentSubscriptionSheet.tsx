'use client';

import {
  MembershipPlan,
  UserMembership,
} from '@/features/membership/types/membership-detail.type';
import { SubscriptionPaymentSheet } from '@/features/shared/components/payment/SubscriptionPaymentSheet';

interface PaymentSubscriptionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
  userMembership: UserMembership;
  onSuccess?: () => void;
}

export function PaymentSubscriptionSheet({
  isOpen,
  onClose,
  plan,
  userMembership,
  onSuccess,
}: PaymentSubscriptionSheetProps) {
  return (
    <SubscriptionPaymentSheet
      isOpen={isOpen}
      onClose={onClose}
      plan={plan}
      userMembership={userMembership}
      onSuccess={onSuccess}
    />
  );
}
