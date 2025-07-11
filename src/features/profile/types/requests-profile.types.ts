export interface ContactInfoRequest {
  phone: string;
  address?: string;
  postalCode?: string;
  country: string;
}

export interface PersonalInfoRequest {
  nickname?: string;
  email?: string;
  documentType?: DocumentType;
  documentNumber?: string;
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

export interface PhotoUploadRequest {
  photo: File;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
