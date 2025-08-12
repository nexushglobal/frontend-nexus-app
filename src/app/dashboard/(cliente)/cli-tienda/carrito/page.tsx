import CartClientPage from '@features/ecommerce/components/pages/CartClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito',
};

export default function Page() {
  return <CartClientPage />;
}
