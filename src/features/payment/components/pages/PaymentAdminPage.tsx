'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/features/shared/components/common/PageHeader'
import { TablePagination } from '@/features/shared/components/table/TablePagination'
import { PaymentAdminFilters } from '../admin/PaymentAdminFilters'
import { PaymentAdminCards } from '../admin/PaymentAdminCards'
import { usePaymentAdminFiltersStore } from '../../stores/payment-filters.store'
import { useMemo } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SortingState } from '@tanstack/react-table'
import { useAdminPayments } from '../../hooks/usePaymentsQuery'
import { PaymentAdminTable } from '../admin/PaymentsAdminTable'

export function PaymentAdminPage() {
    const { filters, setFilter, setFilters } = usePaymentAdminFiltersStore()

    const queryParams = useMemo(() => {
        const params: any = {
            page: filters.page || 1,
            limit: filters.limit || 10,
        }

        // Solo agregar filtros que tengan valor
        if (filters.search) params.search = filters.search
        if (filters.status) params.status = filters.status
        if (filters.paymentConfigId) params.paymentConfigId = Number(filters.paymentConfigId)
        if (filters.startDate) params.startDate = filters.startDate
        if (filters.endDate) params.endDate = filters.endDate
        if (filters.sortBy) params.sortBy = filters.sortBy
        if (filters.sortOrder) params.sortOrder = filters.sortOrder

        return params
    }, [filters])

    // Query para obtener datos
    const { data, isLoading, error, isError } = useAdminPayments(queryParams)

    // Manejar sorting desde la tabla
    const handleSortingChange = (sorting: SortingState) => {
        if (sorting.length > 0) {
            const sort = sorting[0]
            setFilters({
                sortBy: sort.id as any,
                sortOrder: sort.desc ? 'DESC' : 'ASC'
            })
        }
    }

    // Convertir sorting de filters a formato TanStack Table
    const tableSorting: SortingState = useMemo(() => {
        if (filters.sortBy) {
            return [{
                id: filters.sortBy,
                desc: filters.sortOrder === 'DESC'
            }]
        }
        return []
    }, [filters.sortBy, filters.sortOrder])

    // Manejar cambios de paginación
    const handlePageChange = (page: number) => {
        setFilter('page', page)
    }

    const handleLimitChange = (limit: number) => {
        setFilters({ limit, page: 1 })
    }

    if (isError) {
        return (
            <div className="container py-8">
                <PageHeader
                    title="Gestión de Pagos"
                    subtitle="Administra y revisa el historial de pagos de todos los usuarios"
                    className="mb-6"
                    variant="gradient"
                />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error al cargar los pagos: {error?.message || 'Error desconocido'}
                        {/* TODO: implentar un reset de filtros si hay error  */}
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <PageHeader
                title="Gestión de Pagos"
                subtitle="Administra y revisa el historial de pagos de todos los usuarios"
                className="mb-6"
                variant="gradient"
            />

            <div className="space-y-6">
                {/* Filtros */}
                <Card className="shadow-sm">
                    <CardContent className="pt-6">
                        <PaymentAdminFilters
                            paymentConfigs={data?.meta?.activePaymentConfigs || []}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>

                {/* Loading state cuando no hay datos aún */}
                {isLoading && !data && (
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="text-muted-foreground">Cargando pagos...</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabla Desktop */}
                {data && (
                    <>
                        <div className="hidden md:block">
                            <PaymentAdminTable
                                data={data.items}
                                isLoading={isLoading}
                                onSortingChange={handleSortingChange}
                                sorting={tableSorting}
                            />
                        </div>

                        {/* Cards Mobile */}
                        <div className="md:hidden">
                            <PaymentAdminCards data={data.items} />
                        </div>

                        {/* Paginación */}
                        <Card className="shadow-sm">
                            <CardContent className="py-4">
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