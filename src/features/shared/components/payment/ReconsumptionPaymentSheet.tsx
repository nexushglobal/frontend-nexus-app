'use client';

import { MembershipReconsumption } from '@/features/membership/types/reconsumption.type';
import { reconsumtionAction } from '@/features/membership/actions/reconsumption';
import { BasePaymentSheet } from './BasePaymentSheet';
import { ReconsumptionResultModal } from './ReconsumptionResultModal';

interface ReconsumptionPaymentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  membership: MembershipReconsumption;
  onSuccess?: () => void;
}

export function ReconsumptionPaymentSheet({
  isOpen,
  onClose,
  membership,
  onSuccess,
}: ReconsumptionPaymentSheetProps) {
  const handleSubmit = async (formData: FormData) => {
    formData.append('membershipId', membership.membershipId.toString());
    return await reconsumtionAction(formData);
  };

  const summaryContent = (
    <>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Membresía ID:</span>
        <span className="font-medium">{membership.membershipId}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Estado:</span>
        <span className="font-medium">{membership.status}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Período:</span>
        <span className="font-medium text-sm">
          {new Date(membership.startDate).toLocaleDateString('es-ES')} -{' '}
          {new Date(membership.endDate).toLocaleDateString('es-ES')}
        </span>
      </div>
    </>
  );

  return (
    <BasePaymentSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Procesar Reconsumo"
      totalAmount={membership.reconsumptionAmount}
      amountLabel="Monto de reconsumo"
      summaryContent={summaryContent}
      onSubmit={handleSubmit}
      onSuccess={onSuccess}
      PaymentResultModal={ReconsumptionResultModal}
    />
  );
}