export interface DocumentValidationResponse {
  dni: string;
  name: string;
  mothers_lastname: string;
  fathers_lastname: string;
  fullname: string;
  verification_code: string;
  updated_at: string;
}

export interface DocumentValidationRequest {
  numberDocument: string;
  documentType: "dni" | "ruc";
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  gender: "MASCULINO" | "FEMENINO" | "OTRO";
  country: string;
  referrerCode?: string;
  position?: "LEFT" | "RIGHT";
  roleCode: string;
  documentType: "DNI" | "CE" | "PAS";
  documentNumber: string;
}

export interface RegisterUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export interface FormState {
  currentStep: number;
  isCompleted: boolean;
  data: {
    document?: {
      documentType: "DNI" | "CE" | "PAS";
      documentNumber: string;
    };
    personalInfo?: {
      firstName: string;
      lastName: string;
      phone: string;
      birthDate: string;
      gender: "MASCULINO" | "FEMENINO" | "OTRO";
      country: string;
    };
    credentials?: {
      email: string;
      password: string;
    };
  };
  validatedData?: {
    firstName?: string;
    lastName?: string;
  } | null;
}
