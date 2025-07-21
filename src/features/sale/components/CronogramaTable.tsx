"use client";

import { DataTable } from "@/features/shared/components/table/DataTable";
import { VisibilityState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  createCronogramaColumns,
  defaultColumnVisibility,
} from "./columns/CronogramaColumns";
import { Amortization } from "../types/sale-response.types";
import { CurrencyType } from "../types/sale.enums";

interface CronogramaTableProps {
  data: Amortization[];
  isLoading?: boolean;
  currency: CurrencyType;
}

export function CronogramaTable({
  data,
  isLoading = false,
  currency = CurrencyType.PEN,
}: CronogramaTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
  );

  const columns = useMemo(
    () =>
      createCronogramaColumns({
        currency,
      }),
    [, currency]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      emptyMessage="No hay cronograma para mostrar."
    />
  );
}
