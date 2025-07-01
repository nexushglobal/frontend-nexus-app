import { PageHeader } from "@/components/common/PageHeader";
import { PaymentDetailLoading } from "./components/PaymentDetailLoading";

export default function Loading() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Detalle de Pago"
                subtitle="Cargando información del pago..."
                variant="gradient"
                backUrl="/dashboard/mis-pagos"
                className="mb-6"
            />
            <PaymentDetailLoading />
        </div>
    );
}