'use client';

import { PageHeader } from '@features/shared/components/common/PageHeader';
import { Box } from 'lucide-react';
import { Suspense } from 'react';
import CreateSaleLoteWizard from '../components/SaleLoteWizard';
import SaleSkeleton from '../components/skeleton/SaleSkeleton';

export default function SaleLotePage() {
  return (
    <div className="container py-8">
      <PageHeader
        icon={Box}
        title="Comprar Lote"
        subtitle="Compra un lote siguiendo el proceso paso a paso"
        variant="gradient"
        className="mb-6"
      />
      <Suspense fallback={<SaleSkeleton />}>
        <CreateSaleLoteWizard />
      </Suspense>
    </div>
  );
}
