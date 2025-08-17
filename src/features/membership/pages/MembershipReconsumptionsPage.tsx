'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MembershipKeyValueModal } from '../components/MembershipKeyValueModal';
import { ReconsumptionsSummary } from '../components/ReconsumptionsSummary';
import { ReconsumptionsTable } from '../components/ReconsumptionsTable';
import { MembershipService } from '../services/membershipService';
import type { ReconsumtionResponse } from '../types/reconsumption.type';

export default function MembershipReconsumptionsPage() {
  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // modals
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);
  const [paymentDetailsData, setPaymentDetailsData] = useState<Record<
    string,
    any
  > | null>(null);

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const { data, isLoading, isError, error } = useQuery<ReconsumtionResponse>({
    queryKey: ['membership-reconsumptions', params],
    queryFn: () => MembershipService.getReconsumptionDetail(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return (
      <div className="container">
        <PageHeader
          title="Mis Reconsumos"
          subtitle="Gestiona los reconsumos de tu membresía"
          className="mb-6"
          variant="gradient"
          backUrl="/dashboard/cli-membresias/mi-plan"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {(error as any)?.message || 'Error al cargar reconsumos'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Mis Reconsumos"
        subtitle="Gestiona los reconsumos de tu membresía"
        className="mb-6"
        variant="gradient"
        backUrl="/dashboard/cli-membresias/mi-plan"
      />

      <ReconsumptionsSummary membership={data?.membership} />

      <ReconsumptionsTable
        items={data?.infoReconsumptions.items || []}
        pagination={data?.infoReconsumptions.pagination}
        isLoading={isLoading}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onOpenPaymentDetails={(pd) => {
          setPaymentDetailsData(pd);
          setOpenPaymentDetails(true);
        }}
      />

      {/* Modals */}
      <MembershipKeyValueModal
        open={openPaymentDetails}
        onOpenChange={setOpenPaymentDetails}
        title="Detalles de pago"
        data={paymentDetailsData}
      />
    </div>
  );
}
