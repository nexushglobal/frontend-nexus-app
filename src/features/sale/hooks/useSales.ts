"use client";

import { useState, useEffect } from "react";
import { Sale } from "../types/sale.types";
import { SaleService } from "../services/sale.service";

interface UseSalesReturn {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSales(): UseSalesReturn {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SaleService.getSales();
      setSales(data.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las ventas"
      );
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    refetch: fetchSales,
  };
}
