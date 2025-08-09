import { ProductAdminDetailPage } from '@/features/ecommerce/components/pages/ProductAdminDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Producto | Dashboard Admin',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ProductAdminDetailPage productId={id} />;
}
