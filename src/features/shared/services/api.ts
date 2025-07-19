import { env } from "@/lib/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Tipos para el API wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string | string[];
  errors: string | string[] | null;
}

export class ApiError extends Error {
  public success: boolean;
  public errors: string | string[] | null;
  public statusCode: number;

  constructor(
    message: string | string[],
    errors: string | string[] | null = null,
    statusCode: number = 500
  ) {
    super(Array.isArray(message) ? message.join(", ") : message);
    this.name = "ApiError";
    this.success = false;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

// Opciones para las llamadas API
export interface ApiOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: any;
  timeout?: number;
  skipAuth?: boolean; // Para endpoints públicos
  skipJsonStringify?: boolean; // No convertir body a JSON
  isFormData?: boolean; // Indicar que es FormData
}

class ApiClient {
  private getBaseUrl(): string {
    const apiUrl = env.apiUrl;

    if (!apiUrl) {
      const context = typeof window === "undefined" ? "server" : "client";
      throw new Error(
        `API URL no está configurada para contexto ${context}. ` +
          `Verifica que tengas ${
            context === "server" ? "API_BACKENDL_URL" : "NEXT_PUBLIC_API_URL"
          } en tu .env`
      );
    }

    return apiUrl;
  }

  /**
   * Obtiene el token de autenticación según el contexto
   */
  private async getAuthToken(): Promise<string | null> {
    const isServer = typeof window === "undefined";

    if (isServer) {
      // En servidor: usar getServerSession
      try {
        const session = await getServerSession(authOptions);
        return session?.accessToken || null;
      } catch (error) {
        console.warn("Error getting server session:", error);
        return null;
      }
    } else {
      // En cliente: usar sessionStorage o fetch a API route
      try {
        const response = await fetch("/api/auth/token");
        if (response.ok) {
          const { accessToken } = await response.json();
          return accessToken;
        }

        return null;
      } catch (error) {
        console.warn("Error getting client token:", error);
        return null;
      }
    }
  }

  /**
   * Construye la URL con parámetros de query
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const baseUrl = this.getBaseUrl();
    const url = new URL(endpoint, baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Prepara los headers con autenticación
   */
  private async prepareHeaders(options: ApiOptions = {}): Promise<HeadersInit> {
    const headers: HeadersInit = {
      ...options.headers,
    };

    // Solo establecer Content-Type si no es FormData
    if (!options.isFormData && !(options.body instanceof FormData)) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    // Agregar autenticación si no se omite explícitamente
    if (!options.skipAuth) {
      const token = await this.getAuthToken();
      if (token) {
        (headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Prepara el body de la request
   */
  private prepareBody(
    body: any,
    options: ApiOptions
  ): string | FormData | undefined {
    if (!body) return undefined;

    // Si es FormData, devolverlo directamente
    if (body instanceof FormData || options.isFormData) {
      return body as FormData;
    }

    // Si skipJsonStringify está habilitado, devolver el body tal como está
    if (options.skipJsonStringify) {
      return body;
    }

    // Por defecto, convertir a JSON
    return typeof body === "string" ? body : JSON.stringify(body);
  }

  /**
   * Maneja las respuestas HTTP
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let result: ApiResponse<T>;

    if (isJson) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = {
        success: response.ok,
        data: text as unknown as T,
        message: response.ok ? "Success" : "Error",
        errors: response.ok ? null : text,
      };
    }

    // Manejar errores de autenticación
    if (response.status === 401) {
      // Token expirado o inválido
      this.handleAuthError();
      throw new ApiError(
        "Token de autenticación inválido o expirado",
        null,
        401
      );
    }

    if (!result.success) {
      throw new ApiError(result.message, result.errors, response.status);
    }

    return result.data as T;
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(): void {
    const isServer = typeof window === "undefined";

    if (!isServer) {
      // En cliente: limpiar token y redirigir
      sessionStorage.removeItem("accessToken");

      // Si usas next-auth, hacer signOut
      if (typeof window !== "undefined") {
        import("next-auth/react").then(({ signOut }) => {
          signOut({ callbackUrl: "/login" });
        });
      }
    }
    // En servidor los errores 401 se propagan al componente
  }

  /**
   * Llamada genérica al API
   */
  async call<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const {
      params,
      body,
      timeout = 30000,
      skipAuth = false,
      skipJsonStringify = false,
      isFormData = false,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint, params);
    const headers = await this.prepareHeaders({
      ...options,
      skipAuth,
      isFormData: isFormData || body instanceof FormData,
      body,
    });

    const config: RequestInit = {
      ...fetchOptions,
      headers,
    };

    // Solo agregar body si existe y no es GET
    if (body && fetchOptions.method !== "GET") {
      config.body = this.prepareBody(body, { skipJsonStringify, isFormData });
    }

    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      // console.log(`API Call: ${fetchOptions.method || "GET"} ${url}`, {
      //   headers: config.headers,
      //   body: config.body instanceof FormData ? "FormData" : config.body,
      //   response: {
      //     status: response.status,
      //     statusText: response.statusText,
      //     url: response.url,
      //   },
      // });
      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", null, 408);
        }
        throw new ApiError(error.message, null, 500);
      }

      throw new ApiError("Unknown error occurred", null, 500);
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options: Omit<ApiOptions, "method"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "POST",
      body: data,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: Omit<ApiOptions, "method"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * GET request sin autenticación (para endpoints públicos)
   */
  async getPublic<T>(
    endpoint: string,
    options: Omit<ApiOptions, "method" | "skipAuth"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "GET",
      skipAuth: true,
    });
  }

  /**
   * POST request sin autenticación (para login, registro, etc.)
   */
  async postPublic<T>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method" | "body" | "skipAuth"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "POST",
      body: data,
      skipAuth: true,
    });
  }
}

export const api = new ApiClient();

// Para Server Components con optimizaciones Next.js y autenticación
export const serverApi = {
  /**
   * Cache estático con autenticación
   */
  static: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ) => api.get<T>(endpoint, { params, cache: "force-cache" }),

  /**
   * Revalidación periódica con autenticación
   */
  revalidate: <T>(
    endpoint: string,
    seconds: number,
    params?: Record<string, string | number | boolean | undefined | null>
  ) =>
    api.get<T>(endpoint, {
      params,
      next: { revalidate: seconds },
    }),

  /**
   * Siempre fresco con autenticación
   */
  fresh: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ) => api.get<T>(endpoint, { params, cache: "no-store" }),

  /**
   * Cache con tags para invalidación selectiva
   */
  tagged: <T>(
    endpoint: string,
    tags: string[],
    params?: Record<string, string | number | boolean | undefined | null>
  ) =>
    api.get<T>(endpoint, {
      params,
      next: { tags },
    }),

  /**
   * Endpoints públicos en server (sin auth)
   */
  public: {
    static: <T>(
      endpoint: string,
      params?: Record<string, string | number | boolean | undefined | null>
    ) => api.getPublic<T>(endpoint, { params, cache: "force-cache" }),

    fresh: <T>(
      endpoint: string,
      params?: Record<string, string | number | boolean | undefined | null>
    ) => api.getPublic<T>(endpoint, { params, cache: "no-store" }),
  },
};

// Helper para construir params fácilmente
export const buildParams = (
  params: Record<string, any>
): Record<string, string> => {
  const result: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = String(value);
    }
  });

  return result;
};
