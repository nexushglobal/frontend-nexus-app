// src/features/ecommerce/components/admin/ProductAdminDetailContent.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProductService } from '../../service/productService';
import type {
  CategoryDetail,
  ProductDetailAdmin,
  StockProductHistoryResponse,
} from '../../types/product.type';
import { productDetailMenuSections } from '../../utils/menu.utils';
import { ProductDetailForm } from './forms/ProductDetailForm';
import { ProductImagesSection } from './sections/ProductImagesSection';
import { ProductOverviewSection } from './sections/ProductOverviewSection';
import { ProductStockSection } from './sections/ProductStockSection';

interface ProductAdminDetailContentProps {
  productId: string;
  categories: CategoryDetail[];
}

export function ProductAdminDetailContent({
  productId,
  categories,
}: ProductAdminDetailContentProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [product, setProduct] = useState<ProductDetailAdmin | null>(null);
  const [stockHistory, setStockHistory] =
    useState<StockProductHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [productData, stockData] = await Promise.all([
        ProductService.getProductAdmin(Number(productId)),
        ProductService.getHistoryProductStock(Number(productId), {
          limit: 10,
          page: 1,
        }),
      ]);

      setProduct(productData);
      setStockHistory(stockData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar los datos del producto',
      );
      toast.error('Error al cargar los datos del producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductUpdate = async () => {
    if (!product) return;

    setIsLoadingProduct(true);
    try {
      // Solo recargar los datos del producto, no revalidar toda la página
      const productData = await ProductService.getProductAdmin(
        Number(productId),
      );
      setProduct(productData);
      toast.success('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handleStockUpdate = async () => {
    setIsLoadingStock(true);
    try {
      // Recargar tanto el producto (para el stock actual) como el historial
      const [productData, stockData] = await Promise.all([
        ProductService.getProductAdmin(Number(productId)),
        ProductService.getHistoryProductStock(Number(productId), {
          limit: 10,
          page: 1,
        }),
      ]);
      setProduct(productData);
      setStockHistory(stockData);
      toast.success('Stock actualizado exitosamente');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error al actualizar el stock');
    } finally {
      setIsLoadingStock(false);
    }
  };

  const renderSection = () => {
    if (!product || !stockHistory) return null;

    switch (activeSection) {
      case 'overview':
        return (
          <div className="relative">
            {isLoadingProduct && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Actualizando...
                  </span>
                </div>
              </div>
            )}
            <ProductOverviewSection product={product} />
          </div>
        );
      case 'edit':
        return (
          <div className="relative">
            {isLoadingProduct && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Actualizando...
                  </span>
                </div>
              </div>
            )}
            <ProductDetailForm
              product={product}
              categories={categories}
              onUpdate={handleProductUpdate}
            />
          </div>
        );
      case 'images':
        return (
          <div className="relative">
            {isLoadingProduct && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Actualizando...
                  </span>
                </div>
              </div>
            )}
            <ProductImagesSection
              product={product}
              onUpdate={handleProductUpdate}
            />
          </div>
        );
      case 'stock':
        return (
          <div className="relative">
            {isLoadingStock && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Actualizando...
                  </span>
                </div>
              </div>
            )}
            <ProductStockSection
              product={product}
              stockHistory={stockHistory}
              onStockUpdate={handleStockUpdate}
            />
          </div>
        );
      default:
        return <ProductOverviewSection product={product} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">
          {error || 'Producto no encontrado'}
        </p>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Navegación mobile */}
        <div className="space-y-4">
          {/* Tabs principales */}
          <div className="grid grid-cols-4 w-full gap-1 bg-muted p-1 rounded-lg">
            {['overview', 'edit', 'images', 'stock'].map((tabId) => {
              const section = productDetailMenuSections.find(
                (s) => s.id === tabId,
              );
              const isActive = activeSection === tabId;

              return (
                <button
                  key={tabId}
                  onClick={() => setActiveSection(tabId)}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {section?.shortLabel || section?.label}
                </button>
              );
            })}
          </div>

          {/* Contenido de las secciones */}
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
      {/* Sidebar - Menu de navegación */}
      <div className="col-span-3">
        <Card>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {productDetailMenuSections.map((section) => {
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-muted/50 ${
                      isActive
                        ? 'bg-primary/10 text-primary border-r-2 border-r-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <section.icon className="h-4 w-4 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {section.label}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {section.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
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
