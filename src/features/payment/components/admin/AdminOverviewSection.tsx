import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAmount, formatDateTime, getStatusConfig } from "@/features/payment/utils/payement.utils";
import {
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Package,
    User,
    Building2,
    FileText,
    Mail,
    Phone
} from "lucide-react";
import { PaymentStatus } from "../../types/enums-payments";
import { PaymentConfig, UserInfo } from "../../types/response-payment";

interface AdminOverviewSectionProps {
    id: number;
    amount: number;
    status: PaymentStatus;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    paymentConfig: PaymentConfig
    user: UserInfo
    operationCode?: string | null;
    ticketNumber?: string | null;
    bankName?: string | null;
    operationDate?: string | null;
}

export function AdminOverviewSection({
    id,
    amount,
    status,
    paymentMethod,
    createdAt,
    updatedAt,
    paymentConfig,
    user,
    operationCode,
    ticketNumber,
    bankName,
    operationDate
}: AdminOverviewSectionProps) {
    const statusConfig = getStatusConfig(status);

    return (
        <div className="space-y-6">
            {/* Status and Amount Header */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {formatAmount(amount)}
                            </CardTitle>
                            <p className="text-muted-foreground">
                                ID del Pago: #{id}
                            </p>
                        </div>
                        <Badge
                            variant={statusConfig.variant as any}
                            className={`${statusConfig.className} text-sm px-3 py-1`}
                        >
                            {statusConfig.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Creado</div>
                            <div className="font-semibold text-sm">
                                {formatDateTime(createdAt)}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Actualizado</div>
                            <div className="font-semibold text-sm">
                                {formatDateTime(updatedAt)}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Método</div>
                            <div className="font-semibold text-sm">
                                {paymentMethod}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Tipo</div>
                            <div className="font-semibold text-sm">
                                {paymentConfig.name}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Información del Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Nombre Completo</p>
                                <p className="font-semibold text-lg">{user.fullName}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Documento</p>
                                    <p className="font-medium font-mono">{user.documentNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Información del Pago
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Método de Pago</p>
                                <p className="font-semibold">{paymentMethod}</p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Monto Total</p>
                                <p className="font-semibold text-green-700">
                                    {formatAmount(amount)}
                                </p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                <Package className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Configuración</p>
                                <p className="font-semibold">{paymentConfig.name}</p>
                                {paymentConfig.description && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {paymentConfig.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fecha de Creación</p>
                                <p className="font-semibold">{formatDateTime(createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Operation Details (if available) */}
            {(operationCode || ticketNumber || bankName) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            Detalles de Operación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {operationCode && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Código de Operación</p>
                                        <p className="font-mono text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                            {operationCode}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {ticketNumber && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20">
                                        <FileText className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Número de Ticket</p>
                                        <p className="font-mono text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                            {ticketNumber}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {bankName && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                                        <Building2 className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Banco</p>
                                        <p className="font-semibold">{bankName}</p>
                                    </div>
                                </div>
                            )}

                            {operationDate && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
                                        <Clock className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de Operación</p>
                                        <p className="font-semibold">{formatDateTime(operationDate)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}