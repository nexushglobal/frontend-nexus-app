'use client'

import { DataTable } from '@/features/shared/components/table/DataTable'
import { VisibilityState } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { PaymentUser } from '../../types/response-payment'
import { createPaymentUserColumns, defaultColumnVisibility } from './columns/paymentUserColumns'

interface PaymentUserTableProps {
    data: PaymentUser[]
    isLoading?: boolean
}

export function PaymentUserTable({
    data,
    isLoading,
}: PaymentUserTableProps) {
    const router = useRouter()
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility)

    const columns = useMemo(() =>
        createPaymentUserColumns({
            onViewDetail: (paymentId) => {
                router.push(`/dashboard/cli-mis-pagos/detalle/${paymentId}`)
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
            emptyMessage="No tienes pagos registrados. Cuando realices pagos, aparecerán aquí."
        />
    )
}
