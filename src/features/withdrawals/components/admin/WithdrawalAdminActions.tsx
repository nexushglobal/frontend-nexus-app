'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { WithdrawalDetail } from '../../types/withdrawals.types';
import { WithdrawalActionResultModal } from './modals/WithdrawalActionResultModal';
import { WithdrawalApprovalModal } from './modals/WithdrawalApprovalModal';
import { WithdrawalRejectionModal } from './modals/WithdrawalRejectionModal';

interface WithdrawalAdminActionsProps {
  withdrawal: WithdrawalDetail;
  onWithdrawalUpdate: () => void;
}

export function WithdrawalAdminActions({
  withdrawal,
  onWithdrawalUpdate,
}: WithdrawalAdminActionsProps) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [currentAction, setCurrentAction] = useState<'approve' | 'reject'>(
    'approve',
  );

  const handleActionSuccess = (data: any, action: 'approve' | 'reject') => {
    setResultData({
      success: true,
      message:
        action === 'approve'
          ? 'Retiro aprobado exitosamente'
          : 'Retiro rechazado exitosamente',
      data,
    });
    setCurrentAction(action);
    setShowResultModal(true);
    onWithdrawalUpdate();
  };

  const getStatusBadge = () => {
    switch (withdrawal.status) {
      case 'PENDING':
        return (
          <Badge
            variant="secondary"
            className="bg-warning/10 text-warning border-warning/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge
            variant="secondary"
            className="bg-success/10 text-success border-success/20"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge
            variant="secondary"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
      case 'PENDING_SIGNATURE':
        return (
          <Badge
            variant="secondary"
            className="bg-info/10 text-info border-info/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pendiente de Firma
          </Badge>
        );
      default:
        return <Badge variant="secondary">{withdrawal.status}</Badge>;
    }
  };

  const renderActionButtons = () => {
    switch (withdrawal.status) {
      case 'PENDING':
      case 'PENDING_SIGNATURE':
        return (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowApprovalModal(true)}
              className="flex-1 w-full"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Aprobar Retiro</span>
              <span className="xs:hidden">✓</span>
            </Button>
            <Button
              onClick={() => setShowRejectionModal(true)}
              variant="destructive"
              className="flex-1 w-full"
              size="sm"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Rechazar Retiro</span>
              <span className="xs:hidden">✗</span>
            </Button>
          </div>
        );

      case 'APPROVED':
        return (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-sm text-success font-medium">
              Este retiro ha sido aprobado
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {withdrawal.reviewedAt &&
                `Aprobado el ${new Date(
                  withdrawal.reviewedAt,
                ).toLocaleDateString('es-PE')}`}
            </p>
          </div>
        );

      case 'REJECTED':
        return (
          <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm text-destructive font-medium">
              Este retiro ha sido rechazado
            </p>
            {withdrawal.rejectionReason && (
              <p className="text-xs text-muted-foreground mt-2 bg-background/50 p-2 rounded">
                <strong>Motivo:</strong> {withdrawal.rejectionReason}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {withdrawal.reviewedAt &&
                `Rechazado el ${new Date(
                  withdrawal.reviewedAt,
                ).toLocaleDateString('es-PE')}`}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Acciones de Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Estado actual:
            </span>
            {getStatusBadge()}
          </div>

          {renderActionButtons()}

          {/* Additional Info */}
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto:</span>
              <span className="font-medium">
                {withdrawal.amount.toLocaleString()} puntos
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Solicitado:</span>
              <span className="font-medium">
                {new Date(withdrawal.createdAt).toLocaleDateString('es-PE')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usuario:</span>
              <span className="font-medium">
                {withdrawal.user.personalInfo.firstName}{' '}
                {withdrawal.user.personalInfo.lastName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <WithdrawalApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSuccess={(data) => handleActionSuccess(data, 'approve')}
        withdrawalId={withdrawal.id.toString()}
        withdrawal={withdrawal}
      />

      <WithdrawalRejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSuccess={(data) => handleActionSuccess(data, 'reject')}
        withdrawalId={withdrawal.id.toString()}
        withdrawal={withdrawal}
      />

      <WithdrawalActionResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={resultData}
        action={currentAction}
      />
    </>
  );
}
