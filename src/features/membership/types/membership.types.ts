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
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
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

export interface Membership {
  status:
    | 'PENDING'
    | 'INACTIVE'
    | 'ACTIVE'
    | 'EXPIRED'
    | 'DELETED'
    | 'SUSPENDED';
  startDate: string;
  endDate: string; // like "2025-09-12",
  paidAmount: number; // like "2025-09-12",
  plan: {
    name: string;
    price: number;
    binaryPoints: number;
    commissionPercentage: number;
  };
}
export interface Reconsumption {
  amount: number;
  periodDate: string; // like "2025-09-12",
  createdAt: string; // like "2025-08-13T05:42:00.126Z"
}
export interface MembershipDetailResponse {
  membership: Membership;
  canReconsume: boolean;
  lastReconsumption: Reconsumption | null;
  pendingReconsumption: Reconsumption | null;
}

export interface MembershipHistoryItem {
  id: number;
  action:
    | 'CREATED'
    | 'RENEWED'
    | 'CANCELLED'
    | 'REACTIVATED'
    | 'EXPIRED'
    | 'STATUS_CHANGED'
    | 'PAYMENT_RECEIVED'
    | 'PLAN_CHANGED'
    | 'RECONSUMPTION_ADDED'
    | 'PURCHASE'
    | 'UPGRADE';
  changes: Record<string, any> | null;
  metadata: Record<string, any> | null;
  notes: string;
  createdAt: string; // like "2025-08-13T05:42:00.126Z"
}

import { PaginationMeta } from '@/features/shared/types/api.types';

export interface MembershipHistoryResponse extends PaginationMeta {
  items: MembershipHistoryItem[];
}
