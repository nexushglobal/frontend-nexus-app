import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/features/shared/components/common/PageHeader'
import { TableQueryPagination } from '@/features/shared/components/table/TableQueryPagination'
import { Suspense } from 'react'
import { validatePaymentSearchParams } from '../../utils/validate-search-params'
import { PaymentsTableSkeleton } from '../shared/skeleton/PaymentsTableSkeleton'
import { PaymentsAdminTableFilters } from '../admin/PaymentsAdminTableFilters'
import { getAdminPaymentsAction } from '../../actions/get-payments'
import { PaymentsAdminTable } from '../admin/PaymentsAdminTable'
import { PaymentAdminCards } from '../admin/PaymentAdminCards'

interface PaymentsPageProps {
    searchParams?: Record<string, string | string[] | undefined>
}

export async function PaymentsAdminPage({ searchParams }: PaymentsPageProps) {
    const params = validatePaymentSearchParams(searchParams)

    const { data, success } = await getAdminPaymentsAction(params)

    if (!success || !data) {
        return <PaymentAdminErrorFallback />
    }

    return (
        <div className="container py-8">
            <PageHeader
                title="Gestión de Pagos"
                subtitle="Administra y revisa el historial de pagos de todos los usuarios"
                className="mb-6"
                variant="gradient"
            />

            <Suspense fallback={<PaymentsTableSkeleton />}>
                <PaymentAdminContent params={params} data={data} />
            </Suspense>
        </div>
    )
}

function PaymentAdminContent({ params, data }: {
    params: ReturnType<typeof validatePaymentSearchParams>
    data: Awaited<ReturnType<typeof getAdminPaymentsAction>>['data']
}) {
    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardContent>
                    <PaymentsAdminTableFilters
                        {...params}
                        paymentConfigs={data!.meta.activePaymentConfigs}
                    />
                </CardContent>
            </Card>

            <div className="hidden md:block">
                <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                    <CardContent>
                        <PaymentsAdminTable data={data!.items} />
                    </CardContent>
                </Card>
            </div>

            <div className="md:hidden">
                <PaymentAdminCards data={data!.items} />
            </div>

            <TableQueryPagination pagination={data!.pagination} />
        </div>
    )
}

function PaymentAdminErrorFallback() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Gestión de Pagos"
                subtitle="Administra y revisa el historial de pagos de todos los usuarios"
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
                                No pudimos cargar el historial de pagos. Por favor, intenta nuevamente.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}