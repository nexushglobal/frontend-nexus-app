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
  const [showHistory, setShowHistory] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openDetails, setOpenDetails] = useState(false);
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

  const handleOpenDetails = (changes: Record<string, any>, metadata?: Record<string, any>) => {
    setSelectedChanges(changes);
    setSelectedMetadata(metadata || null);
    setOpenDetails(true);
  };

  // Mantener compatibilidad para funciones separadas si es necesario
  const handleOpenChanges = (data: Record<string, any>) => {
    setSelectedChanges(data);
    setSelectedMetadata(null);
    setOpenDetails(true);
  };
  const handleOpenMetadata = (data: Record<string, any>) => {
    setSelectedChanges(null);
    setSelectedMetadata(data);
    setOpenDetails(true);
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

      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ChevronDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Historial de Movimientos</h3>
                <p className="text-sm text-muted-foreground">
                  Consulta todos los cambios y actualizaciones de tu membresía
                </p>
              </div>
            </div>
            <Button 
              variant={showHistory ? "default" : "outline"} 
              onClick={() => setShowHistory((v) => !v)}
              className="gap-2"
            >
              {showHistory ? (
                <>
                  <ChevronUp className="h-4 w-4" /> 
                  Ocultar Historial
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" /> 
                  Ver Historial
                </>
              )}
            </Button>
          </div>
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
          onOpenChanges={handleOpenDetails}
          onOpenMetadata={handleOpenMetadata}
        />
      )}

      {/* Modals */}
      <MembershipKeyValueModal
        open={openDetails}
        onOpenChange={setOpenDetails}
        title="Detalles del Movimiento"
        changes={selectedChanges}
        metadata={selectedMetadata}
      />
    </div>
  );
}
