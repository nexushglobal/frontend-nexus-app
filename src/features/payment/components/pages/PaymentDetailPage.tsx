import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertTriangle } from 'lucide-react';
import { Suspense } from 'react';
import { getPaymentDetailAction } from '../../actions/get-payment-detail';
import { PaymentDetailLoading } from '../shared/skeleton/PaymentDetailLoading';
import { PaymentDetailContent } from '../user/PaymentDetailContent';

interface PaymentDetailPageProps {
  paymentId: string;
}

async function PaymentDetailData({ paymentId }: { paymentId: string }) {
  const result = await getPaymentDetailAction(paymentId);

  if (!result.success || !result.data) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {result.message || 'No se pudo cargar el detalle del pago'}
        </AlertDescription>
      </Alert>
    );
  }

  return <PaymentDetailContent payment={result.data} paymentId={paymentId} />;
}

export function PaymentDetailPage({ paymentId }: PaymentDetailPageProps) {
  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${paymentId}`}
        subtitle="Información completa y detallada del pago"
        variant="gradient"
        backUrl="/dashboard/cli-transacciones/mis-pagos"
        className="mb-6"
      />

      <Suspense fallback={<PaymentDetailLoading />}>
        <PaymentDetailData paymentId={paymentId} />
      </Suspense>
    </div>
  );
}
