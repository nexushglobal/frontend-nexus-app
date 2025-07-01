import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/formatters";
import {
    AlertTriangle,
    Calendar,
    Clock,
    User,
    FileText,
    CreditCard,
    Hash,
    Building2,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { PaymentDetailResponse } from "../../actions";

interface DetailsSectionProps {
    payment: PaymentDetailResponse;
}

export function DetailsSection({ payment }: DetailsSectionProps) {
    return (
        <div className="space-y-6">
            {/* Operation Details */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3 text-card-foreground">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        Detalles de la Operación
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {payment.operationCode && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <Hash className="field-icon text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Código de Operación</p>
                                    <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                        {payment.operationCode}
                                    </p>
                                </div>
                            </div>
                        )}

                        {payment.bankName && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-secondary/10">
                                    <Building2 className="field-icon text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Banco</p>
                                    <p className="text-sm font-medium text-foreground">{payment.bankName}</p>
                                </div>
                            </div>
                        )}

                        {payment.operationDate && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-info/10">
                                    <Calendar className="field-icon text-info" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Fecha de Operación</p>
                                    <p className="text-sm font-medium text-foreground">{formatDateTime(payment.operationDate)}</p>
                                </div>
                            </div>
                        )}

                        {payment.ticketNumber && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-warning/10">
                                    <FileText className="field-icon text-warning" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Número de Ticket</p>
                                    <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                        {payment.ticketNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {payment.externalReference && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <CreditCard className="field-icon text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Referencia Externa</p>
                                    <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                        {payment.externalReference}
                                    </p>
                                </div>
                            </div>
                        )}

                        {payment.gatewayTransactionId && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <Hash className="field-icon text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">ID de Transacción del Gateway</p>
                                    <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                        {payment.gatewayTransactionId}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Review Information */}
            {(payment.reviewedByEmail || payment.reviewedAt || payment.rejectionReason) && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-3 text-card-foreground">
                            <div className={`p-2 rounded-lg ${payment.rejectionReason ? 'bg-destructive/10' : 'bg-success/10'}`}>
                                {payment.rejectionReason ? (
                                    <XCircle className="h-5 w-5 text-destructive" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-success" />
                                )}
                            </div>
                            Información de Revisión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {payment.rejectionReason && (
                            <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-destructive mb-2">Motivo de Rechazo</h4>
                                        <p className="text-sm text-destructive/80 leading-relaxed">
                                            {payment.rejectionReason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {payment.reviewedByEmail && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <User className="field-icon text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="section-title">Revisado por</p>
                                        <p className="text-sm font-medium text-foreground">{payment.reviewedByEmail}</p>
                                    </div>
                                </div>
                            )}

                            {payment.reviewedAt && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-info/10">
                                        <Clock className="field-icon text-info" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="section-title">Fecha de Revisión</p>
                                        <p className="text-sm font-medium text-foreground">{formatDateTime(payment.reviewedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timestamps */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3 text-card-foreground">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <Calendar className="h-5 w-5 text-accent" />
                        </div>
                        Fechas Importantes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-success/10">
                                <Clock className="field-icon text-success" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="section-title">Fecha de Creación</p>
                                <p className="text-sm font-medium text-foreground">{formatDateTime(payment.createdAt)}</p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Clock className="field-icon text-warning" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="section-title">Última Actualización</p>
                                <p className="text-sm font-medium text-foreground">{formatDateTime(payment.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}