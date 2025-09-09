'use client';

import { Card } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { PaymentUserDetailResponse } from '../../types/response-payment';
import { DetailsSection } from '../shared/sections/DetailsSection';
import { ItemsSection } from '../shared/sections/ItemsSection';
import { OverviewSection } from '../shared/sections/OverviewSection';
import { TimelineSection } from '../shared/sections/TimelineSection';

interface PaymentDetailContentProps {
  payment: PaymentUserDetailResponse;
  paymentId: string;
}

export function PaymentDetailContent({
  payment,
}: PaymentDetailContentProps) {
  const hasMetadata =
    payment.metadata && Object.keys(payment.metadata).length > 0;

  return (
    <div className="space-y-6">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Overview Section - Compact */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-foreground">Resumen</h3>
            <p className="text-xs text-muted-foreground">Estado y montos</p>
          </div>
          <OverviewSection {...payment} />
        </div>

        {/* Details Section - Compact */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-foreground">Detalles</h3>
            <p className="text-xs text-muted-foreground">Información técnica</p>
          </div>
          <DetailsSection {...payment} />
          
          {/* Metadata Section - Below Details */}
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
                  {Object.entries(payment.metadata).map(([key, value]) => (
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

        {/* Items Section - Always visible on desktop, stacked on mobile/tablet */}
        <div className="space-y-3 md:col-span-2 xl:col-span-1">
          <div>
            <h3 className="text-lg font-medium text-foreground">Artículos</h3>
            <p className="text-xs text-muted-foreground">Voucher de pago</p>
          </div>
          <ItemsSection {...payment} />
        </div>
      </div>

      {/* Timeline Section - Compact Full Width */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">Cronología</h3>
          <p className="text-xs text-muted-foreground">Historial de eventos</p>
        </div>
        <TimelineSection {...payment} />
      </div>
    </div>
  );
}
