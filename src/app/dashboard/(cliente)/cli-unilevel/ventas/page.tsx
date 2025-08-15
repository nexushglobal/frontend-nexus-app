import { SalesPage } from "@/features/sale/pages/SalesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventas | Dashboard",
  description: "Gestiona y visualiza las ventas realizadas",
};

export default function Page() {
  return <SalesPage />;
}
