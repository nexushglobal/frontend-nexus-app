'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MembershipKeyValueModal } from '../components/MembershipKeyValueModal';
import { ReconsumptionTypeModal } from '../components/ReconsumptionTypeModal';
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

  const [openEditAuto, setOpenEditAuto] = useState(false);
  const [autoRenewalDraft, setAutoRenewalDraft] = useState(false);
  const [openEditType, setOpenEditType] = useState(false);

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const { data, isLoading, isError, error } = useQuery<ReconsumtionResponse>({
    queryKey: ['membership-reconsumptions', params],
    queryFn: () => MembershipService.getReconsumptionDetail(params),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // Keep modal draft synced when opening
  useEffect(() => {
    if (openEditAuto && typeof data?.autoRenewal === 'boolean') {
      setAutoRenewalDraft(data.autoRenewal);
    }
  }, [openEditAuto, data?.autoRenewal]);
  console.log(
    'data?.membership?.typeReconsumption',
    data?.membership?.typeReconsumption,
  );

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

      <ReconsumptionsSummary
        canReconsume={data?.canReconsume}
        autoRenewal={data?.autoRenewal}
        reconsumptionAmount={data?.reconsumptionAmount}
        isLoading={isLoading}
        onEditAutoRenewal={() => setOpenEditAuto(true)}
        typeReconsumption={data?.membership?.typeReconsumption}
        useCard={data?.membership?.useCard}
        onEditType={() => setOpenEditType(true)}
      />

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

      <ReconsumptionTypeModal
        open={openEditType}
        onOpenChange={setOpenEditType}
        value={data?.membership?.typeReconsumption}
        useCard={data?.membership?.useCard}
        onSave={({ typeReconsumption, useCard }) => {
          // Por ahora solo imprime en consola
          console.log('Guardar typeReconsumption/useCard:', {
            typeReconsumption,
            useCard,
          });
        }}
      />

      <Dialog open={openEditAuto} onOpenChange={setOpenEditAuto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar auto-renovación</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 py-2">
            <Switch
              id="auto-renewal"
              checked={autoRenewalDraft}
              onCheckedChange={setAutoRenewalDraft}
            />
            <Label htmlFor="auto-renewal">
              {autoRenewalDraft ? 'Activada' : 'Desactivada'}
            </Label>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                // Por ahora solo imprime en consola
                console.log('Guardar autoRenewal:', autoRenewalDraft);
                setOpenEditAuto(false);
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
