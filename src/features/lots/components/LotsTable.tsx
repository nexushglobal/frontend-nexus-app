"use client";

import { DataTable } from "@/features/shared/components/table/DataTable";
import { VisibilityState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { Lot } from "../types/lots.types";
import {
  createLotsColumns,
  defaultColumnVisibility,
} from "./columns/lotsColumns";

interface LotsTableProps {
  data: Lot[];
  isLoading?: boolean;
  currency?: string;
}

export function LotsTable({
  data,
  isLoading = false,
  currency = "PEN",
}: LotsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
  );

  const columns = useMemo(
    () =>
      createLotsColumns({
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
      emptyMessage="No hay lotes activos para mostrar. Selecciona un proyecto y configura los filtros."
    />
  );
}
