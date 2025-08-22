'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertCircle, Banknote } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useWithdrawalDetail } from '../../hooks/useWithdrawalDetail';
import { WithdrawalDetailContent } from './WithdrawalDetailContent';
import { WithdrawalDetailLoading } from './WithdrawalDetailLoading';

export default function WithdrawalDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const {
    data: withdrawal,
    isLoading,
    error,
    isError,
  } = useWithdrawalDetail(id);

  if (isError) {
    return (
      <div className="container space-y-6">
        <PageHeader
          title="Error al cargar retiro"
          subtitle="Ha ocurrido un problema al obtener la información"
          variant="gradient"
          icon={AlertCircle}
          backUrl="/dashboard/cli-transacciones/mis-retiros"
          className="mb-6"
        />

        <Alert
          variant="destructive"
          className="border-l-4 border-l-destructive shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <AlertDescription className="font-medium">
                Error al cargar el detalle del retiro
              </AlertDescription>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Ha ocurrido un error inesperado'}
              </p>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <PageHeader
          title="Cargando retiro..."
          subtitle="Obteniendo información detallada"
          variant="gradient"
          icon={Banknote}
          backUrl="/dashboard/cli-transacciones/mis-retiros"
          className="mb-6"
        />
        <WithdrawalDetailLoading />
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="container space-y-6">
        <PageHeader
          title="Retiro no encontrado"
          subtitle="El retiro solicitado no existe"
          variant="gradient"
          icon={AlertCircle}
          backUrl="/dashboard/cli-transacciones/mis-retiros"
          className="mb-6"
        />

        <Alert className="border-l-4 border-l-warning shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div className="space-y-1">
              <AlertDescription className="font-medium">
                Retiro no encontrado
              </AlertDescription>
              <p className="text-sm text-muted-foreground">
                El retiro solicitado no existe o no tienes permisos para verlo
              </p>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <PageHeader
        title={`Retiro #${withdrawal.id}`}
        subtitle="Detalle completo de la solicitud de retiro"
        variant="gradient"
        icon={Banknote}
        backUrl="/dashboard/cli-transacciones/mis-retiros"
        className="mb-6"
      />

      <WithdrawalDetailContent
        withdrawal={withdrawal}
        withdrawalId={id.toString()}
      />
    </div>
  );
}
