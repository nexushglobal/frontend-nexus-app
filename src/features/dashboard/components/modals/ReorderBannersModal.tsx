'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useActiveBanners, useReorderBanners } from '../../hooks/useBanners';

interface ReorderBannersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SortableBannerRowProps {
  banner: {
    id: string;
    imageUrl: string;
    title?: string;
    description?: string;
  };
  index: number;
}

function SortableBannerRow({ banner, index }: SortableBannerRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''} cursor-move`}
      {...attributes}
    >
      <TableCell className="w-12">
        <div
          {...listeners}
          className="flex items-center justify-center p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="w-16 font-mono text-sm">{index + 1}</TableCell>
      <TableCell className="w-24">
        <div className="relative h-12 w-20 overflow-hidden rounded border bg-muted">
          <Image
            src={banner.imageUrl}
            alt={banner.title || 'Banner'}
            fill
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{banner.title || 'Sin título'}</p>
          {banner.description && (
            <p className="text-sm text-muted-foreground truncate max-w-[300px]">
              {banner.description}
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ReorderBannersModal({
  isOpen,
  onClose,
}: ReorderBannersModalProps) {
  const [banners, setBanners] = useState<
    Array<{
      id: string;
      imageUrl: string;
      title?: string;
      description?: string;
    }>
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: activeBanners, isLoading } = useActiveBanners();
  const reorderMutation = useReorderBanners();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Initialize banners when data is loaded
  useEffect(() => {
    if (activeBanners) {
      setBanners(activeBanners);
      setHasChanges(false);
    }
  }, [activeBanners]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  }

  const handleSave = async () => {
    try {
      const reorderData = banners.map((banner, index) => ({
        id: banner.id,
        order: index + 1,
      }));

      await reorderMutation.mutateAsync({ banners: reorderData });
      toast.success('Orden de banners actualizado exitosamente');
      setHasChanges(false);
      onClose();
    } catch {
      toast.error('Error al actualizar el orden de los banners');
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      // Reset to original order
      if (activeBanners) {
        setBanners(activeBanners);
        setHasChanges(false);
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Reordenar Banners Activos</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Arrastra los banners para cambiar su orden de visualización
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Cargando banners activos...</span>
            </div>
          ) : banners.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">
                  No hay banners activos para reordenar
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Activa algunos banners primero
                </p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="w-16">Orden</TableHead>
                      <TableHead className="w-24">Imagen</TableHead>
                      <TableHead>Información</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={banners.map((b) => b.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {banners.map((banner, index) => (
                        <SortableBannerRow
                          key={banner.id}
                          banner={banner}
                          index={index}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {hasChanges && (
              <span className="text-orange-600 font-medium">
                Tienes cambios sin guardar
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              {hasChanges ? 'Cancelar' : 'Cerrar'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || reorderMutation.isPending}
            >
              {reorderMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Guardar Orden'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
