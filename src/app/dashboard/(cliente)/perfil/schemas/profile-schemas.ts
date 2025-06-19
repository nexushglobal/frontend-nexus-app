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

export const personalInfoSchema = z.object({
  nickname: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 3 && val.length <= 50),
      "El nickname debe tener entre 3 y 50 caracteres"
    )
    .refine(
      (val) => !val || /^[a-zA-Z0-9_.-]+$/.test(val),
      "El nickname solo debe contener letras, números, puntos, guiones y guiones bajos"
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "El correo debe tener un formato válido"
    ),
  documentType: z
    .enum(["DNI", "CE", "PAS"], {
      errorMap: () => ({
        message: "El tipo de documento debe ser DNI, CE o PAS",
      }),
    })
    .optional(),
  documentNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 8 && val.length <= 20),
      "El número de documento debe tener entre 8 y 20 caracteres"
    )
    .refine(
      (val) => !val || /^[a-zA-Z0-9]+$/.test(val),
      "El número de documento solo debe contener letras y números"
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
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type PhotoFormData = z.infer<typeof photoSchema>;
