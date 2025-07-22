"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSaleDetail } from "../hooks/useSaleDetail";
import { SaleDetailCard } from "../components/SaleDetailCard";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import { Suspense } from "react";
import { PaymentDetailLoading } from "@/features/payment/components/shared/skeleton/PaymentDetailLoading";

interface SaleDetailPageProps {
  referenceId: string;
}

export function SaleDetailPage({ referenceId }: SaleDetailPageProps) {
  const router = useRouter();
  const { saleDetail, loading, error, refetch } = useSaleDetail(referenceId);

  const handleBack = () => {
    router.push("/dashboard/ventas");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Ventas
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Detalle de Venta
            </h1>
            <p className="text-muted-foreground">Error al cargar el detalle</p>
          </div>
        </div>
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <div className="text-red-600 mb-4">
            <h3 className="font-semibold">Error al cargar la venta</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  if (!saleDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Ventas
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Detalle de Venta
            </h1>
            <p className="text-muted-foreground">Venta no encontrada</p>
          </div>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-gray-600">
            <h3 className="font-semibold">Venta no encontrada</h3>
            <p className="text-sm mt-1">
              La venta con ID {referenceId} no existe o no tienes permisos para
              verla.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Detalle de Venta #${referenceId}`}
        subtitle="Información completa y detallada de la venta"
        variant="gradient"
        backUrl="/dashboard/ventas"
        className="mb-6"
      />
      <Suspense fallback={<PaymentDetailLoading />}>
        <SaleDetailCard saleDetail={saleDetail} />
      </Suspense>
    </div>
  );
}
