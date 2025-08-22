import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Banknote,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { WithdrawalDetail } from '../../../types/withdrawals.types';

interface WithdrawalOverviewSectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalOverviewSection({ withdrawal }: WithdrawalOverviewSectionProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalPointsUsed = withdrawal.withdrawalPoints?.reduce(
    (total, point) => total + point.amountUsed,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Banknote className="h-4 w-4 text-primary" />
              </div>
              Resumen del Retiro #{withdrawal.id}
            </CardTitle>
            {getStatusBadge(withdrawal.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">
                {withdrawal.amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Puntos solicitados</p>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {formatCurrency(withdrawal.amount)}
              </p>
            </div>

            <div className="text-center p-4 bg-info/5 border border-info/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              <p className="text-2xl font-bold text-info">
                {totalPointsUsed.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Puntos utilizados</p>
              <p className="text-xs text-muted-foreground mt-1">
                {withdrawal.withdrawalPoints?.length || 0} transacciones
              </p>
            </div>

            <div className="text-center p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <p className="text-lg font-bold text-secondary">
                {formatDate(withdrawal.createdAt).split(',')[0]}
              </p>
              <p className="text-sm text-muted-foreground">Fecha de solicitud</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(withdrawal.createdAt).split(',')[1]?.trim()}
              </p>
            </div>

            {withdrawal.reviewedAt && (
              <div className="text-center p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <p className="text-lg font-bold text-accent">
                  {formatDate(withdrawal.reviewedAt).split(',')[0]}
                </p>
                <p className="text-sm text-muted-foreground">Fecha de revisión</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(withdrawal.reviewedAt).split(',')[1]?.trim()}
                </p>
              </div>
            )}
          </div>

          {/* Rejection Reason */}
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

          {/* PDF Link */}
          {withdrawal.pdfUrl && (
            <>
              <Separator />
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Documento PDF</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprobante oficial del retiro
                    </p>
                  </div>
                </div>
                <a
                  href={withdrawal.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  Descargar PDF
                </a>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-medium">
                  {withdrawal.user.personalInfo.firstName} {withdrawal.user.personalInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{withdrawal.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID de usuario</p>
                <p className="font-mono text-sm">{withdrawal.user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Información Bancaria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="font-medium">{withdrawal.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Número de cuenta</p>
                <p className="font-mono text-sm">{withdrawal.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CCI</p>
                <p className="font-mono text-sm">{withdrawal.cci}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}