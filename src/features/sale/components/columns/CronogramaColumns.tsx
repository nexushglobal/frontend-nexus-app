import { Button } from "@/components/ui/button";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  formatCurrency,
  formatDate,
} from "@/features/shared/utils/formatCurrency";
import { Amortization } from "../../types/sale-response.types";
import { CurrencyType } from "../../types/sale.enums";

interface CreateCronogramaColumnsProps {
  currency?: CurrencyType;
}

export function createCronogramaColumns({
  currency = CurrencyType.PEN,
}: CreateCronogramaColumnsProps = {}): ColumnDef<Amortization>[] {
  return [
    {
      id: "cuota",
      header: "Cuota",
      cell: ({ row }) => {
        const cuota = row.index + 1;
        return <div className="text-right font-mono">{cuota}</div>;
      },
    },
    {
      accessorKey: "expectedPaymentDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Fecha de pago
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.getValue("expectedPaymentDate"))}
          </div>
        );
      },
    },
    {
      accessorKey: "couteAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Monto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono font-semibold text-primary">
          {formatCurrency(row.getValue("couteAmount"), currency)}
        </div>
      ),
    },
  ];
}

export const defaultColumnVisibility: VisibilityState = {
  cuota: true,
  couteAmount: true,
  expectedPaymentDate: true,
};
