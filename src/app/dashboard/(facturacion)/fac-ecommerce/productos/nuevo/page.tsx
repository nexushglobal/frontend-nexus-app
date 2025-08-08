import ProductDetailAdminPage from '@/features/ecommerce/components/pages/ProductDetailAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle del Producto | Dashboard',
  description: 'Revisa los detalles del producto seleccionado en la tienda',
};

export default function Page() {
  return <ProductDetailAdminPage />;
}
