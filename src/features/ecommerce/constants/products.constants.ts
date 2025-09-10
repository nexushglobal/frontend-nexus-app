import { ProductStatus } from '../types/enums-products';

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.AVAILABLE]: 'Disponible',
  [ProductStatus.OUT_OF_STOCK]: 'Sin Stock',
  [ProductStatus.LOW_STOCK]: 'Stock Bajo',
} as const;

export const PRODUCT_STATUS_VARIANTS = {
  [ProductStatus.AVAILABLE]: {
    variant: 'default' as const,
    className:
      'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  [ProductStatus.OUT_OF_STOCK]: {
    variant: 'destructive' as const,
    className:
      'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400',
  },
  [ProductStatus.LOW_STOCK]: {
    variant: 'secondary' as const,
    className:
      'border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  },
} as const;
