import { UserPointsResponse } from "../types/points-response";

interface UsePointsState {
  summaryPoints: UserPointsResponse;
}

interface UsePointsActions {
  handleRefreshSummaryPoints: () => void;
}

interface UsePointsReturn extends UsePointsState, UsePointsActions {}

export function usePoints(): UsePointsReturn {
  const handleRefreshSummaryPoints = (): void => {
    console.log("refresh summary points");
  };

  return {
    summaryPoints,
    handleRefreshSummaryPoints,
  };
}
