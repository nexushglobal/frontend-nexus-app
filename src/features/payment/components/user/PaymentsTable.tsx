'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table'
import {
    Calendar,
    CreditCard,
    DollarSign,
    Package,
    Eye
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../../utils/payement.utils'
import { PaymentUser } from '../../types/response-payment'
import TableTemplate from '@/features/shared/components/table/TableTemplate'

interface PaymentsTableProps {
    data: PaymentUser[]
}

export function PaymentsTable({ data }: PaymentsTableProps) {
    const router = useRouter()
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        updatedAt: false,
        paymentMethod: false
    })

    const columns = useMemo<ColumnDef<PaymentUser>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => (
                <span className="font-mono text-sm text-gray-500">
                    #{row.getValue('id')}
                </span>
            ),
        },
        {
            id: 'paymentInfo',
            header: 'Información del Pago',
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-sm">
                                {payment.paymentConfig.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CreditCard className="h-3 w-3" />
                            <span>{payment.paymentMethod}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'amount',
            header: 'Monto',
            cell: ({ row }) => {
                const amount = row.getValue('amount') as number
                return (
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700">
                            {formatAmount(amount)}
                        </span>
                    </div>
                )
            },
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => {
                const status = row.getValue('status') as PaymentUser['status']
                const config = getStatusConfig(status)
                const StatusIcon = config.icon

                return (
                    <Badge variant={config.variant} className={config.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Fecha de Creación',
            cell: ({ row }) => {
                const dateString = row.getValue('createdAt') as string
                return (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                            <div className="font-medium">{formatDate(dateString)}</div>
                            <div className="text-xs text-gray-500">{formatTime(dateString)}</div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'Última Actualización',
            cell: ({ row }) => {
                const dateString = row.getValue('updatedAt') as string
                return (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                            <div className="font-medium">{formatDate(dateString)}</div>
                            <div className="text-xs text-gray-500">{formatTime(dateString)}</div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'paymentMethod',
            header: 'Método de Pago',
            cell: ({ row }) => {
                const method = row.getValue('paymentMethod') as string
                return (
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{method}</span>
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
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/mis-pagos/detalle/${payment.id}`)}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        Ver Detalle
                    </Button>
                )
            },
        },
    ], [router])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
        },
    })

    return (
        <TableTemplate
            table={table}
            columns={columns}
        />
    )
}