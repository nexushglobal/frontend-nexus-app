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
