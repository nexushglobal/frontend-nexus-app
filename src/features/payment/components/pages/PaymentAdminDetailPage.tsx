import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertTriangle } from 'lucide-react';
import { Suspense } from 'react';
import { getPaymentDetailAdminAction } from '../../actions/get-payment-detail';
import { PaymentAdminDetailContent } from '../admin/PaymentAdminDetailContent';
import { PaymentDetailLoading } from '../shared/skeleton/PaymentDetailLoading';

interface PaymentAdminDetailPageProps {
  paymentId: string;
}

async function PaymentAdminDetailData({ paymentId }: { paymentId: string }) {
  const result = await getPaymentDetailAdminAction(paymentId);

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

  return (
    <PaymentAdminDetailContent payment={result.data} paymentId={paymentId} />
  );
}

export function PaymentAdminDetailPage({
  paymentId,
}: PaymentAdminDetailPageProps) {
  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${paymentId}`}
        subtitle="Información completa y detallada del pago - Vista Administrador"
        variant="gradient"
        backUrl="/dashboard/fac-pagos"
        className="mb-6"
      />

      <Suspense fallback={<PaymentDetailLoading />}>
        <PaymentAdminDetailData paymentId={paymentId} />
      </Suspense>
    </div>
  );
}
