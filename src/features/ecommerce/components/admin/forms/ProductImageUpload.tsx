'use client';

import { Button } from '@/components/ui/button';
import { Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  ProductImageSchema,
  type ProductImageType,
} from '../../../schemas/product-form.schema';

interface ProductImageUploadProps {
  images: ProductImageType[];
  onAddImages: (images: ProductImageType[]) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
}

export function ProductImageUpload({
  images,
  onAddImages,
  onRemoveImage,
  maxImages = 5,
}: ProductImageUploadProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (images.length + files.length > maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const validImages: ProductImageType[] = [];

    files.forEach((file) => {
      const result = ProductImageSchema.safeParse({ file });
      if (result.success) {
        validImages.push({ file });
      } else {
        toast.error(result.error.errors[0]?.message || 'Archivo inválido');
      }
    });

    if (validImages.length > 0) {
      onAddImages(validImages);
    }

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted">
              <img
                src={URL.createObjectURL(image.file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemoveImage(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 cursor-pointer flex flex-col items-center justify-center transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground text-center">
              Subir imagen
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Máximo {maxImages} imágenes. Formatos: JPG, PNG, WEBP. Tamaño máximo:
        5MB por imagen.
      </p>
    </div>
  );
}
