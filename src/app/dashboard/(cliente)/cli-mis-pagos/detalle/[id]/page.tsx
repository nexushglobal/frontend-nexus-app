import { PaymentDetailPage } from "@/features/payment/components/pages/PaymentDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de Pago | Dashboard",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <PaymentDetailPage paymentId={id} />;
}
