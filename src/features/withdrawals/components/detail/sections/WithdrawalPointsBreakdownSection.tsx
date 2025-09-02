import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Banknote,
  Calendar,
  Coins,
  Eye,
  FileText,
  Hash,
  PieChart,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { WithdrawalDetail, WithdrawalPoint } from '../../../types/withdrawals.types';
import { UnifiedTransactionModal } from '../UnifiedTransactionModal';

interface WithdrawalPointsBreakdownSectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalPointsBreakdownSection({ withdrawal }: WithdrawalPointsBreakdownSectionProps) {
  const [selectedPoint, setSelectedPoint] = useState<WithdrawalPoint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleShowTransaction = (withdrawalPoint: WithdrawalPoint) => {
    setSelectedPoint(withdrawalPoint);
    setModalOpen(true);
  };

  const getTransactionTypeBadge = (metadata: any) => {
    const type = metadata?.tipo_transaccion;
    switch (type?.toUpperCase()) {
      case 'BINARY_COMMISSION':
        return (
          <Badge className="gap-1 bg-success/10 text-success border-success/30 text-xs">
            <TrendingUp className="h-3 w-3" />
            Comisión Binaria
          </Badge>
        );
      case 'DIRECT_COMMISSION':
        return (
          <Badge className="gap-1 bg-info/10 text-info border-info/30 text-xs">
            <TrendingUp className="h-3 w-3" />
            Comisión Directa
          </Badge>
        );
      case 'PURCHASE':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border-warning/30 text-xs">
            <DollarSign className="h-3 w-3" />
            Compra
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Hash className="h-3 w-3" />
            {type || 'Transacción'}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPointsUsed = withdrawal.withdrawalPoints?.reduce(
    (total, point) => total + point.amountUsed,
    0
  ) || 0;

  const totalOriginalPoints = withdrawal.withdrawalPoints?.reduce(
    (total, point) => total + point.pointsAmount,
    0
  ) || 0;

  if (!withdrawal.withdrawalPoints || withdrawal.withdrawalPoints.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            Desglose de Puntos Utilizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted/50 border-2 border-muted/80 mb-4">
              <Coins className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay puntos registrados
            </h3>
            <p className="text-sm text-muted-foreground">
              Este retiro no tiene puntos asociados registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Compact Summary */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <div className="text-lg font-bold text-green-600">{totalPointsUsed.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Usados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{totalOriginalPoints.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Originales</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{withdrawal.withdrawalPoints.length}</div>
            <div className="text-xs text-muted-foreground">Transacciones</div>
          </div>
        </div>
      </Card>

      {/* Enhanced Points List with Scroll */}
      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {withdrawal.withdrawalPoints.map((point) => (
          <Card key={point.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShowTransaction(point)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTransactionTypeBadge(point.metadata)}
                <div className="text-xs text-muted-foreground">
                  {formatDate(point.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">{point.paymentsInfo?.length || 0} pagos</div>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            {/* Large amounts display */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {point.amountUsed.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">puntos utilizados</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">
                  {point.pointsAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">puntos totales</div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="font-mono">{point.pointsTransactionId}</span>
                <span>
                  {((point.amountUsed / point.pointsAmount) * 100).toFixed(1)}% utilizado
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Usage Percentage */}
      <Card className="p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Utilización:</span>
          <span className="font-bold">
            {((totalPointsUsed / totalOriginalPoints) * 100).toFixed(1)}%
          </span>
        </div>
      </Card>

      {/* Unified Modal */}
      <UnifiedTransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        withdrawalPoint={selectedPoint}
      />
    </div>
  );
}