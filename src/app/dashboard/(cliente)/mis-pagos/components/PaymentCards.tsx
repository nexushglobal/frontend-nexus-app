'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Payment, PaymentMethod, PaymentStatus } from '@/types/payments/payments.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Package,
    XCircle
} from 'lucide-react';

type Props = {
    data: Payment[];
};

const PaymentCards = ({ data }: Props) => {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    };

    const formatTime = (dateString: string) => {
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
                    label: status,
                    className: 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
                    icon: AlertCircle
                };
        }
    };

    const getPaymentMethodLabel = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.POINTS:
                return 'Puntos';
            case PaymentMethod.CASH:
                return 'Efectivo';
            case PaymentMethod.BANK_TRANSFER:
                return 'Transferencia';
            case PaymentMethod.CREDIT_CARD:
                return 'Tarjeta de crédito';
            default:
                return method;
        }
    };

    const getPaymentMethodIcon = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.POINTS:
                return Package;
            case PaymentMethod.CASH:
                return DollarSign;
            case PaymentMethod.BANK_TRANSFER:
                return CreditCard;
            case PaymentMethod.CREDIT_CARD:
                return CreditCard;
            default:
                return DollarSign;
        }
    };

    if (!data.length) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <CreditCard className="mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                        No se encontraron pagos
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Intenta ajustar los filtros para ver más resultados
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {data.map((payment) => {
                const statusConfig = getStatusConfig(payment.status);
                const StatusIcon = statusConfig.icon;
                const PaymentIcon = getPaymentMethodIcon(payment.paymentMethod);

                return (
                    <Card key={payment.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-4">
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <PaymentIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                            {payment.paymentConfig.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            ID: #{payment.id}
                                        </p>
                                    </div>
                                </div>

                                <Badge className={statusConfig.className}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {statusConfig.label}
                                </Badge>
                            </div>

                            <div className="mb-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Monto:
                                    </span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {formatAmount(payment.amount)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Método de pago:
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {getPaymentMethodLabel(payment.paymentMethod)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Creado: {formatDate(payment.createdAt)} a las {formatTime(payment.createdAt)}</span>
                                </div>

                                {payment.updatedAt !== payment.createdAt && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Actualizado: {formatDate(payment.updatedAt)} a las {formatTime(payment.updatedAt)}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default PaymentCards;