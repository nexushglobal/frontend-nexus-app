import { CurrencyType, DocumentType, SaleStatus, SaleType } from "./sale.enums";
import { Sale, Source, Ubigeo } from "./sale.types";

export interface CreateSaleResponse {
  id: string;
  clientFullName: string;
  phone?: string;
  currency: CurrencyType;
  amount: string;
  amountInitial?: number;
  numberCoutes?: number;
  type: SaleType;
  status: SaleStatus;
  saleIdReference: string;
  vendorId: string;
}

export interface SaleResponse {
  items: Sale[];
}

export interface Amortization {
  couteAmount: number;
  expectedPaymentDate: string;
}

export interface AmortizationResponse {
  installments: Amortization[];
}

interface Visits {
  id: string;
  arrivalTime: string;
  departureTime: string;
  observations: string;
  createdAt: string;
}

export interface ClientResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: DocumentType;
  phone: string;
  phone2: string;
  age: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isInOffice: boolean;
  reportPdfUrl: string;
  source: Source;
  ubigeo: Ubigeo;
  visits: Visits[];
}

export interface ClientGuarantorResponse {
  clientId: number;
  guarantorId: number;
  secondaryClientIds: number[];
}
