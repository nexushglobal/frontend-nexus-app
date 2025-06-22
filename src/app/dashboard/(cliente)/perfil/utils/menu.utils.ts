import {
  FileText,
  Landmark,
  Phone,
  Receipt,
  Share2,
  Shield,
  User,
} from "lucide-react";

export const menuSections = [
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
];
