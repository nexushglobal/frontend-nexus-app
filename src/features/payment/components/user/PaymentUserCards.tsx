'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    Calendar,
    CreditCard,
    DollarSign,
    Eye,
    Package
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PaymentUser } from '../../types/response-payment'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../../utils/payement.utils'

interface PaymentUserCardsProps {
    data: PaymentUser[]
}

export function PaymentUserCards({ data }: PaymentUserCardsProps) {
    const router = useRouter()

    if (!data?.length) {
        return (
            <Card className="shadow-sm">
                <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                            <h3 className="text-lg font-medium">No tienes pagos registrados</h3>
                            <p className="text-muted-foreground text-sm">
                                Cuando realices pagos, aparecerán aquí
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {data.map((payment) => {
                const statusConfig = getStatusConfig(payment.status)

                return (
                    <Card key={payment.id} className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {/* Header con Estado y ID */}
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant={statusConfig.variant}
                                        className={statusConfig.className}
                                    >
                                        {statusConfig.label}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        #{payment.id}
                                    </span>
                                </div>

                                {/* Información del Pago */}
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm">{payment.paymentConfig.name}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {payment.paymentConfig.description}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Monto */}
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium">{formatAmount(payment.amount)}</p>
                                            <p className="text-xs text-muted-foreground">Monto del pago</p>
                                        </div>
                                    </div>

                                    {/* Método de Pago */}
                                    {payment.paymentMethod && (
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm">{payment.paymentMethod}</p>
                                                <p className="text-xs text-muted-foreground">Método de pago</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fecha */}
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm">{formatDate(payment.createdAt)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTime(payment.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Acción */}
                                <div className="pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/dashboard/cli-mis-pagos/detalle/${payment.id}`)}
                                        className="w-full flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Ver Detalle
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
