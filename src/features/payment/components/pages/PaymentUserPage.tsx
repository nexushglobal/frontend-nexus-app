'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/features/shared/components/common/PageHeader'
import { TablePagination } from '@/features/shared/components/table/TablePagination'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { useUserPayments } from '../../hooks/usePaymentsQuery'
import { usePaymentUserFiltersStore } from '../../stores/payment-filters.store'
import { PaymentUserCards } from '../user/PaymentUserCards'
import { PaymentUserFilters } from '../user/PaymentUserFilters'
import { PaymentUserTable } from '../user/PaymentUserTable'

export function PaymentUserPage() {
    const { filters, setFilter, setFilters } = usePaymentUserFiltersStore()

    const queryParams = useMemo(() => {
        const params: any = {
            page: filters.page || 1,
            limit: filters.limit || 10,
        }

        if (filters.search) params.search = filters.search
        if (filters.status) params.status = filters.status
        if (filters.paymentConfigId) params.paymentConfigId = Number(filters.paymentConfigId)
        if (filters.startDate) params.startDate = filters.startDate
        if (filters.endDate) params.endDate = filters.endDate
        if (filters.sortBy) params.sortBy = filters.sortBy
        if (filters.sortOrder) params.sortOrder = filters.sortOrder

        return params
    }, [filters])

    const { data, isLoading, error, isError } = useUserPayments(queryParams)

    const handlePageChange = (page: number) => {
        setFilter('page', page)
    }

    const handleLimitChange = (limit: number) => {
        setFilters({ limit, page: 1 })
    }

    if (isError) {
        return (
            <div className="container">
                <PageHeader
                    title="Mis Pagos"
                    subtitle="Consulta el historial de tus pagos realizados"
                    className="mb-6"
                    variant="gradient"
                />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error al cargar tus pagos: {error?.message || 'Error desconocido'}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container">
            <PageHeader
                title="Mis Pagos"
                subtitle="Consulta el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            />

            <div className="space-y-6">
                <Card className="shadow-sm">
                    <CardContent>
                        <PaymentUserFilters
                            paymentConfigs={data?.meta?.activePaymentConfigs || []}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>

                {isLoading && !data && (
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="text-muted-foreground">Cargando tus pagos...</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {data && (
                    <>
                        <div className="hidden md:block">
                            <PaymentUserTable
                                data={data.items}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Cards Mobile */}
                        <div className="md:hidden">
                            <PaymentUserCards data={data.items} />
                        </div>

                        {/* Paginación */}
                        <Card className="shadow-sm">
                            <CardContent>
                                <TablePagination
                                    pagination={data.pagination}
                                    onPageChange={handlePageChange}
                                    onLimitChange={handleLimitChange}
                                    isLoading={isLoading}
                                />
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}