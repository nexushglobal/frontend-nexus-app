'use client';

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
  ProductEditFormType,
  productEditSchema,
} from '@/features/ecommerce/schemas/product-edit-form.schema';
import { Switch } from '@/features/shared/components/form/Switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Edit, Loader2, Package, Tag } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateProductAction } from '../../../actions/post-product';
import type {
  CategoryDetail,
  ProductDetailAdmin,
} from '../../../types/product.type';
import { ProductBenefitsManager } from './ProductBenefitsManager';

interface ProductDetailFormProps {
  product: ProductDetailAdmin;
  categories: CategoryDetail[];
  onUpdate: () => void;
}

export function ProductDetailForm({
  product,
  categories,
  onUpdate,
}: ProductDetailFormProps) {
  const [isPending, startTransition] = useTransition();
  const [benefits, setBenefits] = useState<string[]>(product.benefits || []);

  const form = useForm<ProductEditFormType>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      name: product.name,
      categoryId: product.category.id.toString(),
      description: product.description || '',
      composition: product.composition || '',
      memberPrice: product.memberPrice,
      publicPrice: product.publicPrice,
      isActive: product.isActive,
      benefits: product.benefits || [],
    },
  });

  const onSubmit = (data: ProductEditFormType) => {
    startTransition(async () => {
      try {
        const result = await updateProductAction(product.id, data);

        if (result.success) {
          toast.success(result.message);
          onUpdate();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error inesperado al actualizar el producto');
        console.error('Error updating product:', error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat.isActive)
                          .map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa el producto"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="composition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Composición</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalle la composición del producto"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Precios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configuración de Precios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="memberPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Socio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Público</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Estado del Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Producto Activo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      El producto estará visible para los usuarios
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Beneficios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Beneficios del Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductBenefitsManager
              benefits={benefits}
              onBenefitsChange={setBenefits}
            />
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Form>
  );
}
