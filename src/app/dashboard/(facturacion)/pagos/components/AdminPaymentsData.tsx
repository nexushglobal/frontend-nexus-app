// src/app/dashboard/(facturacion)/pagos/components/AdminPaymentsData.tsx
import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import { AdminPaymentsTableFilters } from './AdminPaymentsTableFilters';
import AdminPaymentsTable from './AdminPaymentsTable';
import AdminPaymentCards from './AdminPaymentCards';
import { PaymentStatus } from '@/types/admin-payments.types';
import { getAdminPayments, getPaymentMetadata } from '../actions';


export default async function AdminPaymentsData({
    searchParams
}: {
    searchParams?: {
        search?: string;
        status?: string;
        paymentMethod?: string;
        paymentConfigId?: string;
        startDate?: string;
        endDate?: string;
        page?: string;
        limit?: string;
    };
}) {
    const search = searchParams?.search || '';

    const status = searchParams?.status && Object.values(PaymentStatus).includes(searchParams.status as PaymentStatus)
        ? (searchParams.status as PaymentStatus)
        : undefined;

    const paymentMethod = searchParams?.paymentMethod || undefined;

    const paymentConfigId = searchParams?.paymentConfigId
        ? parseInt(searchParams.paymentConfigId)
        : undefined;

    const startDate = searchParams?.startDate || undefined;
    const endDate = searchParams?.endDate || undefined;

    const page = searchParams?.page ? parseInt(searchParams.page) : 1;
    const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;

    // Obtener datos y metadatos en paralelo
    const [paymentsResult, metadata] = await Promise.all([
        getAdminPayments({
            search,
            status,
            paymentMethod,
            paymentConfigId,
            startDate,
            endDate,
            page,
            limit
        }),
        getPaymentMetadata()
    ]);

    const { data, meta } = paymentsResult;

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardContent>
                    <AdminPaymentsTableFilters
                        search={search}
                        status={status}
                        paymentMethod={paymentMethod}
                        paymentConfigId={paymentConfigId}
                        startDate={startDate}
                        endDate={endDate}
                        metadata={metadata}
                    />
                </CardContent>
            </Card>

            <div className="hidden md:block">
                <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                    <CardContent>
                        <AdminPaymentsTable data={data} />
                    </CardContent>
                </Card>
            </div>

            <div className="md:hidden">
                <AdminPaymentCards data={data} />
            </div>

            <TableQueryPagination meta={meta} />
        </div>
    );
}