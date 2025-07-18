"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Maximize2, DollarSign, Calendar } from "lucide-react";
import type { Lot } from "../types/lots.types";
import {
  formatCurrency,
  formatDate,
} from "@/features/shared/utils/formatCurrency";

interface LotsCardProps {
  lot: Lot;
  currency?: string;
}

export function LotsCard({ lot, currency = "PEN" }: LotsCardProps) {
  const isActive = lot.status === "Activo";

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">Lote {lot.name}</h3>
            </div>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {lot.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Maximize2 className="h-4 w-4" />
            <span>
              {parseFloat(lot.area).toLocaleString("es-PE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              m²
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Precio Lote:
              </span>
              <span className="font-mono text-sm">
                {formatCurrency(parseFloat(lot.lotPrice), currency)}
              </span>
            </div>

            {parseFloat(lot.urbanizationPrice) > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Urbanización:
                </span>
                <span className="font-mono text-sm">
                  {formatCurrency(parseFloat(lot.urbanizationPrice), currency)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total:</span>
              </div>
              <span className="font-mono font-semibold text-primary">
                {formatCurrency(lot.totalPrice, currency)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(lot.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LotsCardsProps {
  data: Lot[];
  currency?: string;
  isLoading?: boolean;
}

export function LotsCards({
  data,
  currency = "PEN",
  isLoading,
}: LotsCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="h-5 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-16 bg-muted rounded-full" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded" />
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-5 w-28 bg-muted rounded" />
                  </div>
                </div>

                <div className="flex justify-between border-t pt-3">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No hay lotes activos para mostrar
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Selecciona un proyecto y configura los filtros
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((lot) => (
        <LotsCard key={lot.id} lot={lot} currency={currency} />
      ))}
    </div>
  );
}
