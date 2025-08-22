'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  User,
  CreditCard,
  FileText
} from 'lucide-react';

interface WithdrawalActionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  action: 'approve' | 'reject';
}

export function WithdrawalActionResultModal({
  isOpen,
  onClose,
  result,
  action,
}: WithdrawalActionResultModalProps) {
  if (!result) return null;

  const isSuccess = result.success;
  const withdrawal = result.data;

  const getActionInfo = () => {
    if (action === 'approve') {
      return {
        title: 'Retiro Aprobado',
        description: 'El retiro ha sido aprobado exitosamente',
        icon: CheckCircle,
        iconColor: 'text-success',
        badgeColor: 'bg-success/10 text-success border-success/20',
        cardColor: 'bg-success/5 border-success/20',
      };
    } else {
      return {
        title: 'Retiro Rechazado',
        description: 'El retiro ha sido rechazado',
        icon: AlertTriangle,
        iconColor: 'text-destructive',
        badgeColor: 'bg-destructive/10 text-destructive border-destructive/20',
        cardColor: 'bg-destructive/5 border-destructive/20',
      };
    }
  };

  const actionInfo = getActionInfo();
  const IconComponent = actionInfo.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${actionInfo.iconColor}`} />
            {actionInfo.title}
          </DialogTitle>
          <DialogDescription>
            {actionInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isSuccess && withdrawal ? (
            <div className={`p-4 border rounded-lg ${actionInfo.cardColor}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Estado actualizado
                  </span>
                  <Badge className={actionInfo.badgeColor}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {withdrawal.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Retiro #
                  </span>
                  <span className="font-medium">{withdrawal.id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Monto
                  </span>
                  <span className="font-bold">
                    {withdrawal.amount?.toLocaleString() || 'N/A'} puntos
                  </span>
                </div>

                {withdrawal.reviewedAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fecha de revisión</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(withdrawal.reviewedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {withdrawal.user && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Usuario</p>
                      <p className="text-xs text-muted-foreground">
                        {withdrawal.user.personalInfo?.firstName} {withdrawal.user.personalInfo?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {withdrawal.user.email}
                      </p>
                    </div>
                  </div>
                )}

                {withdrawal.rejectionReason && action === 'reject' && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Motivo del rechazo</p>
                      <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded mt-1">
                        {withdrawal.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/20 border border-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {result.message || 'Operación completada'}
                </p>
              </div>
            </div>
          )}

          {action === 'approve' && (
            <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-sm text-info-foreground">
                <strong>Siguiente paso:</strong> El usuario será notificado sobre la 
                aprobación y el retiro será procesado según los procedimientos establecidos.
              </p>
            </div>
          )}

          {action === 'reject' && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Notificación:</strong> El usuario será informado sobre el rechazo 
                y podrá ver el motivo proporcionado en su panel de retiros.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}