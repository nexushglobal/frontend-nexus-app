import { z } from "zod";

export const createLeadSchema = z.object({
  fullName: z.string().min(1, "Nombre completo es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Teléfono es requerido"),
  message: z.string().optional(),
});

export const listLeadsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const downloadLeadsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type ListLeadsParams = z.infer<typeof listLeadsSchema>;
export type DownloadLeadsParams = z.infer<typeof downloadLeadsSchema>;