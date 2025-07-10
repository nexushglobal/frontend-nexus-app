'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Calendar,
    CreditCard,
    DollarSign,
    Eye,
    Package
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Payment } from '../types/payments.type'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../utils/payement.utils'

interface PaymentCardsProps {
    data: Payment[]
}

export function PaymentCards({ data }: PaymentCardsProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No se encontraron pagos
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    No hay pagos que coincidan con los filtros aplicados
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {data.map((payment) => {
                const statusConfig = getStatusConfig(payment.status)
                const StatusIcon = statusConfig.icon

                return (
                    <Card key={payment.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {/* Header con estado */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium text-sm">
                                            {payment.paymentConfig.name}
                                        </span>
                                    </div>
                                    <Badge variant={statusConfig.variant} className={statusConfig.className}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusConfig.label}
                                    </Badge>
                                </div>

                                {/* Monto destacado */}
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    <span className="text-xl font-bold text-green-700">
                                        {formatAmount(payment.amount)}
                                    </span>
                                </div>

                                {/* Información adicional */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <CreditCard className="h-3 w-3" />
                                            <span className="text-xs">Método</span>
                                        </div>
                                        <div className="font-medium">{payment.paymentMethod}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-xs">Fecha</span>
                                        </div>
                                        <div className="font-medium">
                                            {formatDate(payment.createdAt)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(payment.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Información bancaria si existe */}
                                {(payment.bankName || payment.operationCode) && (
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            {payment.bankName && (
                                                <div>
                                                    <span className="text-xs text-gray-500">Banco:</span>
                                                    <div className="font-medium">{payment.bankName}</div>
                                                </div>
                                            )}
                                            {payment.operationCode && (
                                                <div>
                                                    <span className="text-xs text-gray-500">Operación:</span>
                                                    <div className="font-mono text-xs">{payment.operationCode}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Botón de acción */}
                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/dashboard/mis-pagos/detalle/${payment.id}`)}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Ver Detalle Completo
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}