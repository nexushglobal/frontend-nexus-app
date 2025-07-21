import { SaleDetailPage } from "@/features/sale/components/SaleDetailPage";
import type { Metadata } from "next";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Detalle de Venta ${params.id} | Dashboard`,
    description: "Visualiza el detalle completo de la venta",
  };
}

export default function Page({ params }: Props) {
  return <SaleDetailPage saleId={params.id} />;
}
