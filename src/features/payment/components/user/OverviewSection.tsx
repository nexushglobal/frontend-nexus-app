import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Calendar,
    CreditCard,
    DollarSign,
    Package,
    User,
    Banknote
} from 'lucide-react'
import { formatAmount, formatDateTime, getStatusConfig } from '../../utils/payement.utils'
import { PaymentDetailResponse } from '../../types/payments.type'

interface OverviewSectionProps {
    payment: PaymentDetailResponse
}

export function OverviewSection({ payment }: OverviewSectionProps) {
    const statusConfig = getStatusConfig(payment.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="space-y-6">
            {/* Status and Amount Header */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {formatAmount(payment.amount)}
                            </CardTitle>
                            <p className="text-gray-600 dark:text-gray-400">
                                {payment.paymentConfig.name}
                            </p>
                        </div>
                        <Badge variant={statusConfig.variant} className={`${statusConfig.className} text-sm px-3 py-1`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {statusConfig.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">ID del Pago</div>
                            <div className="font-semibold">#{payment.id}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Método</div>
                            <div className="font-semibold">{payment.paymentMethod}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Creado</div>
                            <div className="font-semibold text-sm">
                                {formatDateTime(payment.createdAt)}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Actualizado</div>
                            <div className="font-semibold text-sm">
                                {formatDateTime(payment.updatedAt)}
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
                                <p className="font-semibold">{payment.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Monto Total</p>
                                <p className="font-semibold text-green-700">
                                    {formatAmount(payment.amount)}
                                </p>
                            </div>
                        </div>

                        {payment.bankName && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <Banknote className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Banco</p>
                                    <p className="font-semibold">{payment.bankName}</p>
                                </div>
                            </div>
                        )}

                        {payment.operationCode && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                    <Package className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Código de Operación</p>
                                    <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        {payment.operationCode}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Review Information */}
            {(payment.reviewedByEmail || payment.reviewedAt) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            Información de Revisión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {payment.reviewedByEmail && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Revisado por</p>
                                        <p className="font-semibold">{payment.reviewedByEmail}</p>
                                    </div>
                                </div>
                            )}

                            {payment.reviewedAt && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <Calendar className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de Revisión</p>
                                        <p className="font-semibold">
                                            {formatDateTime(payment.reviewedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {payment.rejectionReason && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                                    Motivo de Rechazo
                                </h4>
                                <p className="text-red-700 dark:text-red-300">
                                    {payment.rejectionReason}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
