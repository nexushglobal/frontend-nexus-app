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
    Eye,
    User,
    FileText
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../../utils/payement.utils'
import { PaymentAdmin } from '../../types/response-payment'
import TableTemplate from '@/features/shared/components/table/TableTemplate'
import { PaymentStatus } from '../../types/enums-payments'

interface PaymentsAdminTableProps {
    data: PaymentAdmin[]
}

export function PaymentsAdminTable({ data }: PaymentsAdminTableProps) {
    const router = useRouter()
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
        updatedAt: false,
        paymentMethod: false,
        operationDetails: false
    })

    const columns = useMemo<ColumnDef<PaymentAdmin>[]>(() => [
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
            id: 'userInfo',
            header: 'Cliente',
            cell: ({ row }) => {
                const payment = row.original
                const user = payment.user
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Doc: {user.documentNumber}
                            </p>
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
                    <div className="space-y-1">
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
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(payment.createdAt)}</span>
                            <span>•</span>
                            <span>{formatTime(payment.createdAt)}</span>
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
                    <Badge
                        variant={config.variant as any}
                        className={`${config.className} whitespace-nowrap`}
                    >
                        {/* {config.icon} */}
                        {config.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'operationDetails',
            header: 'Detalles de Operación',
            cell: ({ row }) => {
                const payment = row.original
                const hasOperationCode = payment.operationCode
                const hasTicketNumber = payment.ticketNumber

                if (!hasOperationCode && !hasTicketNumber) {
                    return (
                        <span className="text-xs text-gray-400 italic">
                            Sin detalles
                        </span>
                    )
                }

                return (
                    <div className="space-y-1">
                        {hasOperationCode && (
                            <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Op: {payment.operationCode}
                                </span>
                            </div>
                        )}
                        {hasTicketNumber && (
                            <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Ticket: {payment.ticketNumber}
                                </span>
                            </div>
                        )}
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
                    <div className="text-sm">
                        <div>{formatDate(date)}</div>
                        <div className="text-xs text-gray-500">{formatTime(date)}</div>
                    </div>
                )
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'Última Actualización',
            cell: ({ row }) => {
                const date = row.getValue('updatedAt') as string
                return (
                    <div className="text-sm">
                        <div>{formatDate(date)}</div>
                        <div className="text-xs text-gray-500">{formatTime(date)}</div>
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
                        onClick={() => router.push(`/dashboard/pagos/detalle/${payment.id}`)}
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