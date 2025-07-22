"use client";

import { useState, useEffect } from "react";
import { SaleDetail } from "../types/sale.types";
import { SaleService } from "../services/sale.service";

interface UseSaleDetailReturn {
  saleDetail: SaleDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSaleDetail(saleId: string): UseSaleDetailReturn {
  const [saleDetail, setSaleDetail] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSaleDetail = async () => {
    if (!saleId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await SaleService.getSaleDetail(saleId);
      setSaleDetail(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar el detalle de la venta"
      );
      console.error("Error fetching sale detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleId]);

  return {
    saleDetail,
    loading,
    error,
    refetch: fetchSaleDetail,
  };
}
