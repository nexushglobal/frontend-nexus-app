'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, Package } from 'lucide-react';
import type { LotDetail } from '../types/lots.types';

interface LotsCardsProps {
  data: LotDetail[];
}

export function LotsCards({ data }: LotsCardsProps) {
  if (data.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-lg font-semibold">
            No hay lotes disponibles
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            No se encontraron lotes que coincidan con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((lot) => (
        <LotCard key={lot.id} lot={lot} />
      ))}
    </div>
  );
}

interface LotCardProps {
  lot: LotDetail;
}

function LotCard({ lot }: LotCardProps) {
  return (
    <Card className="border-2 hover:border-primary/20 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-semibold">{lot.name}</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>Manzana {lot.blockName} - Etapa {lot.stageName}</span>
                </div>
              </div>
            </div>
            <Badge variant={getLotStatusVariant(lot.status)}>
              {getLotStatusText(lot.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Área:</span>
              <div className="font-medium">{lot.area} m²</div>
            </div>
            <div>
              <span className="text-muted-foreground">Proyecto:</span>
              <div className="font-medium">{lot.projectName}</div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio Lote:</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(lot.lotPrice), lot.projectCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precio Urbanización:</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(lot.urbanizationPrice), lot.projectCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-1 border-t">
              <span>Total:</span>
              <span>{formatCurrency(lot.totalPrice, lot.projectCurrency)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
            <Calendar className="h-3 w-3" />
            <span>Registrado: {new Date(lot.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getLotStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case 'disponible':
    case 'available':
      return 'default';
    case 'reservado':
    case 'reserved':
      return 'secondary';
    case 'vendido':
    case 'sold':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getLotStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'disponible':
    case 'available':
      return 'Disponible';
    case 'reservado':
    case 'reserved':
      return 'Reservado';
    case 'vendido':
    case 'sold':
      return 'Vendido';
    default:
      return status;
  }
}