import { PaymentConfig, PaymentStatus } from "@/types/payments/payments.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface UsePaymentFiltersProps {
  search: string;
  status: PaymentStatus | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function usePaymentFilters({
  search: initialSearch,
  status: initialStatus,
  paymentConfigId: initialPaymentConfigId,
  startDate: initialStartDate,
  endDate: initialEndDate,
  sortBy: initialSortBy,
  sortOrder: initialSortOrder,
}: UsePaymentFiltersProps) {
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
  const [paymentConfigValue, setPaymentConfigValue] = useState<string>(
    initialPaymentConfigId?.toString() || "all"
  );
  const [sortByValue, setSortByValue] = useState<string>(initialSortBy);
  const [sortOrderValue, setSortOrderValue] = useState<"ASC" | "DESC">(
    initialSortOrder
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
      paymentConfigId: paymentConfigValue === "all" ? null : paymentConfigValue,
      startDate: dateRange.from?.toISOString().split("T")[0] || null,
      endDate: dateRange.to?.toISOString().split("T")[0] || null,
      sortBy: sortByValue,
      sortOrder: sortOrderValue,
      page: "1", // Reset page when applying filters
    };

    const queryString = createQueryString(params);

    startTransition(() => {
      router.push(`${pathname}?${queryString}`);
      // Reset loading state after a brief delay to allow navigation to complete
      setTimeout(() => {
        setIsApplyingFilters(false);
      }, 100);
    });
  }, [
    searchValue,
    statusValue,
    paymentConfigValue,
    dateRange,
    sortByValue,
    sortOrderValue,
    createQueryString,
    router,
    pathname,
  ]);

  // Función para resetear filtros con loading
  const resetFilters = useCallback(() => {
    setIsApplyingFilters(true);
    setSearchValue("");
    setStatusValue("all");
    setPaymentConfigValue("all");
    setDateRange({ from: undefined, to: undefined });
    setSortByValue("createdAt");
    setSortOrderValue("DESC");

    startTransition(() => {
      router.push(pathname);
      setTimeout(() => {
        setIsApplyingFilters(false);
      }, 100);
    });
  }, [router, pathname]);

  // Función para manejar cambio de búsqueda
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  // Función para manejar cambio de ordenamiento
  const handleSortChange = useCallback(
    (field: string) => {
      if (sortByValue === field) {
        setSortOrderValue(sortOrderValue === "ASC" ? "DESC" : "ASC");
      } else {
        setSortByValue(field);
        setSortOrderValue("DESC");
      }
    },
    [sortByValue, sortOrderValue]
  );

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchValue.trim() !== "" ||
    statusValue !== "all" ||
    paymentConfigValue !== "all" ||
    dateRange.from ||
    dateRange.to;

  // Estado de loading combinado
  const isLoading = isPending || isApplyingFilters;

  return {
    // Estados
    searchValue,
    statusValue,
    paymentConfigValue,
    sortByValue,
    sortOrderValue,
    dateRange,
    hasActiveFilters,
    showAdvancedFilters,
    isLoading, // Nuevo estado de loading

    // Setters
    setSearchValue,
    setStatusValue,
    setPaymentConfigValue,
    setSortByValue,
    setSortOrderValue,
    setDateRange,
    setShowAdvancedFilters,

    // Funciones
    applyFilters,
    resetFilters,
    handleSearchChange,
    handleSortChange,
  };
}
