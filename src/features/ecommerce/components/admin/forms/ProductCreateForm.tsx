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
import { Switch } from '@/features/shared/components/form/Switch';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DollarSign,
  Image as ImageIconLucide,
  Loader2,
  Package,
  Tag,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getCategoriesAction } from '../../../actions/get-products';
import { createProductAction } from '../../../actions/post-product';
import {
  ProductFormSchema,
  type ProductFormType,
} from '../../../schemas/product-form.schema';
import type { CategoryDetail } from '../../../types/product.type';
import { ProductErrorModal } from '../modals/ProductErrorModal';
import { ProductSuccessModal } from '../modals/ProductSuccessModal';
import { ProductBenefitsManager } from './ProductBenefitsManager';
import { ProductImageUpload } from './ProductImageUpload';

interface CreateProductResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    sku: string;
    memberPrice: number;
    publicPrice: number;
  };
  errors?: string;
}

interface ProductCreateFormProps {
  onSuccess?: () => void;
}

export function ProductCreateForm({ onSuccess }: ProductCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successData, setSuccessData] = useState<
    CreateProductResponse['data'] | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      composition: '',
      memberPrice: 0,
      publicPrice: 0,
      stock: 0,
      benefits: [],
      categoryId: 0,
      isActive: true,
      images: [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
    replace: replaceImages,
  } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesAction();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          toast.error('Error al cargar las categorías');
        }
      } catch (error) {
        toast.error('Error al cargar las categorías');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleAddImages = (newImages: typeof imageFields) => {
    newImages.forEach((image) => {
      appendImage(image);
    });
  };

  const handleSubmit = (data: ProductFormType) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('composition', data.composition || '');
        formData.append('memberPrice', data.memberPrice.toString());
        formData.append('publicPrice', data.publicPrice.toString());

        if (data.stock !== undefined && data.stock !== null) {
          formData.append('stock', data.stock.toString());
        }

        if (data.benefits && data.benefits.length > 0) {
          const benefitsArray = data.benefits.map((b) => b.benefit);
          formData.append('benefits', JSON.stringify(benefitsArray));
        }

        formData.append('categoryId', data.categoryId.toString());
        formData.append('isActive', data.isActive ? 'true' : 'false');

        data.images.forEach((image) => {
          formData.append('productImages', image.file);
        });

        const response = await createProductAction(formData);

        if (response.success && response.data) {
          setSuccessData(response.data);
          setShowSuccessModal(true);
          toast.success(response.message);
          onSuccess?.();
        } else {
          setErrorMessage(response.message || 'Error al crear el producto');
          setShowErrorModal(true);
        }
      } catch (error) {
        setErrorMessage('Error inesperado al crear el producto');
        setShowErrorModal(true);
      }
    });
  };

  const handleCreateAnother = () => {
    form.reset();
    replaceImages([]);
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  const handleGoToList = () => {
    router.push('/dashboard/fac-ecommerce/productos');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleRetry = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Crear Producto
            </h1>
            <p className="text-muted-foreground">
              Agrega un nuevo producto al catálogo
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
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
                          <Input
                            placeholder="Ej: Proteína Whey Gold"
                            {...field}
                          />
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
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value.toString()}
                          disabled={isLoadingCategories}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
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
                          placeholder="Describe el producto, sus características principales..."
                          className="min-h-[120px]"
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
                      <FormLabel>Composición (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingredientes, componentes, información nutricional..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Precios y Stock */}

            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Estado del Producto</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          {field.value
                            ? 'El producto estará visible en la tienda'
                            : 'El producto estará oculto en la tienda'}
                        </p>
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
                  <Tag className="h-5 w-5 text-primary" />
                  Beneficios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductBenefitsManager control={form.control} />
              </CardContent>
            </Card>

            {/* Imágenes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIconLucide className="h-5 w-5 text-primary" />
                  Imágenes del Producto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductImageUpload
                  images={imageFields}
                  onAddImages={(values: any) => handleAddImages(values)}
                  onRemoveImage={removeImage}
                  maxImages={5}
                />
              </CardContent>
            </Card>

            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Precios y Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Inicial (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
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
              </CardContent>
            </Card>
            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Producto
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Success Modal */}
      <ProductSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        data={successData || null}
        onCreateAnother={handleCreateAnother}
        onGoToList={handleGoToList}
      />

      {/* Error Modal */}
      <ProductErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    </>
  );
}
