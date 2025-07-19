import CreateSalePage from "@features/sale/pages/CreateSalePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Venta | Dashboard",
  description: "Registra una nueva venta siguiendo el proceso paso a paso",
};

export default function Page() {
  return <CreateSalePage />;
}
