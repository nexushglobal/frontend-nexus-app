'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { Loader2 } from 'lucide-react';
import { AddToCartControls } from '../../components/client/detail/AddToCartControls';
import { ProductGallery } from '../../components/client/detail/ProductGallery';
import { ProductInfoPanel } from '../../components/client/detail/ProductInfoPanel';
import { useClientProductDetail } from '../../hooks/useClientProductDetail';

interface Props {
  productId: string;
}

export default function ProductClientDetailPage({ productId }: Props) {
  const { data: product, isLoading } = useClientProductDetail(productId);

  if (isLoading || !product) {
    return (
      <div className="container py-8">
        <PageHeader
          title="Detalle del producto"
          subtitle="Cargando..."
          variant="gradient"
          backUrl="/dashboard/(cliente)/cli-tienda"
        />
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando
            producto...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <PageHeader
        title={product.name}
        subtitle={product.category?.name}
        variant="gradient"
        backUrl="/dashboard/(cliente)/cli-tienda"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <ProductGallery name={product.name} images={product.images} />
        </div>

        <div className="md:col-span-7 space-y-4">
          <ProductInfoPanel
            name={product.name}
            categoryName={product.category?.name}
            sku={product.sku}
            price={product.price}
            priceOff={product.priceOff}
            description={product.description}
            composition={product.composition}
            benefits={product.benefits}
          />

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <AddToCartControls
                productId={product.id}
                productName={product.name}
                price={product.price}
                image={
                  product.images?.find((i) => i.isMain)?.url ||
                  product.images?.[0]?.url
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
