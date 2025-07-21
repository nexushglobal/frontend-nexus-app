import { SecondaryClient } from "./sale.types";

export interface ClientRequest {
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  email: string;
}

export interface ClientGuarantorRequest {
  createClient: {
    leadId: string;
    address: string;
  };
  createGuarantor:
    | {
        firstName: string;
        lastName: string;
        email: string;
        document: string;
        documentType: string;
        phone: string;
        address: string;
      }
    | undefined;
  createSecondaryClient: SecondaryClient[];
  document: string;
}
