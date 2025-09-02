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
          <Badge className="gap-1 bg-success/10 text-success border border-success/30 font-medium hover:bg-success/20">
            <CheckCircle className="h-3 w-3" />
            Aprobado
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="gap-1 bg-destructive/10 text-destructive border border-destructive/30 font-medium hover:bg-destructive/20">
            <AlertCircle className="h-3 w-3" />
            Rechazado
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border border-warning/30 font-medium hover:bg-warning/20">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge className="gap-1 bg-muted text-muted-foreground border font-medium">
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
    <div className="space-y-3">
      {/* Compact Status and Amount */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl font-bold">{withdrawal.amount.toLocaleString()} pts</div>
            <div className="text-xs text-muted-foreground">≈ {formatCurrency(withdrawal.amount)}</div>
          </div>
          {getStatusBadge(withdrawal.status)}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">ID:</span>
            <span className="ml-1 font-medium">#{withdrawal.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Puntos usados:</span>
            <span className="ml-1 font-medium">{totalPointsUsed.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Compact Dates */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Solicitado:</span>
            <span>{formatDate(withdrawal.createdAt).split(',')[0]}</span>
          </div>
          {withdrawal.reviewedAt && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revisado:</span>
              <span>{formatDate(withdrawal.reviewedAt).split(',')[0]}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Rejection Reason */}
      {withdrawal.rejectionReason && (
        <Card className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-red-600">Rechazado</div>
              <div className="text-xs text-muted-foreground mt-1">
                {withdrawal.rejectionReason}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* PDF Link */}
      {withdrawal.pdfUrl && (
        <Card className="p-4">
          <a
            href={withdrawal.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
          >
            <FileText className="h-4 w-4" />
            Descargar PDF
          </a>
        </Card>
      )}
    </div>
  );
}