import { PaymentAdminDetailPage } from '@/features/payment/components/pages/PaymentAdminDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Pago | Dashboard Admin',
  description:
    'Información completa y detallada del pago - Vista Administrador',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <PaymentAdminDetailPage paymentId={id} />;
}
