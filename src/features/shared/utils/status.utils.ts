import {
  AlertCircle,
  Ban,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

export interface StatusConfig {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
  label: string;
  icon: LucideIcon;
}

// Generic status configuration interface
export interface StatusVariantConfig {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}

// Generic function to create status configuration
export function createStatusConfig<T extends string>(
  status: T,
  variants: Record<T, StatusVariantConfig>,
  labels: Record<T, string>,
  iconMap: Record<T, LucideIcon>,
): StatusConfig {
  const variantConfig = variants[status];
  return {
    ...variantConfig,
    label: labels[status],
    icon: iconMap[status],
  };
}

// Payment specific status utilities (re-exported for convenience)
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
} from '../../payment/constants/payments.constants';
import { PaymentStatus } from '../../payment/types/enums-payments';

// Withdrawal specific status utilities
import {
  WITHDRAWAL_STATUS_LABELS,
  WITHDRAWAL_STATUS_VARIANTS,
} from '../../withdrawals/constants/withdrawals.constants';
import { WithdrawalStatus } from '../../withdrawals/types/enums-withdrawals';

// Order specific status utilities
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from '../../ecommerce/constants/orders.constants';
import { OrderStatus } from '../../ecommerce/types/enums-orders';

// Volume specific status utilities
import {
  VOLUME_STATUS_LABELS,
  VOLUME_STATUS_VARIANTS,
} from '../../point/constants/volume.constants';
import { VolumeStatus } from '../../point/types/enums-volume';

// Transaction specific status utilities
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_VARIANTS,
} from '../../point/constants/transaction.constants';
import { TransactionStatus } from '../../point/types/enums-transaction';

// Product specific status utilities
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_VARIANTS,
} from '../../ecommerce/constants/products.constants';
import { ProductStatus } from '../../ecommerce/types/enums-products';

// Banner specific status utilities
import {
  BANNER_STATUS_LABELS,
  BANNER_STATUS_VARIANTS,
} from '../../dashboard/constants/banner.constants';
import { BannerStatus } from '../../dashboard/types/enums-banner';

const PAYMENT_STATUS_ICONS: Record<PaymentStatus, LucideIcon> = {
  [PaymentStatus.PENDING]: Clock,
  [PaymentStatus.APPROVED]: CheckCircle,
  [PaymentStatus.REJECTED]: XCircle,
  [PaymentStatus.COMPLETED]: CheckCircle,
} as const;

const WITHDRAWAL_STATUS_ICONS: Record<WithdrawalStatus, LucideIcon> = {
  [WithdrawalStatus.PENDING]: Clock,
  [WithdrawalStatus.APPROVED]: CheckCircle,
  [WithdrawalStatus.REJECTED]: XCircle,
  [WithdrawalStatus.PENDING_SIGNATURE]: Clock,
} as const;

const ORDER_STATUS_ICONS: Record<OrderStatus, LucideIcon> = {
  [OrderStatus.PENDING]: Clock,
  [OrderStatus.APPROVED]: CheckCircle,
  [OrderStatus.SENT]: Truck,
  [OrderStatus.DELIVERED]: Package,
  [OrderStatus.REJECTED]: XCircle,
  [OrderStatus.CANCELED]: AlertCircle,
} as const;

const VOLUME_STATUS_ICONS: Record<VolumeStatus, LucideIcon> = {
  [VolumeStatus.PENDING]: Clock,
  [VolumeStatus.PROCESSED]: CheckCircle,
  [VolumeStatus.CANCELLED]: XCircle,
} as const;

const TRANSACTION_STATUS_ICONS: Record<TransactionStatus, LucideIcon> = {
  [TransactionStatus.PENDING]: Clock,
  [TransactionStatus.COMPLETED]: CheckCircle,
  [TransactionStatus.CANCELLED]: Ban,
  [TransactionStatus.FAILED]: XCircle,
} as const;

