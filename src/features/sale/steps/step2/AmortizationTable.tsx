"use client";

import { Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Amortization } from "../../types/sale-response.types";
import { CronogramaTable } from "../../components/CronogramaTable";
import { CurrencyType } from "../../types/sale.enums";

interface AmortizationTableProps {
  installments: Amortization[];
  visible: boolean;
}

export default function AmortizationTable({
  installments,
  visible,
}: AmortizationTableProps) {
  if (!visible || installments.length === 0) {
    return null;
  }

  const totalAmount = installments.reduce(
    (sum, item) => sum + item.couteAmount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Cronograma de Pagos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <CronogramaTable currency={CurrencyType.PEN} data={installments} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total de cuotas: {installments.length}
          </span>
          <span className="text-lg font-bold">
            Total a pagar: S/ {totalAmount.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
