import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react";
import { getPaymentDetail } from "./actions";
import { PaymentDetailContent } from "./components/PaymentDetailContent";
import { PaymentDetailLoading } from "./components/PaymentDetailLoading";

interface Props {
    params: Promise<{ id: string }>;
}

async function PaymentDetailData({ paymentId }: { paymentId: string }) {
    const result = await getPaymentDetail(paymentId);

    if (!result.success || !result.data) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    {result.message || "No se pudo cargar el detalle del pago"}
                </AlertDescription>
            </Alert>
        );
    }

    return <PaymentDetailContent payment={result.data} paymentId={paymentId} />;
}

export default async function PaymentDetailPage({ params }: Props) {
    const { id } = await params;

    return (
        <div className="container py-8">
            <PageHeader
                title={`Detalle de Pago #${id}`}
                subtitle="Información completa y detallada del pago"
                variant="gradient"
                backUrl="/dashboard/mis-pagos"
                className="mb-6"
            />

            <Suspense fallback={<PaymentDetailLoading />}>
                <PaymentDetailData paymentId={id} />
            </Suspense>
        </div>
    );
}
