// src/app/dashboard/(facturacion)/pagos/hooks/useAdminPaymentFilters.ts
import { PaymentStatus } from "@/types/admin-payments.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface UseAdminPaymentFiltersProps {
  search: string;
  status: PaymentStatus | undefined;
  paymentMethod: string | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function useAdminPaymentFilters({
  search: initialSearch,
  status: initialStatus,
  paymentMethod: initialPaymentMethod,
  paymentConfigId: initialPaymentConfigId,
  startDate: initialStartDate,
  endDate: initialEndDate,
}: UseAdminPaymentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Estados para loading
  const [isPending, startTransition] = useTransition();
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  // Estados locales
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [statusValue, setStatusValue] = useState<string>(
    initialStatus || "all"
  );
  const [paymentMethodValue, setPaymentMethodValue] = useState<string>(
    initialPaymentMethod || "all"
  );
  const [paymentConfigValue, setPaymentConfigValue] = useState<string>(
    initialPaymentConfigId?.toString() || "all"
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: initialStartDate ? new Date(initialStartDate) : undefined,
    to: initialEndDate ? new Date(initialEndDate) : undefined,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Función para crear query string
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Función para aplicar filtros con loading
  const applyFilters = useCallback(() => {
    setIsApplyingFilters(true);

    const params: Record<string, string | null> = {
      search: searchValue.trim() || null,
      status: statusValue === "all" ? null : statusValue,
      paymentMethod: paymentMethodValue === "all" ? null : paymentMethodValue,
      paymentConfigId: paymentConfigValue === "all" ? null : paymentConfigValue,
      startDate: dateRange.from
        ? dateRange.from.toISOString().split("T")[0]
        : null,
      endDate: dateRange.to ? dateRange.to.toISOString().split("T")[0] : null,
      page: null, // Reset page when applying filters
    };

    const queryString = createQueryString(params);

    startTransition(() => {
      router.push(`${pathname}?${queryString}`);
      setIsApplyingFilters(false);
    });
  }, [
    searchValue,
    statusValue,
    paymentMethodValue,
    paymentConfigValue,
    dateRange,
    createQueryString,
    router,
    pathname,
  ]);

  // Función para resetear filtros
  const resetFilters = useCallback(() => {
    setSearchValue("");
    setStatusValue("all");
    setPaymentMethodValue("all");
    setPaymentConfigValue("all");
    setDateRange({ from: undefined, to: undefined });
    setShowAdvancedFilters(false);

    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  // Handler para cambios en el input de búsqueda
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  // Estado de loading combinado
  const isLoading = isPending || isApplyingFilters;

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchValue.trim() !== "" ||
    statusValue !== "all" ||
    paymentMethodValue !== "all" ||
    paymentConfigValue !== "all" ||
    dateRange.from !== undefined ||
    dateRange.to !== undefined;

  return {
    searchValue,
    statusValue,
    paymentMethodValue,
    paymentConfigValue,
    dateRange,
    hasActiveFilters,
    showAdvancedFilters,
    isLoading,
    setStatusValue,
    setPaymentMethodValue,
    setPaymentConfigValue,
    setDateRange,
    setShowAdvancedFilters,
    applyFilters,
    resetFilters,
    handleSearchChange,
  };
}
