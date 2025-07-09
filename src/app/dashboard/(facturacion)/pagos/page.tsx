import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import AdminPaymentsData from './components/AdminPaymentsData';
import AdminPaymentsTableSkeleton from './components/AdminPaymentsTableSkeleton';

export default async function AdminPaymentsPage({
    searchParams
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filters = await searchParams;

    return (
        <div className="container py-8">
            <PageHeader
                title="Gestión de Pagos"
                subtitle="Administra y revisa todos los pagos realizados en el sistema"
                className="mb-6"
                variant="gradient"
            />

            <Suspense fallback={<AdminPaymentsTableSkeleton />}>
                <AdminPaymentsData searchParams={filters} />
            </Suspense>
        </div>
    );
}