export enum PaymentMethod {
  VOUCHER = "VOUCHER",
  POINTS = "POINTS",
  PAYMENT_GATEWAY = "PAYMENT_GATEWAY",
}

export interface Payment {
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  fileIndex: number;
}

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
  warning?: string;
}

export interface UserMembership {
  hasMembership: boolean;
  membershipId?: number;
  status?: string;
  plan?: {
    id: number;
    name: string;
    price: number;
  };
  endDate?: string;
  message: string;
}

export interface PlanDetailResponse {
  plan: MembershipPlan;
  userMembership: UserMembership;
}

export interface PaymentSubscribeRequest {
  planId: number;
  paymentMethod: PaymentMethod;
  payments?: Payment[];
  paymentImages?: File[];
}

export interface PaymentResult {
  isUpgrade: boolean;
  totalAmount: number;
  membership: {
    id: number;
    planName: string;
    status: string;
    endDate: string;
  };
  payment: {
    id: string;
  };
}
