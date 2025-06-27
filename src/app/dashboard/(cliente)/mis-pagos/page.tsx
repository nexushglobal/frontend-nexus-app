import { Suspense } from 'react';


export default async function MyPaymentsPage({
    searchParams
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filters = await searchParams;

    return (
        <div className="container py-8">
            <Suspense fallback={<PaymentsTableSkeleton />}>
                <PaymentsData searchParams={filters} />
            </Suspense>
        </div>
    );
}
