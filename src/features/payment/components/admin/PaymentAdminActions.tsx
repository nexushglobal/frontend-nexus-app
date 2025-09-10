'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentStatus } from '@/features/payment/types/enums-payments';
import { PaymentAdminDetailResponse } from '@/features/payment/types/response-payment';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PaymentOperationResponse } from '../../types/approval.type';
import { PaymentActionResultModal } from './modals/PaymentActionResultModal';
import { PaymentApprovalModal } from './modals/PaymentApprovalModal';
import { PaymentCompleteModal } from './modals/PaymentCompleteModal';
import { PaymentRejectionModal } from './modals/PaymentRejectionModal';

interface PaymentAdminActionsProps {
  payment: PaymentAdminDetailResponse;
  onPaymentUpdate: () => void;
}

export function PaymentAdminActions({
  payment,
  onPaymentUpdate,
}: PaymentAdminActionsProps) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<PaymentOperationResponse | null>(
    null,
  );
  const [currentAction, setCurrentAction] = useState<
    'approve' | 'reject' | 'complete'
  >('approve');

  const handleActionSuccess = (
    data: PaymentOperationResponse,
    action: 'approve' | 'reject' | 'complete',
  ) => {
    setResultData(data);
    setCurrentAction(action);
    setShowResultModal(true);
    onPaymentUpdate();
  };

  const handleCompletePayment = () => {
    if (
      payment.status === PaymentStatus.APPROVED ||
      payment.status === PaymentStatus.COMPLETED
    ) {
      setShowCompleteModal(true);
    }
  };

  const handleCompleteSuccess = (data: any) => {
    // For complete action, just show a toast instead of modal
    toast.success('Información actualizada correctamente');
    onPaymentUpdate();
  };

  const getStatusBadge = () => {
    switch (payment.status) {
      case PaymentStatus.PENDING:
        return (
          <Badge
            variant="secondary"
            className="bg-warning/10 text-warning border-warning/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case PaymentStatus.APPROVED:
        return (
          <Badge
            variant="secondary"
            className="bg-success/10 text-success border-success/20"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        );
      case PaymentStatus.REJECTED:
        return (
          <Badge
            variant="secondary"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
      case PaymentStatus.COMPLETED:
        return (
          <Badge
            variant="secondary"
            className="bg-info/10 text-info border-info/20"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{payment.status}</Badge>;
    }
  };

  const renderActionButtons = () => {
    switch (payment.status) {
      case PaymentStatus.PENDING:
        return (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowApprovalModal(true)}
              className="flex-1 w-full"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Aprobar</span>
              <span className="xs:hidden">✓</span>
            </Button>
            <Button
              onClick={() => setShowRejectionModal(true)}
              variant="destructive"
              className="flex-1 w-full"
              size="sm"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Rechazar</span>
              <span className="xs:hidden">✗</span>
            </Button>
          </div>
        );

      case PaymentStatus.APPROVED:
      case PaymentStatus.COMPLETED:
        return (
          <Button onClick={handleCompletePayment} className="w-full" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden xs:inline">Actualizar Información</span>
            <span className="xs:hidden">Actualizar</span>
          </Button>
        );

      case PaymentStatus.REJECTED:
        return (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Este pago ha sido rechazado y no se pueden realizar acciones
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Admin Actions Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Acciones de Admin</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Estado:</span>
                  {getStatusBadge()}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">{renderActionButtons()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PaymentApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSuccess={(data) => handleActionSuccess(data, 'approve')}
        paymentId={payment.id.toString()}
      />

      <PaymentRejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSuccess={(data) => handleActionSuccess(data, 'reject')}
        paymentId={payment.id.toString()}
      />

      <PaymentCompleteModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onSuccess={handleCompleteSuccess}
        paymentId={payment.id.toString()}
      />

      {resultData && (
        <PaymentActionResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          result={resultData}
          action={currentAction}
        />
      )}
    </>
  );
}
