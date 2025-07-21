import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { Eye, User, Phone, CreditCard } from "lucide-react";
import { Sale } from "../types/sale.types";
import { formatCurrency } from "@/features/shared/utils/formatCurrency";

interface SaleCardProps {
  sale: Sale;
}

export function SaleCard({ sale }: SaleCardProps) {
  const formatPaymentType = (type: string) => {
    const types = {
      DIRECT_PAYMENT: "Pago Directo",
      INSTALLMENT: "Cuotas",
      RESERVATION: "Reserva",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {sale.clientFullName}
          </CardTitle>
          <SaleStatusBadge status={sale.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="w-4 h-4" />
            <span>
              {formatCurrency(parseFloat(sale.amount), sale.currency)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{formatPaymentType(sale.type)}</span>
          </div>

          {sale.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{sale.phone}</span>
            </div>
          )}

          {sale.numberCoutes && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Cuotas:</span> {sale.numberCoutes}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500">
            ID: {sale.id.slice(0, 8)}...
          </div>

          <Link
            href={`/dashboard/ventas/${sale.saleIdReference}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Eye className="w-4 h-4" />
            Ver Detalle
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
