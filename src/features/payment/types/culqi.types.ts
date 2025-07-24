export interface CreateTokenRequest {
  card_number: string;
  cvv: string;
  expiration_month: string;
  expiration_year: string;
  email: string;
  metadata?: Record<string, any>;
}

export interface TokenResponse {
  token_id: string;
  card_brand: string;
  card_type: string;
  last_four: string;
  email: string;
  active: boolean;
  creation_date: number;
  metadata?: Record<string, any>;
}

// Respuesta completa de Culqi (para desarrollo)
export interface CulqiTokenComplete {
  object: string;
  id: string;
  type: string;
  email: string;
  creation_date: number;
  card_number: string;
  last_four: string;
  active: boolean;
  iin: {
    object: string;
    bin: string;
    card_brand: string;
    card_type: string;
    card_category: string;
    issuer: Record<string, any>;
    installments_allowed: any[];
  };
  client: {
    ip: string;
    ip_country: string;
    ip_country_code: string;
    browser: string;
    device_fingerprint: string;
    device_type: string;
  };
  metadata?: Record<string, any>;
}

// Respuesta de la API
export interface CreateTokenResponse {
  success: boolean;
  message: string;
  data?: TokenResponse;
  errors?: string[];
  culqi_error?: {
    code: string;
    type: string;
  };
  full_response?: CulqiTokenComplete; // Solo en desarrollo
}

// Errores comunes de Culqi
export enum CulqiErrorCode {
  CARD_NUMBER_INVALID = "card_number_invalid",
  CVV_INVALID = "cvv_invalid",
  EXPIRATION_DATE_INVALID = "expiration_date_invalid",
  EXPIRED_CARD = "expired_card",
  INVALID_EMAIL = "invalid_email",
  PROCESSING_ERROR = "processing_error",
}

// Tipos de tarjeta soportados
export enum CardBrand {
  VISA = "Visa",
  MASTERCARD = "Mastercard",
  AMEX = "Amex",
  DINERS = "Diners",
}

export enum CardType {
  CREDIT = "credito",
  DEBIT = "debito",
  INTERNATIONAL = "internacional",
}

// Utilidades para validación en el frontend
export interface CardValidation {
  isValid: boolean;
  errors: string[];
}

// Estado del formulario de pago
export interface PaymentFormState {
  cardNumber: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
  email: string;
  metadata?: Record<string, any>;
}
