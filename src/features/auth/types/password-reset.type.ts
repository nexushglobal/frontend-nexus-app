export interface RequestPasswordResetResponse {
  message: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  message: string;
}
