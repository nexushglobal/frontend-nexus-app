import { useState } from 'react';
import { toast } from 'sonner';
import { ReportsService } from '../services/reports.service';
import { ReportDownloadRequest } from '../types/reports.types';

interface DownloadedFile {
  fileName: string;
  downloadDate: string;
  reportCode: string;
  startDate: string;
  endDate: string;
  reportName: string;
}

export const useReportDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadedFile, setDownloadedFile] = useState<DownloadedFile | null>(null);

  const downloadReport = async (params: ReportDownloadRequest, reportName: string) => {
    setIsDownloading(true);
    setProgress(0);

    // Simulate progress loading over 4 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 40); // 40 increments over 4 seconds
        return newProgress >= 99 ? 99 : newProgress; // Stop at 99% until API responds
      });
    }, 100);

    try {
      const blob = await ReportsService.downloadReport(params);
      
      // Complete the progress
      setProgress(100);
      clearInterval(progressInterval);

      const fileName = `reporte_${params.reportCode}_${params.startDate}_${params.endDate}.csv`;

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      // Store downloaded file info
      setDownloadedFile({
        fileName,
        downloadDate: new Date().toLocaleString('es-ES'),
        reportCode: params.reportCode,
        startDate: params.startDate,
        endDate: params.endDate,
        reportName,
      });
      
      toast.success('Reporte descargado exitosamente');
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      toast.error('Error al descargar el reporte');
      console.error('Error downloading report:', error);
    } finally {
      // Reset after a delay to show completed state
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const clearDownloadedFile = () => {
    setDownloadedFile(null);
  };

  return {
    downloadReport,
    isDownloading,
    progress,
    downloadedFile,
    clearDownloadedFile,
  };
};