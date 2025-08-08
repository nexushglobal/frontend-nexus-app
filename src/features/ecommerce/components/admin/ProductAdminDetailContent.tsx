'use client';

import { motion } from 'framer-motion';
import { useProductAdminDetail } from '../../hooks/useProductAdminDetail';
import type { CategoryDetail } from '../../types/product.type';
import { ProductSectionRenderer } from './ProductSectionRenderer';
import { DesktopSidebar } from './ui/DesktopSidebar';
import { MobileNavigation } from './ui/MobileNavigation';
import { ErrorState, LoadingState } from './ui/StateComponents';

interface ProductAdminDetailContentProps {
  productId: string;
  categories: CategoryDetail[];
}

export function ProductAdminDetailContent({
  productId,
  categories,
}: ProductAdminDetailContentProps) {
  const {
    activeSection,
    isMobile,
    product,
    stockHistory,
    isLoading,
    isLoadingProduct,
    isLoadingStock,
    error,
    setActiveSection,
    handleProductUpdate,
    handleStockUpdate,
  } = useProductAdminDetail({ productId });

  const renderSection = () => {
    if (!product || !stockHistory) return null;

    return (
      <ProductSectionRenderer
        activeSection={activeSection}
        product={product}
        stockHistory={stockHistory}
        categories={categories}
        isLoadingProduct={isLoadingProduct}
        isLoadingStock={isLoadingStock}
        onProductUpdate={handleProductUpdate}
        onStockUpdate={handleStockUpdate}
      />
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return <ErrorState error={error || undefined} />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <MobileNavigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <DesktopSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      <div className="col-span-9">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}
