'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ProductImage } from '@/features/ecommerce/types/product.type';
import { Package, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  name: string;
  images?: ProductImage[];
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [selected, setSelected] = useState<string | null>(
    images?.find((i) => i.isMain)?.url || images?.[0]?.url || null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const main = selected || images?.[0]?.url || null;

  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-md border bg-card group cursor-pointer"
        onClick={() => main && setModalOpen(true)}
      >
        {main ? (
          <>
            <Image src={main} alt={name} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur px-2 py-1 rounded text-xs flex items-center gap-1">
              <ZoomIn className="h-3 w-3" /> Ver
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {images && images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {images.slice(0, 10).map((img) => (
            <button
              key={img.id}
              className={`relative aspect-square overflow-hidden rounded-md border ${
                selected === img.url ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelected(img.url)}
            >
              <Image
                src={img.url}
                alt={`${name}-${img.id}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video">
            {main ? (
              <Image src={main} alt={name} fill className="object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
