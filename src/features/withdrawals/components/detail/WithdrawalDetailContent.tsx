'use client';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Database } from 'lucide-react';
import { WithdrawalDetail } from '../../types/withdrawals.types';
import { WithdrawalOverviewSection } from './sections/WithdrawalOverviewSection';
import { WithdrawalUserInfoSection } from './sections/WithdrawalUserInfoSection';
import { WithdrawalPointsBreakdownSection } from './sections/WithdrawalPointsBreakdownSection';
import { WithdrawalPaymentHistorySection } from './sections/WithdrawalPaymentHistorySection';
import { WithdrawalTimelineSection } from './sections/WithdrawalTimelineSection';

interface WithdrawalDetailContentProps {
  withdrawal: WithdrawalDetail;
  withdrawalId: string;
}

export function WithdrawalDetailContent({
  withdrawal,
}: WithdrawalDetailContentProps) {
  const hasMetadata = withdrawal.metadata && Object.keys(withdrawal.metadata).length > 0;

  return (
    <div className="space-y-6">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Overview Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-foreground">Resumen</h3>
            <p className="text-xs text-muted-foreground">Estado y montos</p>
          </div>
          <WithdrawalOverviewSection withdrawal={withdrawal} />
        </div>

        {/* User Info Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-foreground">Usuario</h3>
            <p className="text-xs text-muted-foreground">Información del solicitante</p>
          </div>
          <WithdrawalUserInfoSection withdrawal={withdrawal} />
          
          {/* Metadata Section - Below User Info */}
          {hasMetadata && (
            <div>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  Conceptos
                </h4>
              </div>
              <Card className="p-4">
                <div className="space-y-3">
                  {Object.entries(withdrawal.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium text-right max-w-[60%] break-words">
                        {typeof value === 'object' 
                          ? JSON.stringify(value) 
                          : String(value || 'N/A')
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Points Breakdown Section */}
        <div className="space-y-3 lg:col-span-2 xl:col-span-1">
          <div>
            <h3 className="text-lg font-medium text-foreground">Puntos</h3>
            <p className="text-xs text-muted-foreground">Desglose de puntos</p>
          </div>
          <WithdrawalPointsBreakdownSection withdrawal={withdrawal} />
        </div>
      </div>

      <Separator />

      {/* Payment History Section - Full Width */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">Historial de Pagos</h3>
          <p className="text-xs text-muted-foreground">Transacciones relacionadas</p>
        </div>
        <WithdrawalPaymentHistorySection withdrawal={withdrawal} />
      </div>

      <Separator />

      {/* Timeline Section - Full Width */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">Cronología</h3>
          <p className="text-xs text-muted-foreground">Historial de eventos</p>
        </div>
        <WithdrawalTimelineSection withdrawal={withdrawal} />
      </div>
    </div>
  );
}