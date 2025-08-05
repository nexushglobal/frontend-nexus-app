import { SaleDetailPage } from "@/features/sale/pages/SaleDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de Venta | Dashboard",
  description: "Visualiza el detalle completo de la venta",
};
interface PageProps {
  params: Promise<{ saleId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { saleId } = await params;

  return <SaleDetailPage referenceId={saleId} />;
}
