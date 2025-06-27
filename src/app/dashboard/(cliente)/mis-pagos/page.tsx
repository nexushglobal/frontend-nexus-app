// src/app/dashboard/(cliente)/mis-pagos/page.tsx
import { Suspense } from 'react';
// import { PageHeader } from '@/components/common/PageHeader';
import PaymentsTableSkeleton from './components/PaymentsTableSkeleton';
import PaymentsData from './components/PaymentsData';

export default async function PaymentsPage({
    searchParams
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filters = await searchParams;

    return (
        <div className="container py-8">
            {/* <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            /> */}

            <Suspense fallback={<PaymentsTableSkeleton />}>
                <PaymentsData searchParams={filters} />
            </Suspense>
        </div>
    );
}