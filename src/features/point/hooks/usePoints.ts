import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PointService } from '../services/point.service';
import { UserPointsResponse } from '../types/points-response';
import {
  PointTransactionStatus,
  PointTransactionType,
  Transaction,
} from '../types/points.types';

interface UsePointsState {
  summaryPoints: UserPointsResponse | null;
  transactions: Transaction[];
  userSummaryLoading: boolean;
  userTransactionLoading: boolean;
  filters: {
    status: PointTransactionStatus | undefined;
    type: PointTransactionType | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
  };
  handleStatusChange: (status: PointTransactionStatus | undefined) => void;
  handleTypeChange: (type: PointTransactionType | undefined) => void;
  handleStartDateChange: (date: string | undefined) => void;
  handleEndDateChange: (date: string | undefined) => void;
  resetFilters: () => void;
}

interface UsePointsActions {
  handleRefreshSummaryPoints: () => Promise<void>;
  handleRefreshTransactions: () => Promise<void>;
}

interface UsePointsReturn extends UsePointsState, UsePointsActions {}

export function usePoints(): UsePointsReturn {
  const [summaryPoints, setSummaryPoints] = useState<UserPointsResponse | null>(
    null,
  );
  const [transactions, setTransactions] = useState<Transaction[] | []>([]);
  const [userSummaryLoading, setUserSummaryLoading] = useState<boolean>(false);
  const [userTransactionLoading, setUserTransactionLoading] =
    useState<boolean>(false);

  const [status, setStatus] = useState<PointTransactionStatus | undefined>(
    undefined,
  );
  const [type, setType] = useState<PointTransactionType | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const handleRefreshSummaryPoints = useCallback(async (): Promise<void> => {
    setUserSummaryLoading(true);
    try {
      const points = await PointService.getUserPoints();
      setSummaryPoints(points);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
    } finally {
      setUserSummaryLoading(false);
    }
  }, []);

  const handleRefreshTransactions = useCallback(async (): Promise<void> => {
    setUserTransactionLoading(true);
    try {
      const params: Record<
        string,
        string | number | boolean | undefined | null
      > = {};

      if (status) params.status = status;
      if (type) params.type = type;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const transactions = await PointService.getUserTransactions(params);
      setTransactions(transactions.items);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
    } finally {
      setUserTransactionLoading(false);
    }
  }, [status, type, startDate, endDate]);

  const handleStatusChange = useCallback(
    (value: PointTransactionStatus | undefined) => {
      setStatus(value);
    },
    [],
  );

  const handleTypeChange = useCallback(
    (value: PointTransactionType | undefined) => {
      setType(value);
    },
    [],
  );

  const handleStartDateChange = useCallback((date: string | undefined) => {
    setStartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date: string | undefined) => {
    setEndDate(date);
  }, []);

  const resetFilters = useCallback(() => {
    setStatus(undefined);
    setType(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
  }, []);

  useEffect(() => {
    handleRefreshSummaryPoints();
  }, [handleRefreshSummaryPoints]);

  useEffect(() => {
    handleRefreshTransactions();
  }, [handleRefreshTransactions]);

  return {
    summaryPoints,
    transactions,
    userSummaryLoading,
    userTransactionLoading,
    handleRefreshSummaryPoints,
    handleRefreshTransactions,
    filters: {
      status: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
    },
    handleStatusChange,
    handleTypeChange,
    handleStartDateChange,
    handleEndDateChange,
    resetFilters,
  };
}
