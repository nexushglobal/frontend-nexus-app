import { z } from "zod";

export const customerSchema = z.object({
  email: z
    .string()
    .email("El formato del email no es válido")
    .min(1, "El email es requerido")
    .max(50, "El email no puede superar los 50 caracteres"),
  first_name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo debe contener letras"),
  last_name: z
    .string()
    .min(1, "El apellido es requerido")
    .max(50, "El apellido no puede superar los 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El apellido solo debe contener letras"),
  address: z
    .string()
    .min(1, "La dirección es requerida")
    .max(200, "La dirección no puede superar los 200 caracteres"),
  address_city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(100, "La ciudad no puede superar los 100 caracteres"),
  country_code: z
    .string()
    .min(1, "El código de país es requerido")
    .length(2, "El código de país debe tener 2 caracteres")
    .regex(/^[A-Z]{2}$/, "El código de país debe ser en mayúsculas"),
  phone_number: z
    .string()
    .min(1, "El número de teléfono es requerido")
    .min(9, "El número de teléfono debe tener al menos 9 dígitos")
    .max(15, "El número de teléfono no puede superar los 15 dígitos")
    .regex(/^\+?[\d\s-]+$/, "El formato del teléfono no es válido"),
});

export const customerUpdateSchema = customerSchema.partial().omit({ email: true });

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CustomerUpdateFormData = z.infer<typeof customerUpdateSchema>;
