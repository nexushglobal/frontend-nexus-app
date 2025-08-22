'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Banknote,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  User,
} from 'lucide-react';
import { WithdrawalDetail } from '../../types/withdrawals.types';

interface WithdrawalGeneralInfoProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalGeneralInfo({ withdrawal }: WithdrawalGeneralInfoProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="gap-1 bg-success/10 text-success border-success/30 hover:bg-success/20">
            <CheckCircle className="h-3 w-3" />
            Aprobado
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="gap-1 bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20">
            <AlertCircle className="h-3 w-3" />
            Rechazado
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border-warning/30 hover:bg-warning/20">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

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
    <div className="space-y-6">
      {/* Main Withdrawal Info */}
      <Card className="border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Banknote className="h-4 w-4 text-primary" />
              </div>
              Información General del Retiro
            </CardTitle>
            {getStatusBadge(withdrawal.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium text-muted-foreground">
                  Monto Solicitado
                </label>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {withdrawal.amount.toLocaleString()} pts
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de Solicitud
                </label>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {formatDate(withdrawal.createdAt)}
              </p>
            </div>

            {withdrawal.reviewedAt && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Revisión
                  </label>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(withdrawal.reviewedAt)}
                </p>
              </div>
            )}

            {withdrawal.pdfUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium text-muted-foreground">
                    Documento
                  </label>
                </div>
                <a
                  href={withdrawal.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  Ver PDF
                </a>
              </div>
            )}
          </div>

          {withdrawal.rejectionReason && (
            <>
              <Separator />
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-destructive">
                      Motivo de Rechazo
                    </h4>
                    <p className="text-sm text-foreground">
                      {withdrawal.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 border border-info/20">
                <User className="h-4 w-4 text-info" />
              </div>
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre Completo
                </label>
                <p className="text-base font-semibold text-foreground">
                  {withdrawal.user.personalInfo.firstName}{' '}
                  {withdrawal.user.personalInfo.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-base text-foreground">{withdrawal.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID de Usuario
                </label>
                <p className="text-base text-foreground font-mono">
                  {withdrawal.user.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Information */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
                <CreditCard className="h-4 w-4 text-secondary" />
              </div>
              Información Bancaria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Banco
                </label>
                <p className="text-base font-semibold text-foreground">
                  {withdrawal.bankName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Número de Cuenta
                </label>
                <p className="text-base text-foreground font-mono">
                  {withdrawal.accountNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  CCI
                </label>
                <p className="text-base text-foreground font-mono">
                  {withdrawal.cci}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviewed By Information */}
      {withdrawal.reviewedBy && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
                <Building2 className="h-4 w-4 text-accent" />
              </div>
              Información de Revisión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Revisado por (ID)
                </label>
                <p className="text-base text-foreground font-mono">
                  {withdrawal.reviewedBy.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email del Revisor
                </label>
                <p className="text-base text-foreground">
                  {withdrawal.reviewedBy.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}