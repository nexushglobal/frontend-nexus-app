export const MEMBERSHIP_CACHE_TAGS = {
  MEMBERSHIP_PLANS: "membership-plans",
  USER_MEMBERSHIP: "user-membership",
} as const;

export const REVALIDATE_TIME = 60 * 5;

export const MEMBERSHIP_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
} as const;

export type MembershipStatus =
  (typeof MEMBERSHIP_STATUS)[keyof typeof MEMBERSHIP_STATUS];

export const MEMBERSHIP_PLAN_NAMES = {
  BASICO: "Básico",
  VIP: "VIP",
  PREMIUM: "Premium",
} as const;
