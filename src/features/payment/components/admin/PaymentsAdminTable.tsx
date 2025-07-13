'use client'

import { useMemo, useState } from 'react'
import { VisibilityState } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/features/shared/components/table/DataTable'
import { createPaymentAdminColumns, defaultColumnVisibility } from './columns/paymentAdminColumns'
import type { PaymentAdmin } from '../../types/response-payment'

interface PaymentAdminTableProps {
    data: PaymentAdmin[]
    isLoading?: boolean

}

export function PaymentAdminTable({
    data,
    isLoading,

}: PaymentAdminTableProps) {
    const router = useRouter()
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility)

    const columns = useMemo(() =>
        createPaymentAdminColumns({
            onViewDetail: (paymentId) => {
                router.push(`/dashboard/pagos/detalle/${paymentId}`)
            }
        }),
        [router]
    )

    return (
        <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
        />
    )
}