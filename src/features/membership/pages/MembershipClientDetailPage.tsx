'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MembershipHistoryTable } from '../components/MembershipHistoryTable';
import { MembershipKeyValueModal } from '../components/MembershipKeyValueModal';
import { MembershipOverviewCard } from '../components/MembershipOverviewCard';
import { MembershipService } from '../services/membershipService';
import {
  MembershipDetailResponse,
  MembershipHistoryResponse,
} from '../types/membership.types';

export default function MembershipClientDetailPage() {
  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openChanges, setOpenChanges] = useState(false);
  const [openMetadata, setOpenMetadata] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState<Record<
    string,
    any
  > | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<Record<
    string,
    any
  > | null>(null);

  // Queries
  const {
    data: detail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: errorDetail,
  } = useQuery<MembershipDetailResponse>({
    queryKey: ['membership-detail'],
    queryFn: () => MembershipService.getMembershipDetail(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const historyParams = useMemo(() => ({ page, limit }), [page, limit]);

  const {
    data: history,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: errorHistory,
  } = useQuery<MembershipHistoryResponse>({
    queryKey: ['membership-history', historyParams],
    queryFn: () => MembershipService.getUserMembershipHistory(historyParams),
    enabled: showHistory,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const handleOpenChanges = (data: Record<string, any>) => {
    setSelectedChanges(data);
    setOpenChanges(true);
  };
  const handleOpenMetadata = (data: Record<string, any>) => {
    setSelectedMetadata(data);
    setOpenMetadata(true);
  };

  if (isErrorDetail) {
    return (
      <div className="container">
        <PageHeader
          title="Mi Membresía"
          subtitle="Consulta los detalles de tu plan y tus movimientos"
          className="mb-6"
          variant="gradient"
          backUrl="/dashboard/cli-membresias/planes"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar tu membresía:{' '}
            {(errorDetail as any)?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const showReconsumoLink = detail?.canReconsume || false;

  return (
    <div className="container">
      <PageHeader
        title="Mi Membresía"
        subtitle="Consulta los detalles de tu plan y tus movimientos"
        className="mb-6"
        variant="gradient"
        backUrl="/dashboard/cli-membresias/planes"
      />

      {/* Membership detail */}
      <MembershipOverviewCard
        detail={detail}
        isLoading={isLoadingDetail}
        showReconsumoLink={showReconsumoLink}
      />

      <Card className="shadow-sm mb-4">
        <CardContent className="pt-4 flex justify-end">
          <Button variant="outline" onClick={() => setShowHistory((v) => !v)}>
            {showHistory ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Ocultar movimientos
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Mostrar movimientos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* History table */}
      {showHistory && (
        <MembershipHistoryTable
          items={history?.items || []}
          isLoading={isLoadingHistory}
          pagination={history?.pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          errorMessage={
            isErrorHistory
              ? (errorHistory as any)?.message || 'Error desconocido'
              : null
          }
          onOpenChanges={handleOpenChanges}
          onOpenMetadata={handleOpenMetadata}
        />
      )}

      {/* Modals */}
      <MembershipKeyValueModal
        open={openChanges}
        onOpenChange={setOpenChanges}
        title="Cambios"
        data={selectedChanges}
      />
      <MembershipKeyValueModal
        open={openMetadata}
        onOpenChange={setOpenMetadata}
        title="Metadata"
        data={selectedMetadata}
      />
    </div>
  );
}
