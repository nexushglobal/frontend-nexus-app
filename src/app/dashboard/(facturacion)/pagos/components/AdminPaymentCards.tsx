// src/app/dashboard/(facturacion)/pagos/components/AdminPaymentCards.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AdminPaymentResponse, PaymentMethod, PaymentStatus } from '@/types/admin-payments.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Eye,
    Package,
    Receipt,
    User,
    Wallet,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
    data: AdminPaymentResponse[];
};

const AdminPaymentCards = ({ data }: Props) => {
    const router = useRouter();

    const formatDate = (dateString: string | Date) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    };

    const formatTime = (dateString: string | Date) => {
        return format(new Date(dateString), 'HH:mm', { locale: es });
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const getStatusConfig = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PENDING:
                return {
                    label: 'Pendiente',
                    className: 'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
                    icon: Clock
                };
            case PaymentStatus.APPROVED:
                return {
                    label: 'Aprobado',
                    className: 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300',
                    icon: CheckCircle
                };
            case PaymentStatus.REJECTED:
                return {
                    label: 'Rechazado',
                    className: 'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300',
                    icon: XCircle
                };
            case PaymentStatus.COMPLETED:
                return {
                    label: 'Completado',
                    className: 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
                    icon: CheckCircle
                };
            default:
                return {
                    label: 'Desconocido',
                    className: 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
                    icon: AlertCircle
                };
        }
    };

    const getPaymentMethodConfig = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.VOUCHER:
                return {
                    label: 'Voucher',
                    icon: Receipt,
                    className: 'text-purple-600 dark:text-purple-400'
                };
            case PaymentMethod.POINTS:
                return {
                    label: 'Puntos',
                    icon: Package,
                    className: 'text-orange-600 dark:text-orange-400'
                };
            case PaymentMethod.PAYMENT_GATEWAY:
                return {
                    label: 'Pasarela de Pago',
                    icon: CreditCard,
                    className: 'text-blue-600 dark:text-blue-400'
                };
            default:
                return {
                    label: 'Desconocido',
                    icon: AlertCircle,
                    className: 'text-gray-600 dark:text-gray-400'
                };
        }
    };

    const handleViewDetail = (paymentId: number) => {
        router.push(`/dashboard/pagos/${paymentId}`);
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                    <Package className="h-12 w-12 mx-auto mb-2" />
                    <p>No se encontraron pagos</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((payment) => {
                const statusConfig = getStatusConfig(payment.status);
                const paymentMethodConfig = getPaymentMethodConfig(payment.paymentMethod);
                const StatusIcon = statusConfig.icon;
                const PaymentMethodIcon = paymentMethodConfig.icon;

                return (
                    <Card key={payment.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            {/* Header con ID y Estado */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-gray-500">
                                        #{payment.id}
                                    </span>
                                </div>
                                <Badge className={statusConfig.className}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                </Badge>
                            </div>

                            {/* Información del Usuario */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">
                                        {payment.user.fullName}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {payment.user.email}
                                    </div>
                                    {payment.user.documentNumber && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Doc: {payment.user.documentNumber}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Monto */}
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                                    {formatAmount(payment.amount)}
                                </span>
                            </div>

                            {/* Método de Pago y Configuración */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Método de Pago
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PaymentMethodIcon className={`h-4 w-4 ${paymentMethodConfig.className}`} />
                                        <span className="text-sm font-medium">
                                            {paymentMethodConfig.label}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Configuración
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <div className="text-sm font-medium">
                                                {payment.paymentConfig.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                {payment.paymentConfig.code}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Códigos de Operación y Ticket */}
                            {(payment.operationCode || payment.ticketNumber) && (
                                <div className="grid grid-cols-1 gap-2 mb-3">
                                    {payment.operationCode && (
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Código de Operación
                                            </div>
                                            <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {payment.operationCode}
                                            </span>
                                        </div>
                                    )}
                                    {payment.ticketNumber && (
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                Número de Ticket
                                            </div>
                                            <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {payment.ticketNumber}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fechas */}
                            <div className="grid grid-cols-1 gap-2 mb-3">
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Fecha de Creación
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {formatDate(payment.createdAt)}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatTime(payment.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {payment.reviewedAt && (
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Fecha de Revisión
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {formatDate(payment.reviewedAt)}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatTime(payment.reviewedAt)}
                                                </span>
                                            </div>
                                        </div>
                                        {payment.reviewedByEmail && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Revisado por: {payment.reviewedByEmail}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetail(payment.id)}
                                    className="flex items-center gap-2 flex-1"
                                >
                                    <Eye className="h-4 w-4" />
                                    Ver detalle
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default AdminPaymentCards;