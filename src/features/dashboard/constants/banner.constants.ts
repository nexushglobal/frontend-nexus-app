import { BannerStatus } from "../types/enums-banner";

export const BANNER_STATUS_LABELS: Record<BannerStatus, string> = {
  [BannerStatus.ACTIVE]: "Activo",
  [BannerStatus.INACTIVE]: "Inactivo",
} as const;

export const BANNER_STATUS_VARIANTS = {
  [BannerStatus.ACTIVE]: {
    variant: "default" as const,
    className:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  [BannerStatus.INACTIVE]: {
    variant: "secondary" as const,
    className:
      "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
} as const;