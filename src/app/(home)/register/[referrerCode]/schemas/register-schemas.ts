// src/app/(home)/register/[referrerCode]/schemas/register-schemas.ts
import { z } from "zod";

// Enums
export const DocumentTypeEnum = z.enum(["DNI", "CE", "PAS"], {
  errorMap: () => ({ message: "El tipo de documento debe ser DNI, CE o PAS" }),
});

export const GenderEnum = z.enum(["MASCULINO", "FEMENINO", "OTRO"], {
  errorMap: () => ({
    message: "El género debe ser MASCULINO, FEMENINO o OTRO",
  }),
});

export const PositionEnum = z.enum(["LEFT", "RIGHT"], {
  errorMap: () => ({ message: "La posición debe ser LEFT o RIGHT" }),
});

// Schema para el paso 1 - Documento
export const documentStepSchema = z.object({
  documentType: DocumentTypeEnum,
  documentNumber: z
    .string()
    .min(1, "El número de documento es requerido")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "El número de documento solo debe contener letras y números"
    ),
});

// Schema para el paso 2 - Información personal
export const personalInfoStepSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").trim(),
  lastName: z.string().min(1, "El apellido es requerido").trim(),
  phone: z
    .string()
    .min(1, "El celular es requerido")
    .regex(
      /^[0-9+()-\s]+$/,
      "El celular solo debe contener números, símbolos (+, -, ()) y espacios"
    )
    .trim(),
  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD"),
  gender: GenderEnum,
  country: z.string().min(1, "El país es requerido").trim(),
});

// Schema base para credenciales (sin confirmPassword ni términos)
export const baseCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("El correo debe tener un formato válido")
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/,
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
});

// Schema para el paso 3 - Credenciales (con confirmPassword y términos)
export const credentialsStepSchema = baseCredentialsSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones para continuar",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Schema completo del registro
export const completeRegistrationSchema = documentStepSchema
  .merge(personalInfoStepSchema)
  .merge(baseCredentialsSchema) // Usar el schema base sin confirmPassword ni términos
  .extend({
    referrerCode: z.string().optional(),
    position: PositionEnum.optional(),
    roleCode: z.string().default("CLI"),
  });

// Tipos TypeScript
export type DocumentStepData = z.infer<typeof documentStepSchema>;
export type PersonalInfoStepData = z.infer<typeof personalInfoStepSchema>;
export type CredentialsStepData = z.infer<typeof credentialsStepSchema>;
export type CompleteRegistrationData = z.infer<
  typeof completeRegistrationSchema
>;

// Países de habla española
export const spanishSpeakingCountries = [
  { value: "Argentina", label: "Argentina" },
  { value: "Bolivia", label: "Bolivia" },
  { value: "Chile", label: "Chile" },
  { value: "Colombia", label: "Colombia" },
  { value: "Costa Rica", label: "Costa Rica" },
  { value: "Cuba", label: "Cuba" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "El Salvador", label: "El Salvador" },
  { value: "España", label: "España" },
  { value: "Guatemala", label: "Guatemala" },
  { value: "Guinea Ecuatorial", label: "Guinea Ecuatorial" },
  { value: "Honduras", label: "Honduras" },
  { value: "México", label: "México" },
  { value: "Nicaragua", label: "Nicaragua" },
  { value: "Panamá", label: "Panamá" },
  { value: "Paraguay", label: "Paraguay" },
  { value: "Perú", label: "Perú" },
  { value: "Puerto Rico", label: "Puerto Rico" },
  { value: "República Dominicana", label: "República Dominicana" },
  { value: "Uruguay", label: "Uruguay" },
  { value: "Venezuela", label: "Venezuela" },
];

// Tipos de documento
export const documentTypes = [
  { value: "DNI", label: "DNI - Documento Nacional de Identidad" },
  { value: "CE", label: "CE - Carnet de Extranjería" },
  { value: "PAS", label: "PAS - Pasaporte" },
];

// Opciones de género
export const genderOptions = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
];
