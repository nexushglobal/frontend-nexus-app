'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/context/CartStore';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { ArrowLeft, Loader2, Package, ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { AddToCartControls } from '../../components/client/detail/AddToCartControls';
import { ProductGallery } from '../../components/client/detail/ProductGallery';
import { ProductInfoPanel } from '../../components/client/detail/ProductInfoPanel';
import { useClientProductDetail } from '../../hooks/useClientProductDetail';

interface Props {
  productId: string;
}

export default function ProductClientDetailPage({ productId }: Props) {
  const { data: product, isLoading } = useClientProductDetail(productId);
  const { itemCount } = useCartStore();

  if (isLoading || !product) {
    return (
      <div className="container space-y-6">
        <ProductDetailHeader isLoading={true} itemCount={itemCount} />
        <LoadingState />
      </div>
    );
  }

  const effectivePrice = product.price;
  const mainImage =
    product.images?.find((i) => i.isMain)?.url || product.images?.[0]?.url;

  return (
    <div className="container space-y-6">
      <ProductDetailHeader
        productName={product.name}
        categoryName={product.category?.name}
        itemCount={itemCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery Section */}
        <div className="space-y-4">
          <ProductGallery name={product.name} images={product.images} />
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Product Header */}
          <div className="space-y-4">
            <ProductBreadcrumb categoryName={product.category?.name} />

            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            <PriceSection price={effectivePrice} priceOff={product.priceOff} />
          </div>

          {/* Add to Cart */}
          <Card className="border-primary/20 bg-primary/5 py-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agregar al carrito</h3>
              <AddToCartControls
                productId={product.id}
                productName={product.name}
                price={effectivePrice}
                image={mainImage}
              />
            </CardContent>
          </Card>

          {/* Product Information */}
          <ProductInfoPanel
            name={product.name}
            categoryName={product.category?.name}
            sku={product.sku}
            price={effectivePrice}
            priceOff={product.priceOff}
            description={product.description}
            composition={product.composition}
            benefits={product.benefits}
          />
        </div>
      </div>
    </div>
  );
}

// Enhanced Header Component
interface ProductDetailHeaderProps {
  productName?: string;
  categoryName?: string;
  itemCount: number;
  isLoading?: boolean;
}

function ProductDetailHeader({
  productName = 'Detalle del producto',
  categoryName,
  itemCount,
  isLoading = false,
}: ProductDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cli-tienda/productos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">
            {isLoading ? 'Cargando...' : productName}
          </h1>
          {categoryName && !isLoading && (
            <p className="text-muted-foreground">{categoryName}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/cli-tienda/productos">
          <Button variant="outline" className="gap-2">
            <Store className="h-4 w-4" />
            Ver más productos
          </Button>
        </Link>

        <Link href="/dashboard/cli-tienda/carrito">
          <Button className="gap-2 relative">
            <ShoppingCart className="h-4 w-4" />
            Mi Carrito
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Breadcrumb Component
function ProductBreadcrumb({ categoryName }: { categoryName?: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/dashboard/cli-tienda/productos"
        className="hover:text-primary"
      >
        Tienda
      </Link>
      <span>/</span>
      {categoryName && (
        <>
          <span className="text-primary">{categoryName}</span>
          <span>/</span>
        </>
      )}
      <span>Producto</span>
    </nav>
  );
}

// Price Section Component
function PriceSection({
  price,
  priceOff,
}: {
  price: number;
  priceOff?: number | null;
}) {
  const discountPercentage = priceOff
    ? Math.round(((priceOff - price) / priceOff) * 100)
    : 0;

  return (
    <div className="flex items-center gap-4">
      <span className="text-4xl font-bold text-primary">
        {formatCurrency(price)}
      </span>
      {priceOff && (
        <div className="flex flex-col">
          <span className="text-lg text-muted-foreground line-through">
            {formatCurrency(priceOff)}
          </span>
          <span className="text-sm font-medium text-destructive">
            {discountPercentage}% de descuento
          </span>
        </div>
      )}
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando imágenes...</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <Package className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              Cargando información del producto...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
