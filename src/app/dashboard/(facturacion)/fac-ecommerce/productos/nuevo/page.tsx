import ProductCreatePage from '@/features/ecommerce/components/pages/ProductCreatePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Producto | Dashboard',
  description: 'Crea un nuevo producto para la tienda',
};

export default function Page() {
  return <ProductCreatePage />;
}
