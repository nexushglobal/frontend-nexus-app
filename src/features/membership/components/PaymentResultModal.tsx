"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    ExternalLink,
    Eye,
    RotateCcw,
    Edit3,
    Crown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";
import { PaymentResult } from "../types/membership-detail.type";

interface PaymentResponse {
    success: boolean;
    message: string;
    data?: PaymentResult;
    errors?: string;
}
interface PaymentResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: PaymentResponse | null;
    onRetry: () => void;
    onEdit: () => void;
}

export function PaymentResultModal({
    isOpen,
    onClose,
    result,
    onRetry,
    onEdit
}: PaymentResultModalProps) {
    const router = useRouter();

    if (!result) return null;

    const handleViewPayment = () => {
        if (result.data?.payment.id) {
            router.push(`/dashboard/mis-pagos/detalle/${result.data.payment.id}`);
            onClose();
        }
    };

    const handleViewMembership = () => {
        router.push('/dashboard/membresias/mi-estado');
        onClose();
    };

    const renderSuccessContent = () => {
        const { data } = result;
        if (!data) return null;

        return (
            <div className="space-y-6">
                {/* Success Header */}
                <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                        ¡Pago Procesado Exitosamente!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {data.isUpgrade
                            ? "Tu membresía ha sido actualizada correctamente"
                            : "Tu nueva membresía ha sido activada"
                        }
                    </p>
                </div>

                {/* Payment Summary */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Tipo de operación:</span>
                            <Badge variant="secondary" className="badge-success">
                                {data.isUpgrade ? "Actualización" : "Nueva Membresía"}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Monto procesado:</span>
                            <span className="font-semibold text-success">
                                {formatCurrency(data.totalAmount)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">ID de Pago:</span>
                            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                {data.payment.id}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Membership Info */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Crown className="h-5 w-5 text-primary" />
                            <span className="font-medium">Información de Membresía</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Plan:</span>
                                <span className="font-medium">{data.membership.planName}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Estado:</span>
                                <Badge variant="secondary" className="badge-success">
                                    {data.membership.status}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Válida hasta:</span>
                                <span className="text-sm">{data.membership.endDate}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={handleViewPayment}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        Ver Pago
                    </Button>

                    <Button
                        onClick={handleViewMembership}
                        className="flex items-center gap-2"
                    >
                        <Crown className="h-4 w-4" />
                        Ver Membresía
                    </Button>
                </div>

                <div className="text-center">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        );
    };

    const renderErrorContent = () => {
        return (
            <div className="space-y-6">
                {/* Error Header */}
                <div className="text-center space-y-3">
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Error al Procesar el Pago
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {result.message}
                    </p>
                </div>

                {/* Error Details */}
                {result.errors && (
                    <Card className="border-destructive/50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-destructive mb-1">
                                        Detalles del Error
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {result.errors}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={onEdit}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Edit3 className="h-4 w-4" />
                        Volver a Editar
                    </Button>

                    <Button
                        onClick={onRetry}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Volver a Intentar
                    </Button>
                </div>

                <div className="text-center">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {result.success ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-success" />
                                Pago Exitoso
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                Error en el Pago
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {result.success ? renderSuccessContent() : renderErrorContent()}
            </DialogContent>
        </Dialog>
    );
}