// src/features/membership/types/response-membership.ts

export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  checkAmount: number;
  binaryPoints: number;
  commissionPercentage: number;
  directCommissionAmount: number;
  products: string[];
  benefits: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  upgradeCost?: number;
  isUpgrade?: boolean;
}

export interface UserMembership {
  hasMembership: boolean;
  membershipId?: number;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  plan?: {
    id: number;
    name: string;
    price: number;
  };
  endDate?: string;
  message: string;
}

export interface MembershipData {
  plans: MembershipPlan[];
  userMembership: UserMembership;
}
