import { PageHeader } from '@/components/common/PageHeader';

export default async function PaymentsPage({
    searchParams
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const filters = await searchParams;

    return (
        <div className="container py-8">
            <PageHeader
                title="Pagos"
                subtitle="Gestiona y revisa el historial de pagos realizados"
                className="mb-6"
                variant="gradient"
            />


        </div>
    );
}