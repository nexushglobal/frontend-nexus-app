'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

interface MembershipKeyValueModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  changes?: Record<string, any> | null;
  metadata?: Record<string, any> | null;
  // Mantener compatibilidad con la prop anterior
  data?: Record<string, any> | null;
}

export function MembershipKeyValueModal({
  open,
  onOpenChange,
  title,
  changes,
  metadata,
  data, // Compatibilidad con versión anterior
}: MembershipKeyValueModalProps) {
  // Si se usa la prop data (compatibilidad), usarla como changes
  const actualChanges = changes || data;

  const changesEntries = actualChanges ? Object.entries(actualChanges) : [];
  const metadataEntries = metadata ? Object.entries(metadata) : [];

  const hasChanges = changesEntries.length > 0;
  const hasMetadata = metadataEntries.length > 0;
  const hasAnyData = hasChanges || hasMetadata;

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="bg-muted/30 p-3 rounded-md text-xs font-mono overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </div>
      );
    }
    return <span className="text-sm">{String(value)}</span>;
  };

  const renderSection = (entries: [string, any][]) => (
    <div className="bg-muted/30 p-3 rounded-md space-y-2">
      {entries.map(([key, value]) => (
        <div key={key} className="grid grid-cols-2 gap-2">
          <p className="text-xs text-muted-foreground capitalize">
            {key.replace(/_/g, ' ')}:
          </p>
          <p className="text-xs font-medium">
            {value !== null && value !== undefined ? String(value) : '-'}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {hasChanges && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Cambios Realizados</h3>
              {renderSection(changesEntries)}
            </div>
          )}

          {hasChanges && hasMetadata && <Separator className="my-6" />}

          {hasMetadata && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Información Adicional</h3>
              {renderSection(metadataEntries)}
            </div>
          )}

          {!hasAnyData && (
            <div className="p-8 text-center">
              <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No hay información disponible para mostrar
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
