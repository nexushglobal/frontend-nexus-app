import ProductClientDetailPage from '@/features/ecommerce/components/pages/ProductClientDetailPage';

export default function Page({ params }: { params: { id: string } }) {
  return <ProductClientDetailPage productId={params.id} />;
}