const PRODUCT_STATUS_ICONS: Record<ProductStatus, LucideIcon> = {
  [ProductStatus.AVAILABLE]: CheckCircle,
  [ProductStatus.OUT_OF_STOCK]: XCircle,
  [ProductStatus.LOW_STOCK]: AlertCircle,
} as const;

const BANNER_STATUS_ICONS: Record<BannerStatus, LucideIcon> = {
  [BannerStatus.ACTIVE]: CheckCircle,
  [BannerStatus.INACTIVE]: XCircle,
} as const;

// Generic overloaded function for different status types
export function getStatusConfig(status: PaymentStatus): StatusConfig;
export function getStatusConfig(status: WithdrawalStatus): StatusConfig;
export function getStatusConfig(status: OrderStatus): StatusConfig;
export function getStatusConfig(status: VolumeStatus): StatusConfig;
export function getStatusConfig(status: TransactionStatus): StatusConfig;
export function getStatusConfig(status: ProductStatus): StatusConfig;
export function getStatusConfig(status: BannerStatus): StatusConfig;
export function getStatusConfig(
  status:
    | PaymentStatus
    | WithdrawalStatus
    | OrderStatus
    | VolumeStatus
    | TransactionStatus
    | ProductStatus
    | BannerStatus,
): StatusConfig {
  // Check if it's a payment status
  if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    return createStatusConfig(
      status as PaymentStatus,
      PAYMENT_STATUS_VARIANTS,
      PAYMENT_STATUS_LABELS,
      PAYMENT_STATUS_ICONS,
    );
  }

  // Check if it's a withdrawal status
  if (Object.values(WithdrawalStatus).includes(status as WithdrawalStatus)) {
    return createStatusConfig(
      status as WithdrawalStatus,
      WITHDRAWAL_STATUS_VARIANTS,
      WITHDRAWAL_STATUS_LABELS,
      WITHDRAWAL_STATUS_ICONS,
    );
  }

  // Check if it's an order status
  if (Object.values(OrderStatus).includes(status as OrderStatus)) {
    return createStatusConfig(
      status as OrderStatus,
      ORDER_STATUS_VARIANTS,
      ORDER_STATUS_LABELS,
      ORDER_STATUS_ICONS,
    );
  }

  // Check if it's a volume status
  if (Object.values(VolumeStatus).includes(status as VolumeStatus)) {
    return createStatusConfig(
      status as VolumeStatus,
      VOLUME_STATUS_VARIANTS,
      VOLUME_STATUS_LABELS,
      VOLUME_STATUS_ICONS,
    );
  }

  // Check if it's a transaction status
  if (Object.values(TransactionStatus).includes(status as TransactionStatus)) {
    return createStatusConfig(
      status as TransactionStatus,
      TRANSACTION_STATUS_VARIANTS,
      TRANSACTION_STATUS_LABELS,
      TRANSACTION_STATUS_ICONS,
    );
  }

  // Check if it's a product status
  if (Object.values(ProductStatus).includes(status as ProductStatus)) {
    return createStatusConfig(
      status as ProductStatus,
      PRODUCT_STATUS_VARIANTS,
      PRODUCT_STATUS_LABELS,
      PRODUCT_STATUS_ICONS,
    );
  }

  // Check if it's a banner status
  if (Object.values(BannerStatus).includes(status as BannerStatus)) {
    return createStatusConfig(
      status as BannerStatus,
      BANNER_STATUS_VARIANTS,
      BANNER_STATUS_LABELS,
      BANNER_STATUS_ICONS,
    );
  }

  // Fallback
  throw new Error(`Unsupported status type: ${status}`);
}

// Method translation utilities
export function translatePaymentMethod(method: string): string {
  const methodTranslations: Record<string, string> = {
    POINTS: 'Puntos',
    VOUCHER: 'Voucher',
    PAYMENT_GATEWAY: 'Pasarela de Pago',
  };

  return methodTranslations[method] || method;
}
