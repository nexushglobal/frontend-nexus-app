"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientResponse } from "../../types/sale-response.types";

interface LeadInfoCardProps {
  lead: Partial<ClientResponse>;
}

export default function LeadInfoCard({ lead }: LeadInfoCardProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xs text-blue-500">
          Información del Lead
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
          <span className="font-medium">
            {lead.firstName} {lead.lastName}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Documento:</span>
          <span className="font-medium">
            {lead.documentType}: {lead.document}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
