import { PageHeader } from '@/features/shared/components/common/PageHeader'

interface PaymentsPageProps {
    searchParams?: Record<string, string | string[] | undefined>
}

export async function PaymentsAdminPage({ searchParams }: PaymentsPageProps) {
    return (
        <div className="container py-8">
            <PageHeader
                title="Pagos"
                subtitle="Gestiona y revisa el historial de pagos "
                className="mb-6"
                variant="gradient"
            />

        </div>
    )
}
