'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { PaymentGatewayComponent } from '@/features/membership/components/PaymentGatewayComponent';
import { VoucherPaymentModal } from '@/features/membership/components/VoucherPaymentModal';
import {
  Payment,
  PaymentMethod,
} from '@/features/membership/types/membership-detail.type';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  Plus,
  Receipt,
  Trash2,
  Zap,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

export interface PaymentResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string;
}

export interface BasePaymentSheetProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  totalAmount: number;
  amountLabel: string;
  summaryContent: ReactNode;
  onSubmit: (formData: FormData) => Promise<PaymentResponse<T>>;
  onSuccess?: (result: T) => void;
  PaymentResultModal: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    result: PaymentResponse<T> | null;
    onRetry: () => void;
    onEdit: () => void;
  }>;
}

export function BasePaymentSheet<T = any>({
  isOpen,
  onClose,
  title,
  totalAmount,
  amountLabel,
  summaryContent,
  onSubmit,
  onSuccess,
  PaymentResultModal,
}: BasePaymentSheetProps<T>) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.VOUCHER,
  );
  const [payments, setPayments] = useState<Payment[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse<T> | null>(
    null,
  );
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  const paymentsTotal = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const remainingAmount = totalAmount - paymentsTotal;

  const handleAddPayment = (payment: Payment, file: File) => {
    setPayments((prev) => [...prev, { ...payment, fileIndex: files.length }]);
    setFiles((prev) => [...prev, file]);
  };

  const handleEditPayment = (index: number, payment: Payment, file?: File) => {
    setPayments((prev) => prev.map((p, i) => (i === index ? payment : p)));
    if (file) {
      setFiles((prev) => prev.map((f, i) => (i === index ? file : f)));
    }
  };

  const handleRemovePayment = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (remainingAmount > 0 && selectedMethod === PaymentMethod.VOUCHER) {
      alert('El monto total de los pagos debe cubrir el costo total');
      return;
    }

    if (selectedMethod === PaymentMethod.PAYMENT_GATEWAY && !selectedCardId) {
      alert('Debes seleccionar una tarjeta de crédito');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('paymentMethod', selectedMethod);

      // Solo agregar campos de voucher si el método es VOUCHER
      if (selectedMethod === PaymentMethod.VOUCHER) {
        formData.append('payments', JSON.stringify(payments));
        files.forEach((file) => {
          formData.append(`paymentImages`, file);
        });
      }

      // Solo agregar source_id si el método es PAYMENT_GATEWAY
      if (selectedMethod === PaymentMethod.PAYMENT_GATEWAY) {
        formData.append('source_id', selectedCardId);
      }

      const result = await onSubmit(formData);

      setPaymentResult(result);
      setShowResultModal(true);

      if (result.success && result.data && onSuccess) {
        onSuccess(result.data);
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        message: 'Error inesperado',
        errors: error instanceof Error ? error.message : 'Unknown error',
      });
      setShowResultModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPayments([]);
    setFiles([]);
    setSelectedMethod(PaymentMethod.VOUCHER);
    setSelectedCardId('');
    setPaymentResult(null);
  };

  const handleClose = () => {
    if (!isProcessing) {
      resetForm();
      onClose();
    }
  };

  const canSubmit =
    selectedMethod === PaymentMethod.VOUCHER
      ? remainingAmount <= 0
      : selectedMethod === PaymentMethod.PAYMENT_GATEWAY
      ? !!selectedCardId
      : false;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent
          className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto p-0"
          side="right"
        >
          <SheetHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              {title}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 px-6 py-6 space-y-6">
            {/* Summary Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    Resumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {summaryContent}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {amountLabel}:
                    </span>
                    <span className="font-semibold text-primary text-lg">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Status - Solo para voucher */}
              {selectedMethod === PaymentMethod.VOUCHER && (
                <Card className="border-success/20 bg-success/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      Estado del Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total requerido:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total agregado:
                      </span>
                      <span
                        className={`font-semibold ${
                          paymentsTotal >= totalAmount
                            ? 'text-success'
                            : 'text-warning'
                        }`}
                      >
                        {formatCurrency(paymentsTotal)}
                      </span>
                    </div>
                    {remainingAmount > 0 && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          Monto faltante:
                        </span>
                        <span className="font-semibold text-warning">
                          {formatCurrency(remainingAmount)}
                        </span>
                      </div>
                    )}
                    {remainingAmount <= 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-success/20">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success font-medium">
                          Monto completo
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={(value) =>
                    setSelectedMethod(value as PaymentMethod)
                  }
                  className="space-y-4"
                >
                  <div className="grid gap-4">
                    {/* Voucher Option */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={PaymentMethod.VOUCHER}
                          id="voucher"
                        />
                        <Label
                          htmlFor="voucher"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Voucher</div>
                            <div className="text-xs text-muted-foreground">
                              Subir comprobante de transferencia bancaria
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Points Option - Disabled */}
                    <div className="border rounded-lg p-4 opacity-50 bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={PaymentMethod.POINTS}
                          id="points"
                          disabled
                        />
                        <Label
                          htmlFor="points"
                          className="flex items-center gap-2 cursor-not-allowed flex-1"
                        >
                          <Zap className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Puntos</div>
                            <div className="text-xs text-muted-foreground">
                              Próximamente
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Gateway Option - Now enabled */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={PaymentMethod.PAYMENT_GATEWAY}
                          id="gateway"
                        />
                        <Label
                          htmlFor="gateway"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <CreditCard className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Pasarela</div>
                            <div className="text-xs text-muted-foreground">
                              Pago con tarjeta de crédito/débito
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method Content */}
            {selectedMethod === PaymentMethod.VOUCHER && (
              <>
                {/* Payment List */}
                {payments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Pagos Agregados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {payments.map((payment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">
                                {payment.bankName} -{' '}
                                {payment.transactionReference}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {payment.transactionDate} •{' '}
                                {formatCurrency(payment.amount)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowVoucherModal(true);
                                  // Set edit mode data here if needed
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePayment(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Add Payment Button */}
                {remainingAmount > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setShowVoucherModal(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Pago
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Payment Gateway Content */}
            {selectedMethod === PaymentMethod.PAYMENT_GATEWAY && (
              <PaymentGatewayComponent
                onCardSelect={setSelectedCardId}
                selectedCardId={selectedCardId}
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isProcessing}
                size="lg"
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {selectedMethod === PaymentMethod.VOUCHER
                      ? 'Enviar Pagos'
                      : 'Procesar Pago'}
                  </>
                )}
              </Button>
            </div>

            {/* Warning Messages */}
            {selectedMethod === PaymentMethod.VOUCHER &&
              remainingAmount > 0 && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning">
                    Debes agregar pagos que cubran el monto total de{' '}
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              )}

            {selectedMethod === PaymentMethod.PAYMENT_GATEWAY &&
              !selectedCardId && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning">
                    Debes seleccionar una tarjeta para proceder con el pago
                  </span>
                </div>
              )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Voucher Modal */}
      <VoucherPaymentModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        onAddPayment={handleAddPayment}
        maxAmount={remainingAmount}
      />

      {/* Payment Result Modal */}
      <PaymentResultModal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          if (paymentResult?.success) {
            handleClose();
          }
        }}
        result={paymentResult}
        onRetry={() => setShowResultModal(false)}
        onEdit={() => {
          setShowResultModal(false);
          // Keep the sheet open for editing
        }}
      />
    </>
  );
}
