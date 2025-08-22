'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
} from 'lucide-react';
import { WithdrawalPoint } from '../../types/withdrawals.types';

interface WithdrawalPointMetadataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalPoint: WithdrawalPoint | null;
}

export function WithdrawalPointMetadataModal({
  open,
  onOpenChange,
  withdrawalPoint,
}: WithdrawalPointMetadataModalProps) {
  if (!withdrawalPoint) return null;

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

  const getTransactionTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BINARY_COMMISSION':
        return (
          <Badge className="gap-1 bg-success/10 text-success border-success/30">
            <TrendingUp className="h-3 w-3" />
            Comisión Binaria
          </Badge>
        );
      case 'DIRECT_COMMISSION':
        return (
          <Badge className="gap-1 bg-info/10 text-info border-info/30">
            <TrendingUp className="h-3 w-3" />
            Comisión Directa
          </Badge>
        );
      case 'PURCHASE':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border-warning/30">
            <DollarSign className="h-3 w-3" />
            Compra
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Hash className="h-3 w-3" />
            {type || 'Desconocido'}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return (
          <Badge className="gap-1 bg-success/10 text-success border-success/30">
            <CheckCircle className="h-3 w-3" />
            Completado
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border-warning/30">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge className="gap-1 bg-destructive/10 text-destructive border-destructive/30">
            <AlertCircle className="h-3 w-3" />
            Fallido
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Info className="h-3 w-3" />
            {status || 'Desconocido'}
          </Badge>
        );
    }
  };

  const { metadata } = withdrawalPoint;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Metadata del Punto de Retiro
            <span className="text-sm font-normal text-muted-foreground">
              ID #{withdrawalPoint.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Point Information */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Hash className="h-3 w-3 text-primary" />
                </div>
                Información Básica del Punto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    ID de Transacción de Puntos
                  </label>
                  <p className="text-base font-mono bg-muted/30 px-3 py-2 rounded">
                    {withdrawalPoint.pointsTransactionId}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Monto Utilizado en Retiro
                  </label>
                  <p className="text-lg font-bold text-primary">
                    {withdrawalPoint.amountUsed.toLocaleString()} puntos
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Total de Puntos Originales
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {withdrawalPoint.pointsAmount.toLocaleString()} puntos
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Fecha de Creación
                  </label>
                  <p className="text-base text-foreground">
                    {formatDate(withdrawalPoint.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Details */}
          {metadata && Object.keys(metadata).length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-info/10 border border-info/20">
                    <FileText className="h-3 w-3 text-info" />
                  </div>
                  Metadata Detallada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transaction Type and Status */}
                {(metadata.tipo_transaccion || metadata.estado_transaccion) && (
                  <div className="flex flex-wrap gap-3">
                    {metadata.tipo_transaccion && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Tipo de Transacción
                        </label>
                        <div>
                          {getTransactionTypeBadge(metadata.tipo_transaccion)}
                        </div>
                      </div>
                    )}
                    {metadata.estado_transaccion && (
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Estado
                        </label>
                        <div>
                          {getStatusBadge(metadata.estado_transaccion)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Amounts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metadata.monto_original && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Monto Original
                      </label>
                      <p className="text-lg font-bold text-primary">
                        {typeof metadata.monto_original === 'number'
                          ? formatCurrency(metadata.monto_original)
                          : metadata.monto_original.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {metadata.monto_usado_retiro && (
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Monto Usado en Retiro
                      </label>
                      <p className="text-lg font-bold text-warning">
                        {typeof metadata.monto_usado_retiro === 'number'
                          ? formatCurrency(metadata.monto_usado_retiro)
                          : metadata.monto_usado_retiro.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {metadata.monto_retirado_original && (
                    <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Monto Retirado Original
                      </label>
                      <p className="text-lg font-bold text-success">
                        {typeof metadata.monto_retirado_original === 'number'
                          ? formatCurrency(metadata.monto_retirado_original)
                          : metadata.monto_retirado_original.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {metadata.monto_pendiente_original && (
                    <div className="p-3 bg-info/5 border border-info/20 rounded-lg">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Monto Pendiente Original
                      </label>
                      <p className="text-lg font-bold text-info">
                        {typeof metadata.monto_pendiente_original === 'number'
                          ? formatCurrency(metadata.monto_pendiente_original)
                          : metadata.monto_pendiente_original.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Dates Section */}
                {metadata.fecha_creacion && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium text-muted-foreground">
                          Fecha de Creación de la Transacción
                        </label>
                      </div>
                      <p className="text-base text-foreground pl-6">
                        {formatDate(metadata.fecha_creacion)}
                      </p>
                    </div>
                  </>
                )}

                {/* Additional metadata fields */}
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Información Adicional
                  </h4>
                  {Object.entries(metadata)
                    .filter(([key]) => 
                      !['tipo_transaccion', 'estado_transaccion', 'monto_original', 
                        'monto_usado_retiro', 'monto_retirado_original', 
                        'monto_pendiente_original', 'fecha_creacion'].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <p className="text-sm text-foreground bg-muted/20 px-3 py-2 rounded font-mono">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Points Transaction Info */}
          {withdrawalPoint.points && (
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-base">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
                    <TrendingUp className="h-3 w-3 text-secondary" />
                  </div>
                  Información de la Transacción de Puntos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      ID de Transacción
                    </label>
                    <p className="text-base font-mono bg-muted/30 px-3 py-2 rounded">
                      {withdrawalPoint.points.transactionId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Cantidad de Puntos
                    </label>
                    <p className="text-lg font-bold text-secondary">
                      {withdrawalPoint.points.amount.toLocaleString()} puntos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}