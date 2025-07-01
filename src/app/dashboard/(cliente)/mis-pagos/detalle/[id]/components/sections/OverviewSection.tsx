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
    Receipt
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
                    variant: "default" as const,
                    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
                    icon: CheckCircle,
                };
            case "PENDING":
                return {
                    label: "Pendiente",
                    variant: "secondary" as const,
                    className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
                    icon: Clock,
                };
            case "REJECTED":
                return {
                    label: "Rechazado",
                    variant: "destructive" as const,
                    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
                    icon: XCircle,
                };
            default:
                return {
                    label: status,
                    variant: "outline" as const,
                    className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
                    icon: AlertTriangle,
                };
        }
    };

    const getPaymentMethodConfig = (method: string) => {
        switch (method) {
            case "POINTS":
                return {
                    label: "Puntos",
                    icon: Package,
                    className: "text-blue-600 dark:text-blue-400",
                };
            case "VOUCHER":
                return {
                    label: "Comprobante",
                    icon: Receipt,
                    className: "text-green-600 dark:text-green-400",
                };
            case "PAYMENT_GATEWAY":
                return {
                    label: "Pasarela de Pago",
                    icon: CreditCard,
                    className: "text-purple-600 dark:text-purple-400",
                };
            default:
                return {
                    label: method,
                    icon: DollarSign,
                    className: "text-gray-600 dark:text-gray-400",
                };
        }
    };

    const statusConfig = getStatusConfig(payment.status);
    const methodConfig = getPaymentMethodConfig(payment.paymentMethod);
    const StatusIcon = statusConfig.icon;
    const MethodIcon = methodConfig.icon;

    return (
        <div className="space-y-6">
            {/* Payment Header */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <MethodIcon className={`h-6 w-6 ${methodConfig.className}`} />
                                {payment.paymentConfig.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {payment.paymentConfig.description}
                            </p>
                        </div>
                        <Badge className={statusConfig.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Monto</p>
                            <p className="text-lg font-semibold">{formatCurrency(payment.amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Método</p>
                            <p className="text-lg font-medium">{methodConfig.label}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Creado</p>
                            <p className="text-lg font-medium">{formatDateTime(payment.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Items</p>
                            <p className="text-lg font-semibold">{payment.items.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Config Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Información del Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">ID del Pago</label>
                            <p className="font-mono text-sm bg-muted px-2 py-1 rounded">#{payment.id}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Código de Configuración</label>
                            <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{payment.paymentConfig.code}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Entidad Relacionada</label>
                            <p className="text-sm">{payment.relatedEntityType} #{payment.relatedEntityId}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Archivado</label>
                            <p className="text-sm">{payment.isArchived ? "Sí" : "No"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}