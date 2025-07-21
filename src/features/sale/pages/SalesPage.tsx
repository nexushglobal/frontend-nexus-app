"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search, Filter } from "lucide-react";
import { Sale } from "../types/sale.types";
import {
  SALE_STATUS_LABELS,
  SALE_TYPE_LABELS,
  SALE_STATUS_VARIANTS,
  SALE_TYPE_VARIANTS,
} from "../constants/sale.constants";
import { useSales } from "../hooks/useSales";

export function SalesPage() {
  const router = useRouter();
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { sales } = useSales();

  useEffect(() => {
    filterSales();
  }, [sales, searchTerm, statusFilter, typeFilter]);

  const filterSales = () => {
    let filtered = [...sales];

    // Filtro por término de búsqueda
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

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((sale) => sale.status === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((sale) => sale.type === typeFilter);
    }

    setFilteredSales(filtered);
  };

  const handleViewDetail = (saleId: string) => {
    router.push(`/dashboard/ventas/${saleId}`);
  };

  const formatCurrency = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

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
          {/* Filtros */}
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

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Cuotas</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Filter className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No se encontraron ventas con los filtros aplicados
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        {sale.clientFullName}
                      </TableCell>
                      <TableCell>{sale.phone || "--"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={SALE_TYPE_VARIANTS[sale.type].variant}
                          className={SALE_TYPE_VARIANTS[sale.type].className}
                        >
                          {SALE_TYPE_LABELS[sale.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={SALE_STATUS_VARIANTS[sale.status].variant}
                          className={
                            SALE_STATUS_VARIANTS[sale.status].className
                          }
                        >
                          {SALE_STATUS_LABELS[sale.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(sale.amount, sale.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {sale.numberCoutes || "--"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(sale.saleIdReference)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
