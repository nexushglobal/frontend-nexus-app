import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertTriangle } from 'lucide-react';
import { Suspense } from 'react';
import { getCategoriesAction } from '../../actions/get-products';
import { ProductAdminDetailContent } from '../admin/ProductAdminDetailContent';
import { ProductDetailLoading } from '../shared/skeleton/ProductDetailLoading';

interface ProductAdminDetailPageProps {
  productId: string;
}

async function ProductAdminDetailData({ productId }: { productId: string }) {
  const categoriesResult = await getCategoriesAction();

  if (!categoriesResult.success || !categoriesResult.data) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {categoriesResult.message || 'No se pudieron cargar las categorías'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ProductAdminDetailContent
      productId={productId}
      categories={categoriesResult.data}
    />
  );
}

export function ProductAdminDetailPage({
  productId,
}: ProductAdminDetailPageProps) {
  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Producto`}
        subtitle="Información completa y detallada del producto - Vista Administrador"
        variant="gradient"
        backUrl="/dashboard/fac-ecommerce/productos"
        className="mb-6"
      />

      <Suspense fallback={<ProductDetailLoading />}>
        <ProductAdminDetailData productId={productId} />
      </Suspense>
    </div>
  );
}
