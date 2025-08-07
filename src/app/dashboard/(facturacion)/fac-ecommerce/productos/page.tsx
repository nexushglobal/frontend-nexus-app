import ProductListAdminPage from '@/features/ecommerce/components/pages/ProductListAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos | Dashboard',
  description:
    'Gestiona y revisa el catálogo de productos disponibles en la tienda',
};

export default function Page() {
  return <ProductListAdminPage />;
}
