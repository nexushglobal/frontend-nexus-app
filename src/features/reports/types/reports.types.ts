export interface Report {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDownloadRequest {
  reportCode: string;
  startDate: string;
  endDate: string;
}

export type ListReportsResponse = Report[];