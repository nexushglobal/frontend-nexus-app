'use client';

import type {
  CategoryDetail,
  ProductDetailAdmin,
  StockProductHistoryResponse,
} from '../../types/product.type';
import { ProductDetailForm } from './forms/ProductDetailForm';
import { ProductImagesSection } from './sections/ProductImagesSection';
import { ProductOverviewSection } from './sections/ProductOverviewSection';
import { ProductStockSection } from './sections/ProductStockSection';

interface ProductSectionRendererProps {
  activeSection: string;
  product: ProductDetailAdmin;
  stockHistory: StockProductHistoryResponse;
  categories: CategoryDetail[];
  isLoadingProduct: boolean;
  isLoadingStock: boolean;
  onProductUpdate: () => Promise<void>;
  onStockUpdate: () => Promise<void>;
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

function LoadingOverlay({
  isLoading,
  message = 'Actualizando...',
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

export function ProductSectionRenderer({
  activeSection,
  product,
  stockHistory,
  categories,
  isLoadingProduct,
  isLoadingStock,
  onProductUpdate,
  onStockUpdate,
}: ProductSectionRendererProps) {
  switch (activeSection) {
    case 'overview':
      return (
        <div className="relative">
          <LoadingOverlay isLoading={isLoadingProduct} />
          <ProductOverviewSection product={product} />
        </div>
      );

    case 'edit':
      return (
        <div className="relative">
          <LoadingOverlay isLoading={isLoadingProduct} />
          <ProductDetailForm
            product={product}
            categories={categories}
            onUpdate={onProductUpdate}
          />
        </div>
      );

    case 'images':
      return (
        <div className="relative">
          <LoadingOverlay isLoading={isLoadingProduct} />
          <ProductImagesSection product={product} onUpdate={onProductUpdate} />
        </div>
      );

    case 'stock':
      return (
        <div className="relative">
          <LoadingOverlay isLoading={isLoadingStock} />
          <ProductStockSection
            product={product}
            stockHistory={stockHistory}
            onStockUpdate={onStockUpdate}
          />
        </div>
      );

    default:
      return <ProductOverviewSection product={product} />;
  }
}
