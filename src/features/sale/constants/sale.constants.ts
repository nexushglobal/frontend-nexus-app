import { SaleStatus, SaleType, StatusPayment } from "../types/sale.enums";

export const SALE_CACHE_TAGS = {
  SALES: "sales",
  SALE_DETAIL: "sale-detail",
} as const;

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SaleStatus.RESERVATION_PENDING]: "Reserva Pendiente",
  [SaleStatus.RESERVATION_PENDING_APPROVAL]: "Reserva Pendiente Aprobación",
  [SaleStatus.RESERVED]: "Reservado",
  [SaleStatus.PENDING]: "Pendiente",
  [SaleStatus.PENDING_APPROVAL]: "Pendiente de Aprobación",
  [SaleStatus.APPROVED]: "Aprobado",
  [SaleStatus.IN_PAYMENT_PROCESS]: "En Proceso de Pago",
  [SaleStatus.COMPLETED]: "Completado",
  [SaleStatus.REJECTED]: "Rechazado",
  [SaleStatus.WITHDRAWN]: "Retirado",
} as const;

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  [SaleType.DIRECT_PAYMENT]: "Pago Directo",
  [SaleType.FINANCED]: "Financiado",
} as const;

export const PAYMENT_STATUS_LABELS: Record<StatusPayment, string> = {
  [StatusPayment.PENDING]: "Pendiente",
  [StatusPayment.APPROVED]: "Aprobado",
  [StatusPayment.REJECTED]: "Rechazado",
  [StatusPayment.COMPLETED]: "Completado",
  [StatusPayment.CANCELLED]: "Cancelado",
} as const;

export const SALE_STATUS_VARIANTS = {
  [SaleStatus.RESERVATION_PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [SaleStatus.RESERVATION_PENDING_APPROVAL]: {
    variant: "secondary" as const,
    className:
      "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  },
  [SaleStatus.RESERVED]: {
    variant: "default" as const,
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  [SaleStatus.PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [SaleStatus.PENDING_APPROVAL]: {
    variant: "secondary" as const,
    className:
      "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  },
  [SaleStatus.APPROVED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [SaleStatus.IN_PAYMENT_PROCESS]: {
    variant: "default" as const,
    className:
      "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  [SaleStatus.COMPLETED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [SaleStatus.REJECTED]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  [SaleStatus.WITHDRAWN]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
} as const;

export const SALE_TYPE_VARIANTS = {
  [SaleType.DIRECT_PAYMENT]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [SaleType.FINANCED]: {
    variant: "default" as const,
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
} as const;

export const PAYMENT_STATUS_VARIANTS = {
  [StatusPayment.PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [StatusPayment.APPROVED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [StatusPayment.REJECTED]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  [StatusPayment.COMPLETED]: {
    variant: "default" as const,
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
} as const;

export const CURRENCY_FORMAT_OPTIONS = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
} as const;

export const DATE_FORMAT = "dd/MM/yyyy" as const;
export const TIME_FORMAT = "HH:mm" as const;
