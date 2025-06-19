export interface Profile {
  user: UserClient;
  accessToken: string;
  refreshToken: string;
}

export interface UserClient {
  id: string;
  email: string;
  photo?: string;
  nickname?: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Role {
  id: string; // Cambiado de number a string para coincidir con la API
  code: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: any;
}

export interface LoginResponse {
  user: UserClient;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: any;
}
