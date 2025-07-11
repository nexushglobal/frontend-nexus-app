import { useMemo } from "react";
import { z } from "zod";

export interface UseValidatedSearchParamsOptions {
  logValidationErrors?: boolean;

  onValidationError?: (
    error: z.ZodError,
    rawParams: Record<string, any>
  ) => void;

  fallbackDefaults?: Partial<any>;
}

export function useValidatedSearchParams<T>(
  schema: z.ZodSchema<T>,
  searchParams?: Record<string, string | string[] | undefined> | null,
  options: UseValidatedSearchParamsOptions = {}
): T {
  const {
    logValidationErrors = process.env.NODE_ENV === "development",
    onValidationError,
    fallbackDefaults,
  } = options;

  return useMemo(() => {
    try {
      const flatParams = Object.entries(searchParams || {}).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value[0];
          } else if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string | undefined>
      );

      const paramsWithDefaults = fallbackDefaults
        ? { ...fallbackDefaults, ...flatParams }
        : flatParams;

      return schema.parse(paramsWithDefaults);
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (logValidationErrors) {
          console.warn("🔍 Search params validation failed:", {
            errors: error.errors,
            received: searchParams,
            schema: schema._def,
          });
        }

        if (onValidationError) {
          onValidationError(error, searchParams || {});
        }

        try {
          return schema.parse(fallbackDefaults || {});
        } catch {
          return schema.parse({});
        }
      }

      if (logValidationErrors) {
        console.error(
          "❌ Unexpected error in useValidatedSearchParams:",
          error
        );
      }

      return schema.parse(fallbackDefaults || {});
    }
  }, [
    schema,
    searchParams,
    fallbackDefaults,
    logValidationErrors,
    onValidationError,
  ]);
}

export function createValidatedSearchParamsHook<T>(
  schema: z.ZodSchema<T>,
  defaultOptions?: UseValidatedSearchParamsOptions
) {
  return function useFeatureSearchParams(
    searchParams?: Record<string, string | string[] | undefined> | null,
    options?: UseValidatedSearchParamsOptions
  ): T {
    return useValidatedSearchParams(schema, searchParams, {
      ...defaultOptions,
      ...options,
    });
  };
}
