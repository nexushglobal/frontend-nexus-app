import { SaleDetailPage } from "@/features/sale/pages/SaleDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de Venta | Dashboard",
  description: "Visualiza el detalle completo de la venta",
};
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <SaleDetailPage referenceId={id} />;
}
