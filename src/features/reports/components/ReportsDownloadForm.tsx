'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { FileText, Download, Calendar, RefreshCw, CheckCircle2, FileCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Progress } from '@/components/ui/progress';

import { useActiveReports } from '../hooks/useReports';
import { useReportDownload } from '../hooks/useReportDownload';
import { reportDownloadSchema, ReportDownloadFormData } from '../schemas/reports.schemas';

export function ReportsDownloadForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const { data: reports, isLoading: reportsLoading } = useActiveReports();
  const { downloadReport, isDownloading, progress, downloadedFile, clearDownloadedFile } = useReportDownload();

  const form = useForm<ReportDownloadFormData>({
    resolver: zodResolver(reportDownloadSchema),
    defaultValues: {
      reportCode: '',
      startDate: '',
      endDate: '',
    },
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      form.setValue('startDate', format(range.from, 'yyyy-MM-dd'));
      form.setValue('endDate', format(range.to, 'yyyy-MM-dd'));
    }
  };

  const onSubmit = async (data: ReportDownloadFormData) => {
    const report = reports?.find(r => r.code === data.reportCode);
    await downloadReport(data, report?.name || 'Reporte');
  };

  const handleClearForm = () => {
    form.reset();
    setDateRange(undefined);
    clearDownloadedFile();
  };

  const selectedReport = reports?.find(
    report => report.code === form.watch('reportCode')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Genera y descarga reportes personalizados
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Descargar Reporte
          </CardTitle>
          <CardDescription>
            Selecciona el reporte y el rango de fechas para generar tu archivo
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="reportCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tipo de Reporte
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={reportsLoading || isDownloading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar reporte..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reports?.map((report) => (
                            <SelectItem key={report.code} value={report.code}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{report.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {report.code}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Rango de Fechas
                  </FormLabel>
                  <DatePickerWithRange
                    className="w-full"
                    date={dateRange}
                    onDateChange={handleDateRangeChange}
                    disabled={isDownloading}
                    placeholder="Seleccionar fechas..."
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </FormItem>
              </div>

              {selectedReport && (
                <div className="rounded-lg border bg-card p-4">
                  <h3 className="font-medium text-foreground mb-2">
                    Descripción del Reporte
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.description}
                  </p>
                </div>
              )}

              {isDownloading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Generando reporte...
                    </span>
                    <span className="font-medium text-primary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <div className="flex justify-end gap-3">
                {downloadedFile && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleClearForm}
                    className="min-w-[140px]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
                )}
                <Button 
                  type="submit"
                  disabled={
                    isDownloading || 
                    !form.watch('reportCode') || 
                    !dateRange?.from || 
                    !dateRange?.to
                  }
                  className="min-w-[140px]"
                >
                  {isDownloading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {downloadedFile && (
        <Card className="border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              Archivo Descargado
            </CardTitle>
            <CardDescription>
              El reporte se ha generado y descargado exitosamente
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <FileCheck className="h-6 w-6 text-success" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="info-field">
                      <FileText className="field-icon text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Nombre del archivo</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {downloadedFile.fileName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="info-field">
                      <Calendar className="field-icon text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Fecha de descarga</p>
                        <p className="text-sm text-muted-foreground">
                          {downloadedFile.downloadDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-field">
                    <Download className="field-icon text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Detalles del reporte</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{downloadedFile.reportName}</span> ({downloadedFile.reportCode})
                        <br />
                        Período: {format(new Date(downloadedFile.startDate), 'dd/MM/yyyy')} - {format(new Date(downloadedFile.endDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}