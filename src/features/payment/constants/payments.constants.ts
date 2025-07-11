import { PaymentStatus } from "../types/enums-payments";

export const PAYMENT_CACHE_TAGS = {
  USER_PAYMENTS: "user-payments",
  PAYMENT_DETAIL: "payment-detail",
  ADMIN_PAYMENTS: "admin-payments",
  ADMIN_PAYMENT_DETAIL: "admin-payment-detail",
} as const;

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Pendiente",
  [PaymentStatus.APPROVED]: "Aprobado",
  [PaymentStatus.REJECTED]: "Rechazado",
  [PaymentStatus.COMPLETED]: "Completado",
} as const;

export const PAYMENT_STATUS_VARIANTS = {
  [PaymentStatus.PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [PaymentStatus.APPROVED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [PaymentStatus.REJECTED]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  [PaymentStatus.COMPLETED]: {
    variant: "default" as const,
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
} as const;

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Fecha" },
  { value: "amount", label: "Monto" },
  { value: "status", label: "Estado" },
  { value: "updatedAt", label: "Actualización" },
] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

export const REVALIDATE_TIME = 300; // 5 minutos

export const CURRENCY_FORMAT_OPTIONS = {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
} as const;

export const DATE_FORMAT = "dd/MM/yyyy" as const;
export const TIME_FORMAT = "HH:mm" as const;
