export const PRODUCT_CACHE_TAGS = {
  PRODUCT_LIST: "product-list",
  PRODUCT_DETAILS: "product-details",
} as const;

export const CATEGORY_CACHE_TAGS = {
  CATEGORY_LIST: "category-list",
  CATEGORY_DETAILS: "category-details",
} as const;

export const REVALIDATE_TIME = 60 * 5;

export const PRODUCT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
