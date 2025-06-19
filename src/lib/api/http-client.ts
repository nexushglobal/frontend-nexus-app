import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { createApiUrl } from ".";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors: any;
}

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  cache?: RequestCache;
  contentType?: string;
  skipJsonStringify?: boolean;
  next?: {
    tags?: string[];
    revalidate?: number;
  };
}

export async function httpClient<T>(
  endpoint: string,
  {
    method = "GET",
    body,
    params,
    cache = "default",
    contentType = "application/json",
    skipJsonStringify = false,
    next,
  }: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const session = await getServerSession(authOptions);

  const queryParams = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      )
    : undefined;

  const url = createApiUrl(endpoint, queryParams);

  const headers: HeadersInit = {};

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (skipJsonStringify || body instanceof FormData) {
      requestBody = body as BodyInit;
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  const options: RequestInit = {
    method,
    headers,
    body: requestBody,
    cache,
    next,
  };

  try {
    const response = await fetch(url, options);
    const apiResponse: ApiResponse<T> = await response.json();

    // Verificar si la respuesta HTTP es exitosa
    if (!response.ok) {
      // Si la respuesta HTTP no es exitosa, pero tenemos una respuesta de la API,
      // retornamos la respuesta completa para que el llamador pueda manejar el error
      if (apiResponse) {
        return apiResponse;
      }

      // Si no hay respuesta de la API, creamos una respuesta de error
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Retornar la respuesta completa de la API
    return apiResponse;
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);

    // Si hay un error de red o parsing, creamos una respuesta de error estándar
    return {
      success: false,
      data: null as T,
      message: error instanceof Error ? error.message : "Error de conexión",
      errors: error,
    };
  }
}

// Función helper para manejar errores de la API de manera consistente
export function handleApiError(apiResponse: ApiResponse<any>): string {
  if (apiResponse.message) {
    return apiResponse.message;
  }

  if (!apiResponse.success) {
    return "Ha ocurrido un error inesperado";
  }

  return "Error desconocido";
}
