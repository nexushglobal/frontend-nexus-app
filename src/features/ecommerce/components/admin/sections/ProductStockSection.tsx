// src/features/ecommerce/components/admin/sections/ProductStockSection.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  stockFormSchema,
  StockFormType,
} from '@/features/ecommerce/schemas/product-edit-form.schema';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { zodResolver } from '@hookform/resolvers/zod';
import { History, Loader2, Minus, Package, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { addStockProductAction } from '../../../actions/post-product';
import { ProductService } from '../../../service/productService';
import type {
  ProductDetailAdmin,
  StockProductHistoryResponse,
} from '../../../types/product.type';

interface ProductStockSectionProps {
  product: ProductDetailAdmin;
  stockHistory: StockProductHistoryResponse;
  onStockUpdate: () => void;
}

export function ProductStockSection({
  product,
  stockHistory: initialStockHistory,
  onStockUpdate,
}: ProductStockSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [stockHistory, setStockHistory] = useState(initialStockHistory);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const form = useForm<StockFormType>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      actionType: 'INCREASE',
      quantity: 1,
      description: '',
    },
  });

  const handlePageChange = async (page: number) => {
    setIsLoadingHistory(true);
    try {
      const newHistory = await ProductService.getHistoryProductStock(
        product.id,
        { limit: stockHistory.pagination.limit, page },
      );
      setStockHistory(newHistory);
    } catch (error) {
      toast.error('Error al cargar el historial');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleLimitChange = async (limit: number) => {
    setIsLoadingHistory(true);
    try {
      const newHistory = await ProductService.getHistoryProductStock(
        product.id,
        { limit, page: 1 },
      );
      setStockHistory(newHistory);
    } catch (error) {
      toast.error('Error al cargar el historial');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const onSubmit = (data: StockFormType) => {
    // Validar que no se pueda decrementar más stock del disponible
    if (data.actionType === 'DECREASE' && data.quantity > product.stock) {
      toast.error(`No se puede decrementar más de ${product.stock} unidades`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await addStockProductAction(product.id, data);

        if (result.success) {
          toast.success(result.message);
          onStockUpdate();
          form.reset();
          // Recargar historial después de agregar stock
          const newHistory = await ProductService.getHistoryProductStock(
            product.id,
            { limit: stockHistory.pagination.limit, page: 1 },
          );
          setStockHistory(newHistory);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error al actualizar el stock');
        console.error('Error updating stock:', error);
      }
    });
  };

  const getActionTypeLabel = (actionType: string) => {
    return actionType === 'INCREASE' ? 'Ingreso' : 'Salida';
  };

  const getActionTypeIcon = (actionType: string) => {
    return actionType === 'INCREASE' ? (
      <Plus className="h-3 w-3 text-green-600" />
    ) : (
      <Minus className="h-3 w-3 text-red-600" />
    );
  };

  const getActionTypeColor = (actionType: string) => {
    return actionType === 'INCREASE' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Stock Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">
                Cantidad disponible
              </p>
              <p className="text-3xl font-bold">{product.stock} unidades</p>
            </div>
            <div>
              <Badge
                variant={
                  product.stock <= 10
                    ? 'destructive'
                    : product.stock <= 20
                    ? 'secondary'
                    : 'default'
                }
              >
                {product.stock <= 10
                  ? 'Stock Bajo'
                  : product.stock <= 20
                  ? 'Stock Limitado'
                  : 'Stock Normal'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario para Agregar/Quitar Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Gestionar Stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="actionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Movimiento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INCREASE">
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4 text-green-600" />
                              Aumentar Stock
                            </div>
                          </SelectItem>
                          <SelectItem value="DECREASE">
                            <div className="flex items-center gap-2">
                              <Minus className="h-4 w-4 text-red-600" />
                              Disminuir Stock
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max={
                            form.watch('actionType') === 'DECREASE'
                              ? product.stock
                              : undefined
                          }
                          placeholder="Ingrese la cantidad"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Motivo del cambio de stock..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Actualizar Stock
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Historial de Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {stockHistory.items.length === 0 ? (
            <div className="text-center py-8 px-6">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay movimientos de stock registrados
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Tipo</th>
                        <th className="text-left p-4 font-medium">Cantidad</th>
                        <th className="text-left p-4 font-medium">
                          Stock Anterior
                        </th>
                        <th className="text-left p-4 font-medium">
                          Stock Nuevo
                        </th>
                        <th className="text-left p-4 font-medium">Usuario</th>
                        <th className="text-left p-4 font-medium">Fecha</th>
                        <th className="text-left p-4 font-medium">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockHistory.items.map((movement) => (
                        <tr
                          key={movement.id}
                          className="border-b hover:bg-muted/25"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getActionTypeIcon(movement.actionType)}
                              <span className="font-medium">
                                {getActionTypeLabel(movement.actionType)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-semibold ${getActionTypeColor(
                                movement.actionType,
                              )}`}
                            >
                              {movement.actionType === 'INCREASE' ? '+' : '-'}
                              {movement.quantityChanged}
                            </span>
                          </td>
                          <td className="p-4">{movement.previousQuantity}</td>
                          <td className="p-4">{movement.newQuantity}</td>
                          <td className="p-4">
                            <div className="text-sm">
                              {movement.updatedBy.email}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {new Date(movement.createdAt).toLocaleDateString(
                                'es-ES',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {movement.notes || '-'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {stockHistory.items.map((movement) => (
                  <Card key={movement.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getActionTypeIcon(movement.actionType)}
                          <span className="font-medium">
                            {getActionTypeLabel(movement.actionType)}
                          </span>
                          <span
                            className={`font-semibold ${getActionTypeColor(
                              movement.actionType,
                            )}`}
                          >
                            {movement.actionType === 'INCREASE' ? '+' : '-'}
                            {movement.quantityChanged}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Stock anterior:
                          </span>
                          <span>{movement.previousQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Stock nuevo:
                          </span>
                          <span>{movement.newQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Usuario:
                          </span>
                          <span>{movement.updatedBy.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha:</span>
                          <span>
                            {new Date(movement.createdAt).toLocaleDateString(
                              'es-ES',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </span>
                        </div>
                        {movement.notes && (
                          <div className="pt-2 border-t">
                            <span className="text-muted-foreground">
                              Descripción:
                            </span>
                            <p className="text-sm mt-1">{movement.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación */}
              <div className="border-t">
                <TablePagination
                  pagination={stockHistory.pagination}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoadingHistory}
                  compact={true}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
