import { TableQueryPagination } from '@/components/common/table/TableQueryPagination'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/features/shared/components/common/PageHeader'
import { Suspense } from 'react'
import { getUserPayments } from '../../actions/get-user-payments'
import { PaymentStatus } from '../../types/payments.type'
import { PaymentsTableSkeleton } from '../shared/skeleton/PaymentsTableSkeleton'
import { PaymentsTable } from '../user/PaymentsTable'
import { PaymentsTableFilters } from '../user/PaymentsTableFilters'
import { PaymentCards } from '../user/PaymentCards'

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

export async function PaymentsPage({ searchParams }: PaymentsPageProps) {
    const search = searchParams?.search || ''

    const status = searchParams?.status && Object.values(PaymentStatus).includes(searchParams.status as PaymentStatus)
        ? (searchParams.status as PaymentStatus)
        : undefined

    const paymentConfigId = searchParams?.paymentConfigId
        ? parseInt(searchParams.paymentConfigId)
        : undefined

    const startDate = searchParams?.startDate || undefined
    const endDate = searchParams?.endDate || undefined

    const sortBy = (['createdAt', 'amount', 'status', 'updatedAt'].includes(searchParams?.sortBy || ''))
        ? (searchParams?.sortBy as 'createdAt' | 'amount' | 'status' | 'updatedAt')
        : 'createdAt'

    const sortOrder = (searchParams?.sortOrder === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC'

    const page = searchParams?.page ? parseInt(searchParams.page) : 1
    const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20

    const { data, meta, paymentConfigs } = await getUserPayments({
        search,
        status,
        paymentConfigId,
        startDate,
        endDate,
        sortBy,
        sortOrder,
        page,
        limit
    })
    return (
        <div className="container py-8">
            <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            />

            <Suspense fallback={<PaymentsTableSkeleton />}>
                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardContent>
                            <PaymentsTableFilters
                                search={search}
                                status={status}
                                paymentConfigId={paymentConfigId}
                                startDate={startDate}
                                endDate={endDate}
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                paymentConfigs={paymentConfigs}
                            />
                        </CardContent>
                    </Card>

                    <div className="hidden md:block">
                        <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                            <CardContent>
                                <PaymentsTable data={data} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:hidden">
                        <PaymentCards data={data} />
                    </div>

                    <TableQueryPagination meta={meta} />
                </div>
            </Suspense>
        </div>
    )
}