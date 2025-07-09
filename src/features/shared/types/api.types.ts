export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string | string[];
  errors: string | string[] | null;
}

export interface ApiOptions extends RequestInit {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
  timeout?: number;
  retries?: number;
}

export class ApiError extends Error {
  public success: boolean;
  public errors: string | string[] | null;
  public statusCode: number;

  constructor(
    message: string,
    errors: string | string[] | null = null,
    statusCode: number = 500
  ) {
    super(message);
    this.name = "ApiError";
    this.success = false;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}
