export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  documentNumber?: string;
}

export interface ApprovePaymentRequest {
  codeOperation?: string;
  banckName: string;
  dateOperation: string;
  numberTicket?: string;
}

export interface RejectPaymentRequest {
  rejectionReason: string;
}

export interface CompletePaymentRequest {
  codeOperation: string;
  numberTicket: string;
}

export interface PaymentApprovalResponse {
  paymentId: string;
  status: string;
  reviewedBy: string;
  reviewedAt: string;
  user: UserInfo;
}

export interface PaymentRejectionResponse {
  paymentId: string;
  reason: string;
  user: UserInfo;
}

export interface PaymentOperationResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    status: string;
    reviewedBy?: string;
    reviewedAt?: string;
    reason?: string;
    user?: UserInfo;
  };
}

export interface PaymentCompleteResponse {
  paymentId: string;
  status: string;
}
