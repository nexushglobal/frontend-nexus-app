'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpDown, Calendar, DollarSign, ExternalLink, Package, User } from 'lucide-react'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../../../utils/payement.utils'
import type { PaymentAdmin } from '../../../types/response-payment'
import { PaymentStatus } from '@/features/payment/types/enums-payments'

interface CreateAdminColumnsProps {
    onViewDetail: (paymentId: number) => void
}

export function createPaymentAdminColumns({
    onViewDetail
}: CreateAdminColumnsProps): ColumnDef<PaymentAdmin>[] {
    return [
        {
            accessorKey: 'user',
            header: 'Usuario',
            cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                alt={user.fullName}
                            />
                            <AvatarFallback>
                                <User className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium leading-none">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Doc: {user.documentNumber}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            id: 'paymentInfo',
            header: 'Información del Pago',
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{payment.paymentConfig.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {payment.paymentConfig.description}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                                Método: {payment.paymentMethod || 'No especificado'}
                            </span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'status',
            header: 'Estado',

            cell: ({ row }) => {
                const status: PaymentStatus = row.getValue('status')
                const config = getStatusConfig(status)
                return (
                    <Badge variant={config.variant} className="flex items-center gap-1">
                        <config.icon className="h-3 w-3" />
                        {config.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'amount',
            header: 'Monto',
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'))
                return (
                    <div className="text-right font-medium">
                        {formatAmount(amount)}
                    </div>
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Fecha de Creación',
            cell: ({ row }) => {
                const date = row.getValue('createdAt') as string
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{formatDate(date)}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(date)}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'Fecha de Actualización',
            cell: ({ row }) => {
                const date = row.getValue('updatedAt') as string
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{formatDate(date)}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(date)}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(payment.id)}
                        className="h-8 px-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Ver detalle</span>
                    </Button>
                )
            },
        },
    ]
}

// Configuración por defecto de columnas visibles
export const defaultColumnVisibility = {
    updatedAt: false, // Ocultar por defecto
}

// Función helper para obtener columnas con configuración personalizada
export function getPaymentAdminColumns(
    options: CreateAdminColumnsProps & {
        hideColumns?: string[]
        customColumnVisibility?: Record<string, boolean>
    }
) {
    const columns = createPaymentAdminColumns(options)

    // Si se especificaron columnas a ocultar, filtrarlas
    if (options.hideColumns) {
        return columns.filter(col =>
            !options.hideColumns?.includes(typeof col.id === 'string' ? col.id : '')
        )
    }

    return columns
}