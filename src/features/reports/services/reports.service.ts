import { api } from '@/features/shared/services/api';
import { ListReportsResponse, ReportDownloadRequest } from '../types/reports.types';

export class ReportsService {
  static async getActiveReports(): Promise<ListReportsResponse> {
    return api.get<ListReportsResponse>('/api/reports/active');
  }

  static async downloadReport(params: ReportDownloadRequest): Promise<Blob> {
    return api.downloadFile('/api/reports/download', {
      params: {
        reportCode: params.reportCode,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
  }
}