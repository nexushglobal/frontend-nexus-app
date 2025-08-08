import { z } from 'zod';

const productEditSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es muy largo'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  description: z.string().optional(),
  composition: z.string().optional(),
  memberPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  publicPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  isActive: z.boolean(),
  benefits: z.array(z.string()).optional(),
});

export type ProductEditFormType = z.infer<typeof productEditSchema>;

const stockFormSchema = z.object({
  actionType: z.enum(['INCREASE', 'DECREASE']),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  description: z.string().optional(),
});

export type StockFormType = z.infer<typeof stockFormSchema>;

export { productEditSchema, stockFormSchema };
