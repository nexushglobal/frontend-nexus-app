// src/features/payment/components/admin/PaymentAdminTable.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpDown, Calendar, DollarSign, ExternalLink, Package, User } from 'lucide-react'
import { DataTable } from '@/features/shared/components/table/DataTable'
import { useRouter } from 'next/navigation'
import { formatAmount, formatDate, formatTime, getStatusConfig } from '../../utils/payement.utils'
import type { PaymentAdmin } from '../../types/response-payment'
import { PaymentStatus } from '../../types/enums-payments'

interface PaymentAdminTableProps {
    data: PaymentAdmin[]
    isLoading?: boolean
    onSortingChange?: (sorting: any) => void
    sorting?: any
}

export function PaymentAdminTable({
    data,
    isLoading,
    onSortingChange,
    sorting
}: PaymentAdminTableProps) {
    const router = useRouter()

    const columns: ColumnDef<PaymentAdmin>[] = [
        {
            accessorKey: 'user',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 h-auto hover:bg-transparent"
                >
                    Usuario
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} />
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
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                {formatAmount(payment.amount)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 h-auto hover:bg-transparent"
                >
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const status: PaymentStatus = row.getValue('status')
                const config = getStatusConfig(status)
                return (
                    <Badge variant={config.variant as any} className="whitespace-nowrap">
                        {config.label}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 h-auto hover:bg-transparent"
                >
                    Monto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
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
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/pagos/detalle/${payment.id}`)}
                        className="h-8 px-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Ver detalle</span>
                    </Button>
                )
            },
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            onSortingChange={onSortingChange}
            sorting={sorting}
        />
    )
}
