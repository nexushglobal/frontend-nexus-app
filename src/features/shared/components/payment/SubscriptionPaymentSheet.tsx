'use client';

import { subscribeToPlanAction } from '@/features/membership/actions/suscription-to-plan';
import { PaymentResultModal } from '@/features/membership/components/PaymentResultModal';
import {
  MembershipPlan,
  UserMembership,
} from '@/features/membership/types/membership-detail.type';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { BasePaymentSheet } from './BasePaymentSheet';

interface SubscriptionPaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
  userMembership: UserMembership;
  onSuccess?: () => void;
}

export function SubscriptionPaymentSheet({
  isOpen,
  onClose,
  plan,
  userMembership,
  onSuccess,
}: SubscriptionPaymentSheetProps) {
  const totalAmount =
    plan.upgradeCost !== undefined ? plan.upgradeCost : plan.price;

  const handleSubmit = async (formData: FormData) => {
    formData.append('planId', plan.id.toString());
    return await subscribeToPlanAction(formData);
  };

  const summaryContent = (
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Plan:</span>
        <span className="font-medium">{plan.name}</span>
      </div>
      {userMembership.hasMembership && (
        <div className="pt-2 border-t border-primary/20">
          <div className="text-xs text-muted-foreground">
            Plan actual: {userMembership.plan?.name} •{' '}
            {formatCurrency(userMembership.plan?.price || 0)}
          </div>
        </div>
      )}
    </>
  );

  return (
    <BasePaymentSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Procesar Pago - Plan ${plan.name}`}
      totalAmount={totalAmount}
      amountLabel={plan.isUpgrade ? 'Costo de actualización' : 'Precio'}
      summaryContent={summaryContent}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      PaymentResultModal={PaymentResultModal}
    />
  );
}
