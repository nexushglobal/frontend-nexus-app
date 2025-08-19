import { PrivacyTermsContent } from "@/features/legal/components/PrivacyTermsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad y Términos | Nexus Global",
  description: "Términos y condiciones, política de privacidad y protección de datos personales de Nexus Global Network.",
};

export default function PrivacyTermsPage() {
  return <PrivacyTermsContent />;
}