"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatus } from "@/features/payment/types/enums-payments";
import { PaymentAdminDetailResponse } from "@/features/payment/types/response-payment";
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentActionResultModal } from "./modals/PaymentActionResultModal";
import { PaymentApprovalModal } from "./modals/PaymentApprovalModal";
import { PaymentCompleteModal } from "./modals/PaymentCompleteModal";
import { PaymentRejectionModal } from "./modals/PaymentRejectionModal";


interface PaymentAdminActionsProps {
    payment: PaymentAdminDetailResponse;
    onPaymentUpdate: () => void;
}

export function PaymentAdminActions({ payment, onPaymentUpdate }: PaymentAdminActionsProps) {
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | 'complete'>('approve');

    const handleActionSuccess = (data: any, action: 'approve' | 'reject' | 'complete') => {
        setResultData({ success: true, message: "Operación exitosa", data });
        setCurrentAction(action);
        setShowResultModal(true);
        onPaymentUpdate();
    };

    const handleCompletePayment = () => {
        if (payment.status === PaymentStatus.APPROVED || payment.status === PaymentStatus.COMPLETED) {
            setShowCompleteModal(true);
        }
    };

    const handleCompleteSuccess = (data: any) => {
        // For complete action, just show a toast instead of modal
        toast.success("Información actualizada correctamente");
        onPaymentUpdate();
    };

    const getStatusBadge = () => {
        switch (payment.status) {
            case PaymentStatus.PENDING:
                return (
                    <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                    </Badge>
                );
            case PaymentStatus.APPROVED:
                return (
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprobado
                    </Badge>
                );
            case PaymentStatus.REJECTED:
                return (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Rechazado
                    </Badge>
                );
            case PaymentStatus.COMPLETED:
                return (
                    <Badge variant="secondary" className="bg-info/10 text-info border-info/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completado
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        {payment.status}
                    </Badge>
                );
        }
    };

    const renderActionButtons = () => {
        switch (payment.status) {
            case PaymentStatus.PENDING:
                return (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowApprovalModal(true)}
                            className="flex-1"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                        </Button>
                        <Button
                            onClick={() => setShowRejectionModal(true)}
                            variant="destructive"
                            className="flex-1"
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Rechazar
                        </Button>
                    </div>
                );

            case PaymentStatus.APPROVED:
            case PaymentStatus.COMPLETED:
                return (
                    <Button
                        onClick={handleCompletePayment}
                        className="w-full"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar Información
                    </Button>
                );

            case PaymentStatus.REJECTED:
                return (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Este pago ha sido rechazado y no se pueden realizar acciones
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Acciones de Administrador
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado actual:</span>
                        {getStatusBadge()}
                    </div>

                    {renderActionButtons()}
                </CardContent>
            </Card>

            {/* Modals */}
            <PaymentApprovalModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onSuccess={(data) => handleActionSuccess(data, 'approve')}
                paymentId={payment.id.toString()}
            />

            <PaymentRejectionModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                onSuccess={(data) => handleActionSuccess(data, 'reject')}
                paymentId={payment.id.toString()}
            />

            <PaymentCompleteModal
                isOpen={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                onSuccess={handleCompleteSuccess}
                paymentId={payment.id.toString()}
            />

            <PaymentActionResultModal
                isOpen={showResultModal}
                onClose={() => setShowResultModal(false)}
                result={resultData}
                action={currentAction}
            />
        </>
    );
}