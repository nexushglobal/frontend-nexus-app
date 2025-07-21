"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import {
  SALE_STATUS_LABELS,
  SALE_TYPE_LABELS,
} from "../constants/sale.constants";
import { useSales } from "../hooks/useSales";
import { SalesTable } from "../components/SalesTable";
import { SaleCard } from "../components/SaleCard";

export function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { sales, loading } = useSales();

  const filteredSales = useMemo(() => {
    let filtered = [...sales];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (sale) =>
          sale.clientFullName.toLowerCase().includes(term) ||
          sale.id.toLowerCase().includes(term) ||
          sale.saleIdReference.toLowerCase().includes(term) ||
          (sale.phone && sale.phone.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "all")
      filtered = filtered.filter((sale) => sale.status === statusFilter);

    if (typeFilter !== "all")
      filtered = filtered.filter((sale) => sale.type === typeFilter);

    return filtered;
  }, [sales, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
        <p className="text-muted-foreground">
          Gestiona y visualiza todas las ventas realizadas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ventas</CardTitle>
          <CardDescription>
            {filteredSales.length} venta{filteredSales.length !== 1 ? "s" : ""}{" "}
            encontrada{filteredSales.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, ID, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(SALE_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.entries(SALE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden md:block">
            <SalesTable data={filteredSales} isLoading={loading} />
          </div>
          <div className="md:hidden">
            <SaleCard data={filteredSales} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
