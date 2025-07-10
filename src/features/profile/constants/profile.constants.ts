import {
  FileText,
  Landmark,
  Phone,
  Receipt,
  Share2,
  Shield,
  User,
} from "lucide-react";

export const DOCUMENT_TYPES = [
  { value: "DNI", label: "DNI - Documento Nacional de Identidad" },
  { value: "CE", label: "CE - Carnet de Extranjería" },
  { value: "PAS", label: "PAS - Pasaporte" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
] as const;

export const COUNTRIES = [
  { value: "Argentina", label: "Argentina" },
  { value: "Bolivia", label: "Bolivia" },
  { value: "Chile", label: "Chile" },
  { value: "Colombia", label: "Colombia" },
  { value: "Costa Rica", label: "Costa Rica" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "España", label: "España" },
  { value: "México", label: "México" },
  { value: "Panamá", label: "Panamá" },
  { value: "Perú", label: "Perú" },
  { value: "Uruguay", label: "Uruguay" },
  { value: "Venezuela", label: "Venezuela" },
] as const;

export const BANKS = [
  { value: "BCP", label: "Banco de Crédito del Perú" },
  { value: "BBVA", label: "BBVA Continental" },
  { value: "Interbank", label: "Interbank" },
  { value: "ScotiaBank", label: "ScotiaBank Perú" },
  { value: "BanBif", label: "Banco BanBif" },
  { value: "Pichincha", label: "Banco Pichincha" },
] as const;

export const PROFILE_SECTIONS = [
  {
    id: "overview",
    label: "Resumen",
    icon: User,
    description: "Vista general del perfil",
  },
  {
    id: "personal",
    label: "Personal",
    icon: FileText,
    description: "Información personal y documentos",
  },
  {
    id: "contact",
    label: "Contacto",
    icon: Phone,
    description: "Información de contacto",
  },
  {
    id: "billing",
    label: "Facturación",
    icon: Receipt,
    description: "Datos de facturación",
  },
  {
    id: "banking",
    label: "Bancario",
    icon: Landmark,
    description: "Información bancaria",
  },
  {
    id: "referrals",
    label: "Referencias",
    icon: Share2,
    description: "Códigos de referido",
  },
  {
    id: "security",
    label: "Seguridad",
    icon: Shield,
    description: "Contraseña y seguridad",
  },
] as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "Este campo es requerido",
  INVALID_EMAIL: "El correo debe tener un formato válido",
  INVALID_PHONE: "El teléfono debe tener un formato válido",
  INVALID_RUC: "El RUC debe tener 11 dígitos",
  INVALID_DNI: "El DNI debe tener 8 dígitos",
  PHOTO_SIZE: "La foto no debe superar los 2MB",
  PHOTO_FORMAT: "Solo se permiten archivos JPG, PNG o WEBP",
} as const;
