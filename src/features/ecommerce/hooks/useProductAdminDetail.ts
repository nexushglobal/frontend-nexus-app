'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProductService } from '../service/productService';
import type {
  ProductDetailAdmin,
  StockProductHistoryResponse,
} from '../types/product.type';

interface UseProductAdminDetailProps {
  productId: string;
}

interface UseProductAdminDetailReturn {
  // State
  activeSection: string;
  isMobile: boolean;
  product: ProductDetailAdmin | null;
  stockHistory: StockProductHistoryResponse | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  isLoadingStock: boolean;
  error: string | null;

  // Actions
  setActiveSection: (section: string) => void;
  handleProductUpdate: () => Promise<void>;
  handleStockUpdate: () => Promise<void>;
}

export function useProductAdminDetail({
  productId,
}: UseProductAdminDetailProps): UseProductAdminDetailReturn {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [product, setProduct] = useState<ProductDetailAdmin | null>(null);
  const [stockHistory, setStockHistory] =
    useState<StockProductHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cargar datos iniciales
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

  return {
    // State
    activeSection,
    isMobile,
    product,
    stockHistory,
    isLoading,
    isLoadingProduct,
    isLoadingStock,
    error,

    // Actions
    setActiveSection,
    handleProductUpdate,
    handleStockUpdate,
  };
}
