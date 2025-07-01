import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailResponse } from "../../actions";
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    CreditCard,
    Package,
    DollarSign,
    Receipt,
    Hash,
    Archive,
    Eye,
    Calendar
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

interface OverviewSectionProps {
    payment: PaymentDetailResponse;
}

export function OverviewSection({ payment }: OverviewSectionProps) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "APPROVED":
                return {
                    label: "Aprobado",
                    className: "bg-success text-success-foreground",
                    icon: CheckCircle,
                    color: "text-success"
                };
            case "PENDING":
                return {
                    label: "Pendiente",
                    className: "bg-warning text-warning-foreground",
                    icon: Clock,
                    color: "text-warning"
                };
            case "REJECTED":
                return {
                    label: "Rechazado",
                    className: "bg-destructive text-destructive-foreground",
                    icon: XCircle,
                    color: "text-destructive"
                };
            default:
                return {
                    label: status,
                    className: "bg-muted text-muted-foreground",
                    icon: AlertTriangle,
                    color: "text-muted-foreground"
                };
        }
    };

    const getPaymentMethodConfig = (method: string) => {
        switch (method) {
            case "POINTS":
                return {
                    label: "Puntos",
                    icon: Package,
                    color: "text-info"
                };
            case "VOUCHER":
                return {
                    label: "Comprobante",
                    icon: Receipt,
                    color: "text-success"
                };
            case "PAYMENT_GATEWAY":
                return {
                    label: "Pasarela de Pago",
                    icon: CreditCard,
                    color: "text-primary"
                };
            default:
                return {
                    label: method,
                    icon: DollarSign,
                    color: "text-muted-foreground"
                };
        }
    };

    const statusConfig = getStatusConfig(payment.status);
    const methodConfig = getPaymentMethodConfig(payment.paymentMethod);
    const StatusIcon = statusConfig.icon;
    const MethodIcon = methodConfig.icon;

    return (
        <div className="space-y-6">
            {/* Payment Status Header - Destacado */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${statusConfig.className}`}>
                                <StatusIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {payment.paymentConfig.name}
                                </h2>
                                <p className="text-muted-foreground">Pago #{payment.id}</p>
                            </div>
                        </div>
                        <Badge className={`${statusConfig.className} text-base px-4 py-2 shadow-sm`}>
                            <StatusIcon className="h-5 w-5 mr-2" />
                            {statusConfig.label}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Monto Total</p>
                            <p className="text-4xl font-bold text-primary">{formatCurrency(payment.amount)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <MethodIcon className={`h-5 w-5 ${methodConfig.color}`} />
                        </div>
                        {payment.paymentConfig.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground ml-11">
                        {payment.paymentConfig.description}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MethodIcon className={`field-icon ${methodConfig.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="section-title">Método de Pago</p>
                                <p className="text-sm font-medium text-foreground">
                                    {methodConfig.label}
                                </p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-info/10">
                                <Calendar className="field-icon text-info" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="section-title">Fecha de Creación</p>
                                <p className="text-sm font-medium text-foreground">
                                    {formatDateTime(payment.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-warning/10">
                                {payment.isArchived ? (
                                    <Archive className="field-icon text-warning" />
                                ) : (
                                    <Eye className="field-icon text-success" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="section-title">Estado</p>
                                <p className={`text-sm font-medium ${payment.isArchived ? 'text-warning' : 'text-success'}`}>
                                    {payment.isArchived ? 'Archivado' : 'Activo'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}