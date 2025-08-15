import OrderClientPage from '@/features/ecommerce/components/pages/OrderClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Pedidos | Dashboard',
  description: 'Consulta el historial y estado de tus pedidos',
};

export default function Page() {
  return <OrderClientPage />;
}
