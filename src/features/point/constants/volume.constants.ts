import { VolumeStatus } from "../types/enums-volume";

export const VOLUME_STATUS_LABELS: Record<VolumeStatus, string> = {
  [VolumeStatus.PENDING]: "Pendiente",
  [VolumeStatus.PROCESSED]: "Procesado",
  [VolumeStatus.CANCELLED]: "Cancelado",
} as const;

export const VOLUME_STATUS_VARIANTS = {
  [VolumeStatus.PENDING]: {
    variant: "secondary" as const,
    className:
      "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  [VolumeStatus.PROCESSED]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [VolumeStatus.CANCELLED]: {
    variant: "destructive" as const,
    className:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
} as const;