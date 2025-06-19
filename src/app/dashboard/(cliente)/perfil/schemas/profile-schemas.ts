import { z } from "zod";

export const contactInfoSchema = z.object({
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .regex(/^\d+$/, "El teléfono debe contener solo números"),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "El país es requerido"),
});

export const billingInfoSchema = z.object({
  ruc: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 8 && val.length <= 11),
      "El RUC debe tener entre 8 y 11 dígitos"
    )
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "El RUC debe contener solo números"
    ),
  razonSocial: z.string().optional(),
  address: z.string().optional(),
});

export const bankInfoSchema = z.object({
  bankName: z.string().optional(),
  accountNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "El número de cuenta debe contener solo números"
    ),
  cci: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length === 20 && /^\d+$/.test(val)),
      "El CCI debe tener exactamente 20 dígitos"
    ),
});

export const photoSchema = z.object({
  photo: z
    .any()
    .refine((files) => files?.length == 1, "Selecciona una imagen")
    .refine(
      (files) => files?.[0]?.size <= 5000000,
      "El archivo debe ser menor a 5MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files?.[0]?.type
        ),
      "Solo se permiten archivos .jpg, .jpeg, .png y .webp"
    ),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type BillingInfoFormData = z.infer<typeof billingInfoSchema>;
export type BankInfoFormData = z.infer<typeof bankInfoSchema>;
export type PhotoFormData = z.infer<typeof photoSchema>;
