"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    Upload,
    X,
    Zap
} from "lucide-react";
import { useState } from "react";
import {
    MembershipPlan,
    UserMembership,
    PaymentMethod,
    Payment,
    PaymentResult
} from "@/features/membership/types/membership-detail.type";
import { subscribeToPlanAction } from "../actions/suscription-to-plan";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";
import { VoucherPaymentModal } from "./VoucherPaymentModal";
import { PaymentResultModal } from "./PaymentResultModal";


interface PaymentSubscriptionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    plan: MembershipPlan;
    userMembership: UserMembership;
}

interface PaymentResponse {
    success: boolean;
    message: string;
    data?: PaymentResult;
    errors?: string;
}

export function PaymentSubscriptionSheet({
    isOpen,
    onClose,
    plan,
    userMembership
}: PaymentSubscriptionSheetProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.VOUCHER);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);

    const totalAmount = plan.upgradeCost !== undefined ? plan.upgradeCost : plan.price;
    const paymentsTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = totalAmount - paymentsTotal;

    const handleAddPayment = (payment: Payment, file: File) => {
        setPayments(prev => [...prev, { ...payment, fileIndex: files.length }]);
        setFiles(prev => [...prev, file]);
    };

    const handleEditPayment = (index: number, payment: Payment, file?: File) => {
        setPayments(prev => prev.map((p, i) => i === index ? payment : p));
        if (file) {
            setFiles(prev => prev.map((f, i) => i === index ? file : f));
        }
    };

    const handleRemovePayment = (index: number) => {
        const payment = payments[index];
        setPayments(prev => prev.filter((_, i) => i !== index));
        setFiles(prev => prev.filter((_, i) => i !== payment.fileIndex));
    };

    const canSubmit = () => {
        return selectedMethod === PaymentMethod.VOUCHER &&
            payments.length > 0 &&
            Math.abs(paymentsTotal - totalAmount) < 0.01;
    };

    const handleSubmit = async () => {
        if (!canSubmit()) return;

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('planId', plan.id.toString());
            formData.append('paymentMethod', selectedMethod);
            formData.append('payments', JSON.stringify(payments));

            files.forEach((file, index) => {
                formData.append('paymentImages', file);
            });

            const result = await subscribeToPlanAction(formData);
            setPaymentResult(result as PaymentResponse);
            setShowResultModal(true);
        } catch (error) {
            setPaymentResult({
                success: false,
                message: "Error inesperado al procesar el pago",
                errors: error instanceof Error ? error.message : "Unknown error"
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
        setPaymentResult(null);
    };

    const handleClose = () => {
        if (!isProcessing) {
            resetForm();
            onClose();
        }
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={handleClose}>
                <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto p-0" side="right">
                    <SheetHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SheetTitle className="flex items-center gap-2 text-lg">
                            <CreditCard className="h-5 w-5" />
                            Procesar Pago - Plan {plan.name}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 px-6 py-6 space-y-6">
                        {/* Plan Summary */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-primary" />
                                        Resumen del Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Plan:</span>
                                        <span className="font-medium">{plan.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            {plan.isUpgrade ? "Costo de actualización:" : "Precio:"}
                                        </span>
                                        <span className="font-semibold text-primary text-lg">
                                            {formatCurrency(totalAmount)}
                                        </span>
                                    </div>
                                    {userMembership.hasMembership && (
                                        <div className="pt-2 border-t border-primary/20">
                                            <div className="text-xs text-muted-foreground">
                                                Plan actual: {userMembership.plan?.name} • {formatCurrency(userMembership.plan?.price || 0)}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Status */}
                            <Card className="border-success/20 bg-success/5 ">
                                <CardHeader >
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-success" />
                                        Estado del Pago
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total requerido:</span>
                                        <span className="font-medium">{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total agregado:</span>
                                        <span className={`font-semibold ${paymentsTotal >= totalAmount ? 'text-success' : 'text-warning'}`}>
                                            {formatCurrency(paymentsTotal)}
                                        </span>
                                    </div>
                                    {remainingAmount > 0.01 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Faltante:</span>
                                            <span className="font-medium text-destructive">
                                                {formatCurrency(remainingAmount)}
                                            </span>
                                        </div>
                                    )}
                                    {Math.abs(remainingAmount) <= 0.01 && paymentsTotal > 0 && (
                                        <div className="flex items-center gap-2 text-success text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Monto completo
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Method Selection */}
                        <Card>
                            <CardHeader >
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Método de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent >
                                <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        {/* Voucher Option - Active */}
                                        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedMethod === PaymentMethod.VOUCHER ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value={PaymentMethod.VOUCHER} id="voucher" />
                                                <Label htmlFor="voucher" className="flex items-center gap-2 cursor-pointer flex-1">
                                                    <Receipt className="h-4 w-4" />
                                                    <div>
                                                        <div className="font-medium">Voucher</div>
                                                        <div className="text-xs text-muted-foreground">Comprobante de pago</div>
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>

                                        {/* Points Option - Disabled */}
                                        <div className="border rounded-lg p-4 opacity-50 bg-muted/30">
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value={PaymentMethod.POINTS} id="points" disabled />
                                                <Label htmlFor="points" className="flex items-center gap-2 cursor-not-allowed flex-1">
                                                    <Zap className="h-4 w-4" />
                                                    <div>
                                                        <div className="font-medium">Puntos</div>
                                                        <div className="text-xs text-muted-foreground">Próximamente</div>
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>

                                        {/* Gateway Option - Disabled */}
                                        <div className="border rounded-lg p-4 opacity-50 bg-muted/30">
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value={PaymentMethod.PAYMENT_GATEWAY} id="gateway" disabled />
                                                <Label htmlFor="gateway" className="flex items-center gap-2 cursor-not-allowed flex-1">
                                                    <CreditCard className="h-4 w-4" />
                                                    <div>
                                                        <div className="font-medium">Pasarela</div>
                                                        <div className="text-xs text-muted-foreground">Próximamente</div>
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Voucher Payments Section */}
                        {selectedMethod === PaymentMethod.VOUCHER && (
                            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Receipt className="h-4 w-4 text-blue-600" />
                                        Comprobantes de Pago
                                        {payments.length > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {payments.length}/5
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <Button
                                        onClick={() => setShowVoucherModal(true)}
                                        size="sm"
                                        disabled={payments.length >= 5}
                                        className="shrink-0"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Payments List */}
                                    {payments.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                                <FileText className="h-8 w-8 opacity-50" />
                                            </div>
                                            <p className="text-sm font-medium mb-1">No hay comprobantes agregados</p>
                                            <p className="text-xs">Haz clic en "Agregar" para subir tus comprobantes</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {payments.map((payment, index) => (
                                                <div key={index} className="border rounded-lg p-4 bg-background/80 backdrop-blur-sm">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2 flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-2 w-2 rounded-full bg-success"></div>
                                                                <div className="font-semibold text-lg text-success">
                                                                    {formatCurrency(payment.amount)}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground space-y-1">
                                                                {payment.bankName && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium">Banco:</span>
                                                                        <span>{payment.bankName}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">Referencia:</span>
                                                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                                                        {payment.transactionReference}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">Fecha:</span>
                                                                    <span>{payment.transactionDate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0">
                                                            <Button
                                                                onClick={() => {
                                                                    // TODO: Implement edit functionality
                                                                }}
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                Editar
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleRemovePayment(index)}
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Validation Messages */}
                                    <div className="space-y-2">
                                        {payments.length >= 5 && (
                                            <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 rounded-lg p-3">
                                                <AlertCircle className="h-4 w-4" />
                                                Máximo 5 comprobantes permitidos
                                            </div>
                                        )}

                                        {Math.abs(remainingAmount) > 0.01 && payments.length > 0 && (
                                            <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 rounded-lg p-3">
                                                <AlertCircle className="h-4 w-4" />
                                                El total debe coincidir exactamente con el monto requerido
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Empty state for other payment methods */}
                        {selectedMethod !== PaymentMethod.VOUCHER && (
                            <Card className="border-dashed border-muted-foreground/25">
                                <CardContent className="pt-6">
                                    <div className="text-center py-12 text-muted-foreground">
                                        <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                            <CreditCard className="h-8 w-8 opacity-50" />
                                        </div>
                                        <p className="text-sm font-medium mb-1">Método de pago próximamente disponible</p>
                                        <p className="text-xs">Selecciona "Voucher" para proceder con comprobantes de pago</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Footer with Action Buttons */}
                    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
                        <div className="flex gap-3">
                            <Button
                                onClick={handleClose}
                                variant="outline"
                                className="flex-1"
                                disabled={isProcessing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit() || isProcessing}
                                className="flex-1"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirmar Pago • {formatCurrency(totalAmount)}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Voucher Modal */}
            <VoucherPaymentModal
                isOpen={showVoucherModal}
                onClose={() => setShowVoucherModal(false)}
                onAddPayment={handleAddPayment}
                maxAmount={remainingAmount > 0 ? remainingAmount : totalAmount}
            />

            {/* Result Modal */}
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