import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentStatus } from '@/features/payment/types/enums-payments'
import { PaymentConfig } from '@/features/payment/types/response-payment'
import { formatAmount, formatDateTime, getStatusConfig } from '@/features/payment/utils/payement.utils'
import {
    Banknote,
    Calendar,
    CreditCard,
    DollarSign,
    Package,
    User
} from 'lucide-react'

interface OverviewSectionProps {
    status: PaymentStatus
    amount: number
    createdAt: string
    updatedAt: string
    paymentConfig: PaymentConfig
    id: number
    paymentMethod: string
    reviewedByEmail?: string | null
    reviewedAt?: string | null
    bankName?: string | null
    operationCode?: string | null
    rejectionReason?: string | null
}

export function OverviewSection(
    { amount, createdAt, status, updatedAt, paymentConfig, id, paymentMethod, rejectionReason, operationCode, reviewedAt, bankName, reviewedByEmail }
        : OverviewSectionProps) {
    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="space-y-6">
            {/* Status and Amount Header */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {formatAmount(amount)}
                            </CardTitle>
                            <p className="text-gray-600 dark:text-gray-400">
                                {paymentConfig.name}
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
                            <div className="font-semibold">#{id}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Método</div>
                            <div className="font-semibold">{paymentMethod}</div>
                        </div>
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

                        {bankName && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <Banknote className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Banco</p>
                                    <p className="font-semibold">{bankName}</p>
                                </div>
                            </div>
                        )}

                        {operationCode && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                    <Package className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Código de Operación</p>
                                    <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                        {operationCode}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Review Information */}
            {(reviewedByEmail || reviewedAt) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            Información de Revisión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviewedByEmail && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <User className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Revisado por</p>
                                        <p className="font-semibold">{reviewedByEmail}</p>
                                    </div>
                                </div>
                            )}

                            {reviewedAt && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <Calendar className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha de Revisión</p>
                                        <p className="font-semibold">
                                            {formatDateTime(reviewedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {rejectionReason && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                                    Motivo de Rechazo
                                </h4>
                                <p className="text-red-700 dark:text-red-300">
                                    {rejectionReason}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
