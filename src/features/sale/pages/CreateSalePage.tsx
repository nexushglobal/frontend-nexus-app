"use client";

import { PageHeader } from "@features/shared/components/common/PageHeader";
import { Suspense } from "react";
import CreateSaleWizard from "../components/CreateSaleWizard";
import SaleSkeleton from "../components/skeleton/SaleSkeleton";
import { Box } from "lucide-react";

export default function CreateSalePage() {
  return (
    <div className="container py-8">
      <PageHeader
        icon={Box}
        title="Crear Venta"
        subtitle="Registra una nueva venta siguiendo el proceso paso a paso"
        variant="gradient"
        className="mb-6"
      />
      <Suspense fallback={<SaleSkeleton />}>
        <CreateSaleWizard />
      </Suspense>
    </div>
  );
}
