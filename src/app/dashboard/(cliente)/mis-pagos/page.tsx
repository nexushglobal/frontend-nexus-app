import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import PaymentsData from './components/PaymentsData';
import PaymentsTableSkeleton from './components/PaymentsTableSkeleton';

export default async function PaymentsPage({
    searchParams
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filters = await searchParams;

    return (
        <div className="container py-8">
            <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            />

            <Suspense fallback={<PaymentsTableSkeleton />}>
                <PaymentsData searchParams={filters} />
            </Suspense>
        </div>
    );
}