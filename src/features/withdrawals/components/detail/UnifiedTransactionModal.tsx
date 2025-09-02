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
  CreditCard,
  Receipt,
  Tag,
  Database,
} from 'lucide-react';
import { WithdrawalPoint, PaymentInfo } from '../../types/withdrawals.types';
import Link from 'next/link';

interface UnifiedTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  withdrawalPoint: WithdrawalPoint | null;
}

export function UnifiedTransactionModal({
  open,
  onOpenChange,
  withdrawalPoint,
}: UnifiedTransactionModalProps) {
  if (!withdrawalPoint) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
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
            {type || 'Transacción'}
          </Badge>
        );
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'VOUCHER':
        return (
          <Badge className="gap-1 bg-info/10 text-info border-info/30">
            <Receipt className="h-3 w-3" />
            Voucher
          </Badge>
        );
      case 'POINTS':
        return (
          <Badge className="gap-1 bg-warning/10 text-warning border-warning/30">
            <Tag className="h-3 w-3" />
            Puntos
          </Badge>
        );
      case 'CARD':
        return (
          <Badge className="gap-1 bg-success/10 text-success border-success/30">
            <CreditCard className="h-3 w-3" />
            Tarjeta
          </Badge>
        );
      case 'BANK_TRANSFER':
        return (
          <Badge className="gap-1 bg-secondary/10 text-secondary border-secondary/30">
            <CreditCard className="h-3 w-3" />
            Transferencia
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <DollarSign className="h-3 w-3" />
            {method}
          </Badge>
        );
    }
  };

  const { metadata, paymentsInfo } = withdrawalPoint;
  const totalPaymentAmount = paymentsInfo?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <FileText className="h-5 w-5" />
            Detalle de Transacción #{withdrawalPoint.id}
            {metadata?.tipo_transaccion && getTransactionTypeBadge(metadata.tipo_transaccion)}
            <span className="text-sm font-normal text-muted-foreground">
              {formatDate(withdrawalPoint.createdAt)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Summary */}
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">{withdrawalPoint.amountUsed.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Puntos usados</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{withdrawalPoint.pointsAmount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Puntos originales</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{paymentsInfo?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Pagos asociados</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{formatAmount(totalPaymentAmount)}</div>
                <div className="text-xs text-muted-foreground">Total pagos</div>
              </div>
            </div>
          </Card>

          {/* Metadata Only */}
          {metadata && Object.keys(metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Conceptos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metadata)
                  .filter(([key]) => !['tipo_transaccion'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      {/* Main concept */}
                      <div className="flex justify-between items-start text-sm">
                        <span className="text-muted-foreground font-medium">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        </span>
                        {typeof value !== 'object' ? (
                          <span className="font-medium text-right max-w-[60%] break-words">
                            {String(value || 'N/A')}
                          </span>
                        ) : null}
                      </div>
                      
                      {/* Nested concepts if value is an object */}
                      {typeof value === 'object' && value !== null && (
                        <div className="ml-4 pl-3 border-l-2 border-muted space-y-1">
                          {Object.entries(value).map(([nestedKey, nestedValue]) => (
                            <div key={`${key}-${nestedKey}`} className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                {nestedKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </span>
                              <span className="font-medium text-right max-w-[50%] break-words">
                                {typeof nestedValue === 'object' 
                                  ? JSON.stringify(nestedValue) 
                                  : String(nestedValue || 'N/A')
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Payments Section */}
          <div>
            {!paymentsInfo || paymentsInfo.length === 0 ? (
              <Card className="p-6">
                <div className="text-center text-muted-foreground">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No hay pagos asociados</div>
                </div>
              </Card>
            ) : (
              <>
                {/* Compact Summary with Payment Methods */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {formatAmount(totalPaymentAmount)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {paymentsInfo.length} transacciones
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['VOUCHER', 'POINTS', 'CARD', 'BANK_TRANSFER'].map((method) => {
                        const methodPayments = paymentsInfo.filter(
                          (p) => p.paymentMethod.toUpperCase() === method
                        );
                        if (methodPayments.length === 0) return null;

                        const methodTotal = methodPayments.reduce(
                          (sum, p) => sum + p.amount,
                          0
                        );

                        return (
                          <div
                            key={method}
                            className="px-3 py-1 bg-muted/50 rounded-md text-xs"
                          >
                            <div className="flex items-center gap-1">
                              {getPaymentMethodBadge(method)}
                              <span className="font-mono text-muted-foreground">
                                {formatAmount(methodTotal)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Compact Payments List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Detalle de Transacciones
                  </h4>
                  {paymentsInfo.map((payment, index) => (
                    <Link 
                      key={`${payment.paymentId}-${index}`}
                      href={`/dashboard/fac-pagos/detalle/${payment.paymentId}`}
                    >
                      <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-medium">
                              #{payment.paymentId}
                            </span>
                            {getPaymentMethodBadge(payment.paymentMethod)}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              {formatAmount(payment.amount)}
                            </div>
                          </div>
                        </div>
                        
                        {(payment.operationCode || payment.ticketNumber) && (
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {payment.operationCode && (
                              <div>
                                <span>Cód. Op: </span>
                                <span className="font-mono">{payment.operationCode}</span>
                              </div>
                            )}
                            {payment.ticketNumber && (
                              <div>
                                <span>Ticket: </span>
                                <span className="font-mono">{payment.ticketNumber}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}