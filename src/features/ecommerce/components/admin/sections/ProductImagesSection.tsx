// src/features/ecommerce/components/admin/sections/ProductImagesSection.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/features/shared/components/form/Switch';
import { Edit, Images, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  addProductImageAction,
  deleteProductImageAction,
  updateProductImageAction,
} from '../../../actions/post-product';
import type {
  ProductDetailAdmin,
  ProductImage,
} from '../../../types/product.type';

interface ProductImagesSectionProps {
  product: ProductDetailAdmin;
  onUpdate: () => void;
}

export function ProductImagesSection({
  product,
  onUpdate,
}: ProductImagesSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(0);
  const [editIsMain, setEditIsMain] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor seleccione un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es muy grande. Máximo 5MB permitido');
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const result = await addProductImageAction(product.id, formData);

        if (result.success) {
          toast.success(result.message);
          onUpdate();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error al subir la imagen');
        console.error('Error uploading image:', error);
      }
    });

    // Limpiar el input
    event.target.value = '';
  };

  const handleEditImage = (image: ProductImage) => {
    setEditingImage(image);
    setEditOrder(image.order);
    setEditIsMain(image.isMain);
    setIsEditDialogOpen(true);
  };

  const handleUpdateImage = () => {
    if (!editingImage) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('order', editOrder.toString());
        formData.append('isMain', editIsMain.toString());

        const result = await updateProductImageAction(
          product.id,
          editingImage.id,
          formData,
        );

        if (result.success) {
          toast.success(result.message);
          onUpdate();
          setIsEditDialogOpen(false);
          setEditingImage(null);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Error al actualizar la imagen');
        console.error('Error updating image:', error);
      }
    });
  };

  const handleDeleteImage = (image: ProductImage) => {
    if (product.images.length === 1) {
      toast.error('No se puede eliminar la única imagen del producto');
      return;
    }

    if (confirm('¿Está seguro que desea eliminar esta imagen?')) {
      startTransition(async () => {
        try {
          const result = await deleteProductImageAction(product.id, image.id);

          if (result.success) {
            toast.success(result.message);
            onUpdate();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error('Error al eliminar la imagen');
          console.error('Error deleting image:', error);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Images className="h-5 w-5" />
              Gestión de Imágenes ({product.images.length})
            </CardTitle>
            <Button
              onClick={handleAddImage}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Agregar Imagen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            className="hidden"
          />

          {product.images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Images className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay imágenes cargadas</p>
              <p className="text-sm text-muted-foreground">
                Haga clic en "Agregar Imagen" para subir la primera imagen
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.images
                .sort((a, b) => a.order - b.order)
                .map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={image.url}
                        alt={`Imagen ${image.order}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Indicador de imagen principal */}
                      {image.isMain && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Principal
                          </div>
                        </div>
                      )}

                      {/* Orden */}
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                          #{image.order}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditImage(image)}
                          disabled={isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image)}
                          disabled={isPending || product.images.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagen</DialogTitle>
          </DialogHeader>

          {editingImage && (
            <div className="space-y-4">
              {/* Vista previa de la imagen */}
              <div className="aspect-square w-32 mx-auto rounded-lg overflow-hidden border">
                <img
                  src={editingImage.url}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Orden */}
              <div className="space-y-2">
                <Label htmlFor="order">Orden de visualización</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={editOrder}
                  onChange={(e) => setEditOrder(parseInt(e.target.value) || 1)}
                />
              </div>

              {/* Imagen principal */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Imagen Principal</Label>
                  <div className="text-sm text-muted-foreground">
                    Esta será la imagen que se muestre por defecto
                  </div>
                </div>
                <Switch checked={editIsMain} onCheckedChange={setEditIsMain} />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpdateImage} disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
