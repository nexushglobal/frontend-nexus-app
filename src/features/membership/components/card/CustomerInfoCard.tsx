"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type culqiData } from "@/features/shared/types/culqi.types";
import { Edit2, Mail, MapPin, Phone, User } from "lucide-react";

interface CustomerInfoCardProps {
  culqiData: culqiData;
  onEdit: () => void;
}

const COUNTRY_NAMES: Record<string, string> = {
  PE: "Perú",
  CO: "Colombia",
  MX: "México",
  US: "Estados Unidos",
  AR: "Argentina",
  CL: "Chile",
  EC: "Ecuador",
  BO: "Bolivia",
};

export function CustomerInfoCard({ culqiData, onEdit }: CustomerInfoCardProps) {
  return (
    <Card className="border-info/20 bg-info/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-info" />
            Información del Cliente
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Edit2 className="h-3 w-3" />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {culqiData.firstName} {culqiData.lastName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{culqiData.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{culqiData.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {COUNTRY_NAMES[culqiData.country_code] || culqiData.country_code}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-info/20">
          <div className="text-xs text-muted-foreground">
            {culqiData.address}, {culqiData.address_city}
          </div>
        </div>

        <div className="flex justify-end">
          <Badge variant="secondary" className="text-xs">
            Cliente registrado
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
