// src/app/dashboard/(cliente)/perfil/schemas/personal-info-schema.ts
import { z } from "zod";

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

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
