import { PaymentAdminPage } from '@/features/payment/components/pages/PaymentAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagos | Dashboard',
  description: 'Gestiona y revisa el historial de los pagos realizados',
};

export default function Page() {
  return <PaymentAdminPage />;
}
