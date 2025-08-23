import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Banknote,
  Calendar,
  Coins,
  Eye,
  FileText,
  Hash,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { PaymentInfo, WithdrawalDetail, WithdrawalPoint } from '../../../types/withdrawals.types';
import { PaymentsInfoModal } from '../PaymentsInfoModal';
import { WithdrawalPointMetadataModal } from '../WithdrawalPointMetadataModal';

interface WithdrawalPointsBreakdownSectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalPointsBreakdownSection({ withdrawal }: WithdrawalPointsBreakdownSectionProps) {
  const [selectedPayments, setSelectedPayments] = useState<PaymentInfo[] | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<WithdrawalPoint | null>(null);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);

  const handleShowPayments = (payments: PaymentInfo[]) => {
    setSelectedPayments(payments);
    setPaymentsModalOpen(true);
  };

  const handleShowMetadata = (withdrawalPoint: WithdrawalPoint) => {
    setSelectedMetadata(withdrawalPoint);
    setMetadataModalOpen(true);
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border shadow-md bg-card hover:bg-card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 rounded-lg bg-success/10 border border-success/30">
                  <Banknote className="h-8 w-8 text-success" />
                </div>
              </div>
              <p className="text-3xl font-bold text-success">
                {totalPointsUsed.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-success/80">Puntos utilizados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-md bg-card hover:bg-card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 rounded-lg bg-info/10 border border-info/30">
                  <Coins className="h-8 w-8 text-info" />
                </div>
              </div>
              <p className="text-3xl font-bold text-info">
                {totalOriginalPoints.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-info/80">Puntos originales totales</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-md bg-card hover:bg-card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/30">
                  <Hash className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-secondary">
                {withdrawal.withdrawalPoints.length}
              </p>
              <p className="text-sm font-medium text-secondary/80">
                {withdrawal.withdrawalPoints.length === 1 ? 'Transacción' : 'Transacciones'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Cards Grid */}
      <Card className="border shadow-md">
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <span className="text-foreground">Detalle de Puntos Utilizados</span>
            <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {withdrawal.withdrawalPoints.length} {withdrawal.withdrawalPoints.length === 1 ? 'transacción' : 'transacciones'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {withdrawal.withdrawalPoints.map((point) => (
              <Card key={point.id} className="border shadow-sm hover:shadow-md transition-shadow bg-card hover:bg-card-hover">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header with ID */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/30">
                          <Hash className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-mono text-sm font-bold text-foreground">#{point.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        Punto
                      </div>
                    </div>

                    {/* Main metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-success/10 border border-success/30 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Banknote className="h-4 w-4 text-success" />
                        </div>
                        <p className="text-lg font-bold text-success">
                          {point.amountUsed.toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-success/80">Usado</p>
                      </div>
                      <div className="text-center p-3 bg-info/10 border border-info/30 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Coins className="h-4 w-4 text-info" />
                        </div>
                        <p className="text-lg font-bold text-info">
                          {point.pointsAmount.toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-info/80">Total</p>
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">ID Transacción</span>
                      </div>
                      <p className="font-mono text-xs bg-muted p-2 rounded border text-foreground">
                        {point.pointsTransactionId}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Fecha</span>
                      </div>
                      <p className="text-xs text-foreground bg-muted p-2 rounded border">
                        {formatDate(point.createdAt)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleShowPayments(point.paymentsInfo)}
                        disabled={!point.paymentsInfo || point.paymentsInfo.length === 0}
                      >
                        <Eye className="h-3 w-3" />
                        Pagos ({point.paymentsInfo?.length || 0})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => handleShowMetadata(point)}
                      >
                        <FileText className="h-3 w-3" />
                        Metadata
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Percentage */}
          <div className="mt-8 p-6 bg-accent/10 border border-accent/30 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resumen de Utilización
                </h4>
                <p className="text-sm text-accent-foreground/80">
                  Puntos utilizados vs puntos originales totales
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-3xl font-bold text-accent-foreground">
                  {totalPointsUsed.toLocaleString()} / {totalOriginalPoints.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-accent-foreground bg-accent/20 px-3 py-1 rounded-full">
                  {((totalPointsUsed / totalOriginalPoints) * 100).toFixed(1)}% utilizado
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PaymentsInfoModal
        open={paymentsModalOpen}
        onOpenChange={setPaymentsModalOpen}
        payments={selectedPayments}
      />

      <WithdrawalPointMetadataModal
        open={metadataModalOpen}
        onOpenChange={setMetadataModalOpen}
        withdrawalPoint={selectedMetadata}
      />
    </div>
  );
}