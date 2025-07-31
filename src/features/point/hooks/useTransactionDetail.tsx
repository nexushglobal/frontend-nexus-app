'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PointService } from '../services/point.service';
import { DetailTransactionResponse } from '../types/points-response';

interface UseTransactionDetailProps {
  transactionId: number;
}

interface UseTransactionDetailReturn {
  transaction: DetailTransactionResponse | null;
  isLoading: boolean;
  error: string | null;

  paymentsPage: number;
  paymentsPageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;

  refreshTransaction: () => Promise<void>;
}

export function useTransactionDetail({
  transactionId,
}: UseTransactionDetailProps): UseTransactionDetailReturn {
  const [transaction, setTransaction] =
    useState<DetailTransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la paginación de pagos
  const [paymentsPage, setPaymentsPage] = useState<number>(1);
  const [paymentsPageSize, setPaymentsPageSize] = useState<number>(10);

  const fetchTransactionDetail = useCallback(async () => {
    if (!transactionId) {
      setError('ID de transacción no válido');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params: Record<
        string,
        string | number | boolean | undefined | null
      > = {
        page: paymentsPage,
        limit: paymentsPageSize,
      };

      const response = await PointService.getPointsTransactionById(
        transactionId,
        params,
      );

      if (response) {
        setTransaction(response);
      } else {
        setError('No se pudo obtener la información de la transacción');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al cargar los detalles de la transacción';

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [transactionId, paymentsPage, paymentsPageSize]);

  useEffect(() => {
    fetchTransactionDetail();
  }, [fetchTransactionDetail]);

  const handlePageChange = useCallback((page: number) => {
    setPaymentsPage(page);
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPaymentsPageSize(pageSize);
    setPaymentsPage(1);
  }, []);

  return {
    transaction,
    isLoading,
    error,
    paymentsPage,
    paymentsPageSize,
    handlePageChange,
    handlePageSizeChange,
    refreshTransaction: fetchTransactionDetail,
  };
}
