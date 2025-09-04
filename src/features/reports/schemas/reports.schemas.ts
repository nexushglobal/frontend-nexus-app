import { z } from 'zod';

export const reportDownloadSchema = z.object({
  reportCode: z.string().min(1, 'El código del reporte es requerido'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
});

export type ReportDownloadFormData = z.infer<typeof reportDownloadSchema>;