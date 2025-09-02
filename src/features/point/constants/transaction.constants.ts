import { TransactionStatus } from "../types/enums-transaction";

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: "Pendiente",
  [TransactionStatus.COMPLETED]: "Completado",
  [TransactionStatus.CANCELLED]: "Cancelado",
  [TransactionStatus.FAILED]: "Fallido",
} as const;

export const TRANSACTION_STATUS_VARIANTS = {
  [TransactionStatus.PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [TransactionStatus.COMPLETED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [TransactionStatus.CANCELLED]: {
    variant: "secondary" as const,
    className:
      "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
  [TransactionStatus.FAILED]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
} as const;