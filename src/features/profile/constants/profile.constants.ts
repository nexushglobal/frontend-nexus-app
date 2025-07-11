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
  { value: "DNI", label: "DNI" },
  { value: "CE", label: "CE" },
  { value: "PAS", label: "PAS" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
] as const;

export const COUNTRIES = [
  { value: "Peru", label: "Perú", flag: "🇵🇪" },
  { value: "Colombia", label: "Colombia", flag: "🇨🇴" },
  { value: "Ecuador", label: "Ecuador", flag: "🇪🇨" },
  { value: "Bolivia", label: "Bolivia", flag: "🇧🇴" },
  { value: "Chile", label: "Chile", flag: "🇨🇱" },
  { value: "Argentina", label: "Argentina", flag: "🇦🇷" },
  { value: "Uruguay", label: "Uruguay", flag: "🇺🇾" },
  { value: "Paraguay", label: "Paraguay", flag: "🇵🇾" },
  { value: "Venezuela", label: "Venezuela", flag: "🇻🇪" },
  { value: "Mexico", label: "México", flag: "🇲🇽" },
  { value: "España", label: "España", flag: "🇪🇸" },
] as const;

export const BANKS = [
  { value: "BCP", label: "Banco de Crédito del Perú", icon: "🏦" },
  { value: "BBVA", label: "BBVA Continental", icon: "🏦" },
  { value: "Interbank", label: "Interbank", icon: "🏦" },
  { value: "ScotiaBank", label: "ScotiaBank Perú", icon: "🏦" },
  { value: "BanBif", label: "Banco BanBif", icon: "🏦" },
  { value: "Pichincha", label: "Banco Pichincha", icon: "🏦" },
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
