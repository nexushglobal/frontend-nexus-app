import { z } from 'zod';
import { DocumentType, ItemType, ComplaintType } from '../types/complaint.types';

export const complaintSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .max(255, 'El nombre completo no puede exceder 255 caracteres'),
  
  address: z
    .string()
    .min(1, 'El domicilio es requerido')
    .max(500, 'El domicilio no puede exceder 500 caracteres'),
  
  documentType: z.nativeEnum(DocumentType, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de documento válido' }),
  }),
  
  documentNumber: z
    .string()
    .min(1, 'El número de documento es requerido')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),
  
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ser un correo electrónico válido')
    .max(255, 'El correo electrónico no puede exceder 255 caracteres'),
  
  parentGuardian: z
    .string()
    .max(255, 'El padre o madre no puede exceder 255 caracteres')
    .optional(),
  
  itemType: z.nativeEnum(ItemType, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de bien válido' }),
  }),
  
  claimAmount: z
    .number({
      required_error: 'El monto de reclamo es requerido',
      invalid_type_error: 'El monto debe ser un número válido',
    })
    .min(0, 'El monto de reclamo debe ser mayor o igual a 0'),
  
  description: z
    .string()
    .min(1, 'La descripción es requerida'),
  
  detail: z
    .string()
    .min(1, 'El detalle es requerido'),
  
  complaintType: z.nativeEnum(ComplaintType, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de reclamo válido' }),
  }),
  
  order: z
    .string()
    .max(100, 'El pedido no puede exceder 100 caracteres')
    .optional(),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;