import { OrderStatus } from "../types/enums-orders";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pendiente",
  [OrderStatus.APPROVED]: "Aprobado",
  [OrderStatus.SENT]: "Enviado",
  [OrderStatus.DELIVERED]: "Entregado",
  [OrderStatus.REJECTED]: "Rechazado",
  [OrderStatus.CANCELED]: "Cancelado",
} as const;

export const ORDER_STATUS_VARIANTS = {
  [OrderStatus.PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [OrderStatus.APPROVED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [OrderStatus.SENT]: {
    variant: "default" as const,
    className:
      "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  [OrderStatus.DELIVERED]: {
    variant: "default" as const,
    className:
      "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  [OrderStatus.REJECTED]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
  [OrderStatus.CANCELED]: {
    variant: "secondary" as const,
    className:
      "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
} as const;