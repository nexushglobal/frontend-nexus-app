'use client';

import { useEffect, useState } from 'react';
import { PointService } from '../../services/point.service';
import type { PointTransactionDetailResponse } from '../../types/points.types';
import { PaymentHistory } from '../shared/section/PaymentHistory';
import { TransactionErrorState } from '../shared/section/TransactionErrorState';
import { TransactionHeader } from '../shared/section/TransactionHeader';
import { TransactionSummary } from '../shared/section/TransactionSummary';
import { TransactionDetailSkeleton } from '../shared/skeletons/TransactionDetailSkeleton';

interface TransactionDetailPageProps {
  transactionId: number;
}

export function TransactionDetailPage({
  transactionId,
}: TransactionDetailPageProps) {
  const [transactionDetail, setTransactionDetail] =
    useState<PointTransactionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch de datos
  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await PointService.getUserTransactionsDetail(
          transactionId,
          {
            page: currentPage,
            limit: pageSize,
          },
        );
        setTransactionDetail(response);
      } catch (err) {
        setError('Error al cargar el detalle de la transacción');
        console.error('Error fetching transaction detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setPageSize(limit);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (isLoading) {
    return <TransactionDetailSkeleton />;
  }

  if (error || !transactionDetail) {
    return <TransactionErrorState error={error} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <TransactionHeader transactionId={transactionId} />

      <TransactionSummary transaction={transactionDetail} />

      <PaymentHistory
        transactionDetail={transactionDetail}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
