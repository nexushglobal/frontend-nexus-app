import OrderAdminPage from '@/features/ecommerce/components/pages/OrderAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedidos | Dashboard',
  description: 'Gestiona y revisa el historial de los pedidos realizados',
};

export default function Page() {
  return <OrderAdminPage />;
}
