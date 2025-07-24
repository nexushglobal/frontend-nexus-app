import { z } from "zod";

export const cardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "El número de tarjeta es requerido")
    .transform((val) => val.replace(/\s/g, ""))
    .refine(
      (val) => /^\d{13,16}$/.test(val),
      "El número de tarjeta debe tener entre 13 y 16 dígitos"
    ),
  cvv: z
    .string()
    .min(1, "El CVV es requerido")
    .regex(/^\d{3,4}$/, "El CVV debe tener 3 o 4 dígitos"),
  expirationMonth: z
    .string()
    .min(1, "El mes de expiración es requerido")
    .refine(
      (val) => {
        const month = parseInt(val);
        return month >= 1 && month <= 12;
      },
      "El mes debe estar entre 1 y 12"
    ),
  expirationYear: z
    .string()
    .min(1, "El año de expiración es requerido")
    .length(4, "El año debe tener 4 dígitos")
    .refine(
      (val) => {
        const year = parseInt(val);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const cardMonth = parseInt("1"); // Se validará en el formulario completo

        return year >= currentYear;
      },
      "La tarjeta ha expirado"
    ),
  email: z
    .string()
    .email("El formato del email no es válido")
    .min(1, "El email es requerido")
    .max(50, "El email no puede superar los 50 caracteres"),
});

// Schema con validación cruzada de fecha
export const cardFormWithDateValidationSchema = cardFormSchema.refine(
  (data) => {
    const year = parseInt(data.expirationYear);
    const month = parseInt(data.expirationMonth);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
  },
  {
    message: "La tarjeta ha expirado",
    path: ["expirationYear"],
  }
);

export type CardFormData = z.infer<typeof cardFormSchema>;
