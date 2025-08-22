import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Banknote,
  Calendar,
  Coins,
  Eye,
  FileText,
  Hash,
  PieChart,
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
        <Card className="border shadow-sm bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Banknote className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {totalPointsUsed.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Puntos utilizados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-info/5">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Coins className="h-8 w-8 text-info" />
              </div>
              <p className="text-3xl font-bold text-info">
                {totalOriginalPoints.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Puntos originales totales</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-secondary/5">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Hash className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-secondary">
                {withdrawal.withdrawalPoints.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {withdrawal.withdrawalPoints.length === 1 ? 'Transacción' : 'Transacciones'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            Detalle de Puntos Utilizados
            <span className="text-sm font-normal text-muted-foreground">
              ({withdrawal.withdrawalPoints.length} {withdrawal.withdrawalPoints.length === 1 ? 'transacción' : 'transacciones'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      Monto Usado
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Puntos Totales
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      ID Transacción
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Fecha
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Pagos
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Metadata
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawal.withdrawalPoints.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell className="font-medium">
                      <span className="font-mono text-sm">#{point.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">
                          {point.amountUsed.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">puntos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {point.pointsAmount.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">puntos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {point.pointsTransactionId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDate(point.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShowPayments(point.paymentsInfo)}
                        disabled={!point.paymentsInfo || point.paymentsInfo.length === 0}
                      >
                        <Eye className="h-3 w-3" />
                        Ver ({point.paymentsInfo?.length || 0})
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleShowMetadata(point)}
                      >
                        <FileText className="h-3 w-3" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Usage Percentage */}
          <div className="mt-6 p-4 bg-muted/20 border border-muted/30 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Resumen de Utilización
                </h4>
                <p className="text-xs text-muted-foreground">
                  Puntos utilizados vs puntos originales totales
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {totalPointsUsed.toLocaleString()} / {totalOriginalPoints.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
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