'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Calendar,
    CreditCard,
    DollarSign,
    Eye,
    FileText,
    Mail,
    Package,
    User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PaymentAdmin } from '../../types/response-payment'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../../utils/payement.utils'

interface PaymentAdminCardsProps {
    data: PaymentAdmin[]
}

export function PaymentAdminCards({ data }: PaymentAdminCardsProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No hay pagos registrados
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aún no se han registrado pagos con los filtros aplicados.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {data.map((payment) => {
                const statusConfig = getStatusConfig(payment.status)

                return (
                    <Card key={payment.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {/* Header con cliente y estado */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                {payment.user.fullName}
                                            </h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{payment.user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span>Doc: {payment.user.documentNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={statusConfig.variant as any}
                                        className={`${statusConfig.className} whitespace-nowrap ml-2`}
                                    >
                                        {/* {statusConfig.icon} */}
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                {/* Información del pago */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium">
                                                {payment.paymentConfig.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                {formatAmount(payment.amount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detalles de operación */}
                                    {(payment.operationCode || payment.ticketNumber) && (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                                                <FileText className="h-3 w-3" />
                                                <span>Detalles de Operación</span>
                                            </div>
                                            {payment.operationCode && (
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Código: </span>
                                                    <span className="font-mono">{payment.operationCode}</span>
                                                </div>
                                            )}
                                            {payment.ticketNumber && (
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Ticket: </span>
                                                    <span className="font-mono">{payment.ticketNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Método de pago y fecha */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-3 w-3 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Método
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-700 dark:text-gray-300">
                                                {payment.paymentMethod}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Fecha
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-700 dark:text-gray-300">
                                                <div>{formatDate(payment.createdAt)}</div>
                                                <div className="text-gray-500">{formatTime(payment.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de acción */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/dashboard/fac-pagos/detalle/${payment.id}`)}
                                    className="w-full flex items-center gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    Ver Detalle Completo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
