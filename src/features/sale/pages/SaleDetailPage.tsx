'use client';

import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { Suspense } from 'react';
import SaleDetailHeader from '../components/SaleDetailHeader';
import SaleDetailSkeleton from '../components/SaleDetailSkeleton';
import SaleFinancingInfo from '../components/SaleFinancingInfo';
import SaleGeneralInfo from '../components/SaleGeneralInfo';
import { useSaleDetail } from '../hooks/useSaleDetail';

interface SaleDetailPageProps {
  referenceId: string;
}

export function SaleDetailPage({ referenceId }: SaleDetailPageProps) {
  const { saleDetail, loading, error } = useSaleDetail(referenceId);

  if (loading) {
    return <SaleDetailSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!saleDetail) {
    return <div>No se encontró la venta</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalle de Venta"
        subtitle="Información completa y detallada de la venta"
        variant="gradient"
        backUrl="/dashboard/cli-unilevel/ventas"
        className="mb-6"
      />
      <Suspense fallback={<SaleDetailSkeleton />}>
        <div className="space-y-6">
          <SaleDetailHeader sale={saleDetail!} />
          {saleDetail?.financing && <SaleFinancingInfo sale={saleDetail!} />}
          <SaleGeneralInfo sale={saleDetail!} />
        </div>
      </Suspense>
    </div>
  );
}
