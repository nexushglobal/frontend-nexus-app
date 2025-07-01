// src/app/dashboard/(cliente)/mis-pagos/components/PaymentsData.tsx
import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import { getUserPayments } from '../actions';
import PaymentsTable from './PaymentsTable';
import PaymentCards from './PaymentCards';
import { PaymentsTableFilters } from './PaymentsTableFilters';
import { PaymentStatus } from '@/types/payments/payments.types';

export default async function PaymentsData({
    searchParams
}: {
    searchParams?: {
        search?: string;
        status?: string;
        paymentConfigId?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: string;
        limit?: string;
    };
}) {
    const search = searchParams?.search || '';

    const status = searchParams?.status && Object.values(PaymentStatus).includes(searchParams.status as PaymentStatus)
        ? (searchParams.status as PaymentStatus)
        : undefined;

    const paymentConfigId = searchParams?.paymentConfigId
        ? parseInt(searchParams.paymentConfigId)
        : undefined;

    const startDate = searchParams?.startDate || undefined;
    const endDate = searchParams?.endDate || undefined;

    const sortBy = (['createdAt', 'amount', 'status', 'updatedAt'].includes(searchParams?.sortBy || ''))
        ? (searchParams?.sortBy as 'createdAt' | 'amount' | 'status' | 'updatedAt')
        : 'createdAt';

    const sortOrder = (searchParams?.sortOrder === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';

    const page = searchParams?.page ? parseInt(searchParams.page) : 1;
    const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;

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
    });

    return (
        <div className="space-y-6">
            <Card className="shadow-sm ">
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
                    <CardContent >
                        <PaymentsTable data={data} />
                    </CardContent>
                </Card>
            </div>

            <div className="md:hidden">
                <PaymentCards data={data} />
            </div>

            <TableQueryPagination meta={meta} />
        </div>
    );
}