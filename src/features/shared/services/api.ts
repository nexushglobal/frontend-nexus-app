import { env } from "@/lib/env";
import { ApiResponse, ApiOptions, ApiError } from "../types/api.types";

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number = 10000;

  constructor(baseUrl: string = env.apiUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async call<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

    const {
      timeout = this.defaultTimeout,
      retries = 0,
      next,
      ...fetchOptions
    } = options;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    };

    if (next) {
      (config as any).next = next;
    }

    try {
      const response = await this.fetchWithTimeout(url, config, timeout);
      const result: ApiResponse<T> = await response.json();

      // Tu backend siempre retorna esta estructura
      if (!result.success) {
        throw new ApiError(
          Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message,
          result.errors,
          response.status
        );
      }

      // Retorna solo la data, ya validada
      return result.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network errors, timeouts, etc.
      throw new ApiError(
        `Request failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        null,
        0
      );
    }
  }

  // Helper methods
  async get<T = any>(
    endpoint: string,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<ApiOptions, "method"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(
    endpoint: string,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ): Promise<T> {
    return this.call<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Fetch with timeout
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

export const api = new ApiClient();

export const serverApi = {
  static: <T>(endpoint: string) =>
    api.get<T>(endpoint, { cache: "force-cache" }),

  revalidate: <T>(endpoint: string, seconds: number) =>
    api.get<T>(endpoint, { next: { revalidate: seconds } }),

  fresh: <T>(endpoint: string) => api.get<T>(endpoint, { cache: "no-store" }),

  tagged: <T>(endpoint: string, tags: string[]) =>
    api.get<T>(endpoint, { next: { tags } }),
};
