import { PageHeader } from "@/components/common/PageHeader";


interface Props {
    params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({ params }: Props) {
    const { id } = await params;

    return (
        <div className="container py-8">
            <PageHeader
                title={`Detalle de Pago #${id}`}
                subtitle="Información detallada del pago"
                variant="gradient"
                backUrl="/dashboard/mis-pagos"
            />
        </div>
    );
}
