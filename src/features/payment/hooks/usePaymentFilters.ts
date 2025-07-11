import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { PaymentSearchParams } from "../schemas/payment-search-params.schema";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface UsePaymentFiltersProps extends PaymentSearchParams {}

export function usePaymentFilters(props: UsePaymentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const [searchValue, setSearchValue] = useState(props.search);
  const [statusValue, setStatusValue] = useState<string>(props.status || "all");
  const [paymentConfigValue, setPaymentConfigValue] = useState<string>(
    props.paymentConfigId?.toString() || "all"
  );
  const [sortByValue, setSortByValue] = useState<string>(props.sortBy);
  const [sortOrderValue, setSortOrderValue] = useState<"ASC" | "DESC">(
    props.sortOrder
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: props.startDate ? new Date(props.startDate) : undefined,
    to: props.endDate ? new Date(props.endDate) : undefined,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

  const applyFilters = useCallback(() => {
    setIsApplyingFilters(true);

    const params: Record<string, string | null> = {
      search: searchValue.trim() || null,
      status: statusValue === "all" ? null : statusValue,
      paymentConfigId: paymentConfigValue === "all" ? null : paymentConfigValue,
      startDate: dateRange.from
        ? dateRange.from.toISOString().split("T")[0]
        : null,
      endDate: dateRange.to ? dateRange.to.toISOString().split("T")[0] : null,
      sortBy: sortByValue,
      sortOrder: sortOrderValue,
      page: "1",
    };

    const queryString = createQueryString(params);

    startTransition(() => {
      router.push(`${pathname}?${queryString}`);
      setIsApplyingFilters(false);
    });
  }, [
    searchValue,
    statusValue,
    paymentConfigValue,
    dateRange,
    sortByValue,
    sortOrderValue,
    createQueryString,
    pathname,
    router,
  ]);

  const resetFilters = useCallback(() => {
    setSearchValue("");
    setStatusValue("all");
    setPaymentConfigValue("all");
    setSortByValue("createdAt");
    setSortOrderValue("DESC");
    setDateRange({ from: undefined, to: undefined });

    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const handleSortChange = useCallback((value: string) => {
    setSortByValue(value);
  }, []);
  const hasActiveFilters =
    searchValue.trim() !== "" ||
    statusValue !== "all" ||
    paymentConfigValue !== "all" ||
    dateRange.from ||
    dateRange.to;

  const isLoading = isPending || isApplyingFilters;

  return {
    searchValue,
    statusValue,
    paymentConfigValue,
    sortByValue,
    sortOrderValue,
    dateRange,
    hasActiveFilters,
    showAdvancedFilters,
    isLoading,
    setSearchValue,
    setStatusValue,
    setPaymentConfigValue,
    setSortByValue,
    setSortOrderValue,
    setDateRange,
    setShowAdvancedFilters,
    applyFilters,
    resetFilters,
    handleSearchChange,
    handleSortChange,
  };
}
