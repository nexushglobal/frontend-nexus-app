import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/features/shared/components/common/PageHeader'
import { TableQueryPagination } from '@/features/shared/components/table/TableQueryPagination'
import { Suspense } from 'react'
import { getUserPayments } from '../../actions/get-user-payments'
import { validatePaymentSearchParams } from '../../utils/validate-search-params'
import { PaymentsTableSkeleton } from '../shared/skeleton/PaymentsTableSkeleton'
import { PaymentCards } from '../user/PaymentCards'
import { PaymentsTable } from '../user/PaymentsTable'
import { PaymentsTableFilters } from '../user/PaymentsTableFilters'

interface PaymentsPageProps {
    searchParams?: Record<string, string | string[] | undefined>
}

export async function PaymentsPage({ searchParams }: PaymentsPageProps) {
    const params = validatePaymentSearchParams(searchParams)

    const { data, success } = await getUserPayments(params)

    if (!success || !data) {
        return <PaymentErrorFallback />
    }

    return (
        <div className="container py-8">
            <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            />

            <Suspense fallback={<PaymentsTableSkeleton />}>
                <PaymentContent params={params} data={data} />
            </Suspense>
        </div>
    )
}

function PaymentContent({ params, data }: {
    params: ReturnType<typeof validatePaymentSearchParams>
    data: Awaited<ReturnType<typeof getUserPayments>>['data']
}) {
    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardContent>
                    <PaymentsTableFilters
                        {...params}
                        paymentConfigs={data!.meta.activePaymentConfigs}
                    />
                </CardContent>
            </Card>

            <div className="hidden md:block">
                <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                    <CardContent>
                        <PaymentsTable data={data!.items} />
                    </CardContent>
                </Card>
            </div>

            <div className="md:hidden">
                <PaymentCards data={data!.items} />
            </div>

            <TableQueryPagination pagination={data!.pagination} />
        </div>
    )
}

function PaymentErrorFallback() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            />
            <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <span className="text-destructive text-lg">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-destructive">
                                Error al cargar los pagos
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                No pudimos cargar tu historial de pagos. Por favor, intenta nuevamente.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}