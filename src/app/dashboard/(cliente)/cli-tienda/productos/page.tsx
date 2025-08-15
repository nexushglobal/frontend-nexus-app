import { getCategoriesAction } from '@/features/ecommerce/actions/get-products';
import ProductListClientPage from '@/features/ecommerce/components/pages/ProductListClientPage';

export default async function Page() {
  const result = await getCategoriesAction();
  const categories = result.success && result.data ? result.data : [];
  return <ProductListClientPage categories={categories} />;
}
