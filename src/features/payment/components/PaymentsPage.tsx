import { PageHeader } from '@/components/common/PageHeader'
import { Suspense } from 'react'
import { PaymentsTableSkeleton } from './PaymentsTableSkeleton'
import { PaymentsDataContainer } from './PaymentsDataContainer'

interface PaymentsPageProps {
    searchParams?: {
        search?: string
        status?: string
        paymentConfigId?: string
        startDate?: string
        endDate?: string
        sortBy?: string
        sortOrder?: string
        page?: string
        limit?: string
    }
}

export function PaymentsPage({ searchParams }: PaymentsPageProps) {
    return (
        <div className="container py-8">
            <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            />

            <Suspense fallback={<PaymentsTableSkeleton />}>
                <PaymentsDataContainer searchParams={searchParams} />
            </Suspense>
        </div>
    )
}