export interface ProfileData {
  id: string;
  email: string;
  referralCode: string;
  referrerCode: string | null;
  isActive: boolean;
  nickname: string | null;
  photo: string | null;
  personalInfo: PersonalInfo | null;
  contactInfo: ContactInfo | null;
  billingInfo: BillingInfo | null;
  bankInfo: BankInfo | null;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  gender: string;
  birthdate: string;
}

export interface ContactInfo {
  phone: string;
  address: string | null;
  postalCode: string | null;
  country: string;
}

export interface BillingInfo {
  ruc: string | null;
  razonSocial: string | null;
  address: string | null;
}

export interface BankInfo {
  bankName: string | null;
  accountNumber: string | null;
  cci: string | null;
}

export interface ContactInfoRequest {
  phone: string;
  address?: string;
  postalCode?: string;
  country: string;
}

export interface BillingInfoRequest {
  ruc?: string;
  razonSocial?: string;
  address?: string;
}

export interface BankInfoRequest {
  bankName?: string;
  accountNumber?: string;
  cci?: string;
}
