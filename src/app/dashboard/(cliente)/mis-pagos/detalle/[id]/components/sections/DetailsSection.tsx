import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatters";
import { AlertTriangle, Calendar, Clock, User } from "lucide-react";
import { PaymentDetailResponse } from "../../actions";

interface DetailsSectionProps {
    payment: PaymentDetailResponse;
}

export function DetailsSection({ payment }: DetailsSectionProps) {
    return (
        <div className="space-y-6">
            {/* Operation Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Detalles de la Operación
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {payment.operationCode && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Código de Operación</label>
                                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{payment.operationCode}</p>
                            </div>
                        )}
                        {payment.bankName && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Banco</label>
                                <p className="text-sm">{payment.bankName}</p>
                            </div>
                        )}
                        {payment.operationDate && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Fecha de Operación</label>
                                <p className="text-sm">{formatDateTime(payment.operationDate)}</p>
                            </div>
                        )}
                        {payment.ticketNumber && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Número de Ticket</label>
                                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{payment.ticketNumber}</p>
                            </div>
                        )}
                        {payment.externalReference && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Referencia Externa</label>
                                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{payment.externalReference}</p>
                            </div>
                        )}
                        {payment.gatewayTransactionId && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">ID de Transacción del Gateway</label>
                                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{payment.gatewayTransactionId}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Review Information */}
            {(payment.reviewedByEmail || payment.reviewedAt || payment.rejectionReason) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información de Revisión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {payment.rejectionReason && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-800">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-800 dark:text-red-400">Motivo de Rechazo</h4>
                                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{payment.rejectionReason}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {payment.reviewedByEmail && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Revisado por</label>
                                    <p className="text-sm">{payment.reviewedByEmail}</p>
                                </div>
                            )}
                            {payment.reviewedAt && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Fecha de Revisión</label>
                                    <p className="text-sm">{formatDateTime(payment.reviewedAt)}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timestamps */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Fechas Importantes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                            <p className="text-sm">{formatDateTime(payment.createdAt)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                            <p className="text-sm">{formatDateTime(payment.updatedAt)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

