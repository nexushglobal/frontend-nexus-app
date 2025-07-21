import { SaleStatus, SaleType, StatusPayment } from "./sale.enums";

export interface CreateSalePayload {
  lotId: string;
  saleType: "DIRECT_PAYMENT" | "FINANCED";
  clientId: number;
  isReservation?: boolean;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  secondaryClientsIds: number[];
  guarantorId: number;
  totalAmount: number;

  totalAmountUrbanDevelopment: number;
  quantityHuCuotes?: number;
  initialAmountUrbanDevelopment?: number;
  firstPaymentDateHu?: string;

  initialAmount?: number;
  interestRate?: number;
  quantitySaleCoutes?: number;
  financingInstallments?: Array<{
    couteAmount: number;
    expectedPaymentDate: string;
  }>;
}

export interface CalulateAmortizationPayload {
  totalAmount: number;
  initialAmount: number;
  reservationAmount: number;
  interestRate: number;
  numberOfPayments: number;
  firstPaymentDate: string;
  includeDecimals: boolean;
}

export interface Source {
  id: number;
  name: string;
}

export interface Ubigeo {
  id: number;
  name: string;
  code: string;
  parentId?: number;
}

export interface LeadsVendor {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone: string;
  phone2: string | undefined;
  age: number;
  createdAt: string;
  source: Source;
  ubigeo: Ubigeo;
}

export interface Client {
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
  reportPdfUrl: string | null;
}

export interface SecondaryClient {
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
  address: string;
}

export interface Sale {
  id: string;
  clientFullName: string;
  phone: string | null;
  currency: string;
  amount: string;
  amountInitial: string | null;
  numberCoutes: number | null;
  type: SaleType;
  status: SaleStatus;
  saleIdReference: string;
  vendorId: string;
}

interface PaymentSummary {
  id: number;
  amount: number;
  status: StatusPayment;
  createdAt: string;
  reviewedAt: string;
  reviewBy: {
    id: string;
    email: string;
  } | null;
  codeOperation: string;
  banckName: string;
  dateOperation: string;
  numberTicket: string;
  paymentConfig: string;
  reason: string | null;
}

export interface SaleDetail {
  id: string;
  type: SaleType;
  totalAmount: string;
  status: SaleStatus;
  createdAt: string;
  reservationAmount: string | null;
  maximumHoldPeriod: string | null;
  fromReservation: boolean;
  currency: string;
  client: {
    address: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    reportPdfUrl: string | null;
  };
  secondaryClients: {
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  lot: {
    id: string;
    name: string;
    lotPrice: string;
    block: string;
    stage: string;
    project: string;
  };
  radicationPdfUrl: string | null;
  paymentAcordPdfUrl: string | null;
  liner: {
    firstName: string;
    lastName: string;
  } | null;
  telemarketingSupervisor: {
    firstName: string;
    lastName: string;
  } | null;
  telemarketingConfirmer: {
    firstName: string;
    lastName: string;
  } | null;
  telemarketer: {
    firstName: string;
    lastName: string;
  } | null;
  fieldManager: {
    firstName: string;
    lastName: string;
  } | null;
  fieldSupervisor: {
    firstName: string;
    lastName: string;
  } | null;
  fieldSeller: {
    firstName: string;
    lastName: string;
  } | null;
  guarantor: {
    firstName: string;
    lastName: string;
  } | null;
  vendor: {
    document: string;
    firstName: string;
    lastName: string;
  };
  paymentsSummary: PaymentSummary[];
}
